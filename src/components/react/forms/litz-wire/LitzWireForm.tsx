import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Form } from "@/components/react/ui";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	SelectField,
	InputField,
	type SelectOption,
} from "@/components/react/shared/FormFields";
import { PartNumberDisplay } from "./PartNumberDisplay";
import { generatePartNumber } from "./utils";
import {
	type FormValues,
	type LitzWireFormProps,
	formSchema,
	CONDUCTOR_MATERIALS,
	INSULATION_TYPES,
	COLOR_CODES,
	MAGNET_WIRE_GRADES,
} from "./types";
import { usePartNumber } from "@/hooks/use-part-number";

// Convert readonly arrays to mutable arrays for SelectField
const conductorOptions: SelectOption[] = [...CONDUCTOR_MATERIALS];
const insulationOptions: SelectOption[] = [...INSULATION_TYPES];
const colorOptions: SelectOption[] = [...COLOR_CODES];
const magnetWireGradeOptions: SelectOption[] = [...MAGNET_WIRE_GRADES];

export function LitzWireForm({
	onSuccess,
	onError,
	className,
	initialValues,
}: LitzWireFormProps) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			conductor: initialValues?.conductor ?? "",
			magnetWireSize: initialValues?.magnetWireSize ?? "",
			strands: initialValues?.strands ?? "",
			insulation: initialValues?.insulation ?? "",
			color: initialValues?.color ?? "",
			magnetWireGrade: initialValues?.magnetWireGrade ?? "",
		},
		mode: "onTouched",
	});

	const formValues = form.watch();
	const partNumber = usePartNumber({
		formValues,
		generatePartNumber,
		onSuccess: (pn) => onSuccess?.(pn),
		onError: (err) =>
			onError?.(err instanceof Error ? err : new Error(String(err))),
	});

	return (
		<Form {...form}>
			<form className={className}>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Litz Wire Specifications</CardTitle>
							<CardDescription>
								Enter the specifications for your litz wire.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<SelectField
								control={form.control}
								name="conductor"
								label="Conductor Material"
								options={conductorOptions}
								required
							/>
							<InputField
								control={form.control}
								name="magnetWireSize"
								label="Magnet Wire Size (AWG)"
								type="number"
								min={12}
								max={50}
								step={1}
								required
							/>
							<InputField
								control={form.control}
								name="strands"
								label="Number of Strands"
								type="number"
								min={1}
								step={1}
								required
							/>
							<SelectField
								control={form.control}
								name="insulation"
								label="Insulation Type"
								options={insulationOptions}
								required
							/>
							<SelectField
								control={form.control}
								name="color"
								label="Color Code"
								options={colorOptions}
								required
							/>
							<SelectField
								control={form.control}
								name="magnetWireGrade"
								label="Magnet Wire Grade"
								options={magnetWireGradeOptions}
								required
							/>
						</CardContent>
					</Card>

					<PartNumberDisplay partNumber={partNumber} />
				</div>
			</form>
		</Form>
	);
}
