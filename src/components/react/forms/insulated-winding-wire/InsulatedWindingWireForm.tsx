import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Form,
} from "@/components/react/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	InputField,
	SelectField,
	type SelectOption,
	SelectWithCustomInput,
} from "@/components/react/shared/FormFields";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { PartNumberDisplay } from "./PartNumberDisplay";
import {
	COLOR_CODES,
	CONDUCTOR_MATERIALS,
	type FormValues,
	INSULATION_TYPES,
	type InsulatedWindingWirePartNumberBuilderProps,
	LAYERS_OPTIONS,
	MAGNET_WIRE_GRADES,
	STRANDS_OPTIONS,
	THICKNESS_OPTIONS,
	formSchema,
} from "./types";
import { generatePartNumber } from "./utils";

// Convert readonly arrays to mutable arrays for SelectField
const layersOptions: SelectOption[] = [...LAYERS_OPTIONS];
const conductorOptions: SelectOption[] = [...CONDUCTOR_MATERIALS];
const strandsOptions: SelectOption[] = [...STRANDS_OPTIONS];
const insulationOptions: SelectOption[] = [...INSULATION_TYPES];
const colorOptions: SelectOption[] = [...COLOR_CODES];
const thicknessOptions: SelectOption[] = [...THICKNESS_OPTIONS];
const magnetWireGradeOptions: SelectOption[] = [...MAGNET_WIRE_GRADES];

export function InsulatedWindingWireForm({
	onSuccess,
	onError,
	className,
	initialValues,
}: InsulatedWindingWirePartNumberBuilderProps) {
	const [partNumber, setPartNumber] = useState("");
	const [showCustomThickness, setShowCustomThickness] = useState(false);
	const [showCustomStrands, setShowCustomStrands] = useState(false);
	const [isLitzWire, setIsLitzWire] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			layers: initialValues?.layers ?? "",
			conductor: initialValues?.conductor ?? "",
			awgSize: initialValues?.awgSize ?? "",
			strands: initialValues?.strands ?? "",
			magnetWireSize: initialValues?.magnetWireSize ?? "",
			insulation: initialValues?.insulation ?? "",
			color: initialValues?.color ?? "",
			thickness: initialValues?.thickness ?? "",
			magnetWireGrade: initialValues?.magnetWireGrade ?? "",
		},
		mode: "onTouched",
	});

	const formValues = form.watch();

	// Update part number when form values change
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
								{/* Layers of Insulation */}
								<SelectField
									control={form.control}
									name="layers"
									label="Layers of Insulation"
									placeholder="Select layers"
									options={layersOptions}
									required
								/>

								{/* Conductor Material */}
								<SelectField
									control={form.control}
									name="conductor"
									label="Conductor Material"
									placeholder="Select conductor"
									options={conductorOptions}
									required
									onChange={(value) => {
										setIsLitzWire(value === "L");

										// Reset related fields when changing conductor type
										if (value === "L") {
											form.setValue("awgSize", "", { shouldValidate: false });
										} else {
											form.setValue("magnetWireSize", "", {
												shouldValidate: false,
											});
											form.setValue("magnetWireGrade", "", {
												shouldValidate: false,
											});
										}
									}}
								/>

								{/* AWG Size - Only show if not Litz wire */}
								{!isLitzWire && (
									<InputField
										control={form.control}
										name="awgSize"
										label="AWG Size (4-40)"
										placeholder="Enter AWG size (4-40)"
										required
										onChange={(value) => {
											form.setValue("awgSize", value.toUpperCase());
										}}
									/>
								)}

								{/* Strands in Conductor */}
								<SelectWithCustomInput
									control={form.control}
									name="strands"
									label="Strands in Conductor"
									placeholder="Select strands"
									options={strandsOptions}
									customOptionValue="custom"
									showCustomInput={showCustomStrands}
									setShowCustomInput={setShowCustomStrands}
									required
									customInputProps={{
										type: "number",
										min: 1,
										step: 1,
										placeholder: "Enter number of strands",
									}}
									onCustomInputChange={(e) => {
										const value = e.target.value;
										const num = Number.parseInt(value, 10);
										if (!Number.isNaN(num) && num > 0) {
											form.setValue("strands", num < 10 ? `0${num}` : `${num}`);
										} else {
											form.setValue("strands", value);
										}
									}}
								/>

								{/* Magnet Wire Size - Only show if Litz wire */}
								{isLitzWire && (
									<InputField
										control={form.control}
										name="magnetWireSize"
										label="Magnet Wire Size (AWG 12-50)"
										placeholder="Enter AWG size (12-50)"
										type="number"
										min={12}
										max={50}
										step={1}
										required
									/>
								)}

								{/* Insulation Type */}
								<SelectField
									control={form.control}
									name="insulation"
									label="Insulation Type"
									placeholder="Select insulation"
									options={insulationOptions}
									required
								/>

								{/* Color Code */}
								<SelectField
									control={form.control}
									name="color"
									label="Color Code"
									placeholder="Select color"
									options={colorOptions}
									required
								/>

								{/* Insulation Thickness */}
								<SelectWithCustomInput
									control={form.control}
									name="thickness"
									label="Insulation Thickness per Layer"
									placeholder="Select thickness"
									options={thicknessOptions}
									customOptionValue="other"
									showCustomInput={showCustomThickness}
									setShowCustomInput={setShowCustomThickness}
									required
									customInputProps={{
										type: "number",
										step: 0.001,
										min: 0.001,
										max: 0.25,
										placeholder: "Enter thickness (0.001-0.250)",
									}}
									onCustomInputChange={(e) => {
										const value = Number.parseFloat(e.target.value);
										if (!e.target.value) {
											form.setValue("thickness", "");
										} else if (value >= 0.001 && value <= 0.25) {
											form.setValue("thickness", `-${value}`);
											form.trigger("thickness");
										} else {
											form.setValue("thickness", "-invalid");
											form.trigger("thickness");
										}
									}}
								/>

								{/* Magnet Wire Grade - Only show if Litz wire */}
								{isLitzWire && (
									<SelectField
										control={form.control}
										name="magnetWireGrade"
										label="Magnet Wire Grade"
										placeholder="Select grade"
										options={magnetWireGradeOptions}
										required
									/>
								)}
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
