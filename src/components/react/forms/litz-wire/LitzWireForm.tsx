import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/react/ui/card";
import { Form } from "@/components/react/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	InputField,
	SelectField,
	type SelectOption,
} from "@/components/react/shared/FormFields";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { PartNumberDisplay } from "./PartNumberDisplay";
import {
	type FormValues,
	ENAMEL_BUILDS,
	type LitzWireFormProps,
	MAGNET_WIRE_GRADES,
	SERVE_LAYERS,
	formSchema,
} from "./types";
import { generatePartNumber } from "./utils";

// Convert readonly arrays to mutable arrays for SelectField
const enamelBuildOptions: SelectOption[] = [...ENAMEL_BUILDS];
const magnetWireGradeOptions: SelectOption[] = [...MAGNET_WIRE_GRADES];
const serveLayerOptions: SelectOption[] = [...SERVE_LAYERS];

export function LitzWireForm({
	onSuccess,
	onError,
	className,
	initialValues,
}: LitzWireFormProps) {
	const [partNumber, setPartNumber] = useState("RL-XXXX-XX-X-XX");

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			numberOfStrands: initialValues?.numberOfStrands ?? "",
			strandSize: initialValues?.strandSize ?? "",
			insulation: initialValues?.insulation ?? "",
			magnetWireGrade: initialValues?.magnetWireGrade ?? "",
			serveLayers: initialValues?.serveLayers,
			uniqueIdentifier: initialValues?.uniqueIdentifier ?? "XX",
		},
		mode: "onChange",
	});

	const formValues = form.watch();

	useEffect(() => {
		try {
			const newPartNumber = generatePartNumber(formValues);
			setPartNumber(newPartNumber);
			onSuccess?.(newPartNumber);
		} catch (error) {
			onError?.(
				error instanceof Error
					? error
					: new Error("Failed to generate part number"),
			);
		}
	}, [formValues, onSuccess, onError]);

	const handleNumberOfStrandsChange = (value: string) => {
		const currentStrandSize = form.getValues("strandSize");
		if (currentStrandSize) {
			const size = currentStrandSize.split("/")[1] || currentStrandSize;
			form.setValue("strandSize", `${value}/${size}`, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		} else {
			form.setValue("numberOfStrands", value, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	};

	const handleStrandSizeChange = (value: string) => {
		const currentNumberOfStrands = form.getValues("numberOfStrands");
		if (currentNumberOfStrands) {
			form.setValue("strandSize", `${currentNumberOfStrands}/${value}`, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		} else {
			form.setValue("strandSize", value, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	};

	return (
		<div
			className={cn(
				"relative mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-24",
				className,
			)}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Build Your Part Number</CardTitle>
						<CardDescription>
							Fill out the form to generate your custom part number
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(() => {})}
								className="space-y-6"
								noValidate
							>
								<InputField
									control={form.control}
									name="numberOfStrands"
									label="Number of Strands"
									placeholder="Enter number of strands"
									type="number"
									min={1}
									step={1}
									required
									inputMode="numeric"
									pattern="[0-9]*"
									onChange={handleNumberOfStrandsChange}
								/>

								<InputField
									control={form.control}
									name="strandSize"
									label="Strand Size (AWG 12-50)"
									placeholder="Enter AWG size (12-50)"
									type="number"
									min={12}
									max={50}
									step={1}
									required
									inputMode="numeric"
									pattern="[0-9]*"
									onChange={handleStrandSizeChange}
								/>

								<SelectField
									control={form.control}
									name="insulation"
									label="Enamel Build"
									placeholder="Select enamel build"
									options={enamelBuildOptions}
									required
								/>

								<SelectField
									control={form.control}
									name="magnetWireGrade"
									label="Magnet Wire Grade"
									placeholder="Select grade"
									options={magnetWireGradeOptions}
									required
									onChange={(value) => {
										form.setValue("magnetWireGrade", value, {
											shouldValidate: true,
											shouldDirty: true,
											shouldTouch: true,
										});
									}}
								/>

								<SelectField
									control={form.control}
									name="serveLayers"
									label="Serve Layers (optional)"
									placeholder="Select serve layers"
									options={serveLayerOptions}
									onChange={(value) => {
										form.setValue("serveLayers", value, {
											shouldValidate: true,
											shouldDirty: true,
											shouldTouch: true,
										});
									}}
								/>

								<InputField
									control={form.control}
									name="uniqueIdentifier"
									label="Unique Identifier (Optional)"
									placeholder="Enter unique identifier"
									onChange={(value) => {
										form.setValue("uniqueIdentifier", value.toUpperCase(), {
											shouldValidate: false,
										});
									}}
								/>
							</form>
						</Form>
					</CardContent>
				</Card>

				<PartNumberDisplay partNumber={partNumber} />
			</div>
			<Toaster />
		</div>
	);
}
