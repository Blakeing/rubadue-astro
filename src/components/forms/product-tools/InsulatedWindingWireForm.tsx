import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	InputField,
	SelectField,
	type SelectOption,
	SelectWithCustomInput,
} from "@/components/ui/FormFields";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { PartNumberDisplay } from "./PartNumberDisplay";
import {
	COLOR_CODES,
	CONDUCTOR_MATERIALS,
	INSULATION_TYPES,
	type InsulatedWindingWirePartNumberBuilderProps,
	type InsulatedWireFormValues,
	LAYERS_OPTIONS,
	MAGNET_WIRE_GRADES,
	STRANDS_OPTIONS,
	THICKNESS_OPTIONS,
	insulatedWireFormSchema,
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

	const form = useForm<InsulatedWireFormValues>({
		resolver: zodResolver(insulatedWireFormSchema),
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
	const thicknessValue = form.watch("thickness");

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

	const handleConductorChange = (value: string) => {
		setIsLitzWire(value === "L");
		if (value === "L") {
			form.setValue("awgSize", "XX", { shouldValidate: false });
		} else {
			form.setValue("magnetWireSize", "", { shouldValidate: false });
			form.setValue("magnetWireGrade", undefined, { shouldValidate: false });
		}
	};

	// Transform the thickness value for display
	useEffect(() => {
		if (thicknessValue && thicknessValue !== "invalid") {
			const value = Number.parseFloat(thicknessValue);
			if (!Number.isNaN(value)) {
				// If the value is already transformed (1-250), don't transform again
				if (value >= 1 && value <= 250) {
					form.setValue("thickness", `-${value}`, { shouldValidate: false });
				} else if (value >= 0.001 && value <= 0.25) {
					// Transform original value (0.001-0.25) to display value (1-250)
					const multipliedValue = (value * 1000)
						.toFixed(2)
						.replace(/\.?0+$/, "");
					form.setValue("thickness", `-${multipliedValue}`, {
						shouldValidate: false,
					});
				}
			}
		}
	}, [thicknessValue, form]);

	return (
		<div
			className={cn(
				"relative mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-16",
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
								<SelectField
									control={form.control}
									name="layers"
									label="Layers of Insulation"
									placeholder="Select layers"
									options={layersOptions}
									required
								/>

								<SelectField
									control={form.control}
									name="conductor"
									label="Conductor Material"
									placeholder="Select conductor"
									options={conductorOptions}
									required
									onChange={handleConductorChange}
								/>

								{!isLitzWire && (
									<InputField
										control={form.control}
										name="awgSize"
										label="AWG Size (4-50)"
										placeholder="Enter AWG size (4-50)"
										type="number"
										min={4}
										max={50}
										step={1}
										required
										inputMode="numeric"
										pattern="[0-9]*"
										onChange={(value) => {
											form.setValue("awgSize", value.toUpperCase(), {
												shouldValidate: true,
											});
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
											const formattedValue = num < 10 ? `0${num}` : `${num}`;
											form.setValue("strands", formattedValue, {
												shouldValidate: true,
											});
										} else {
											form.setValue("strands", value, { shouldValidate: true });
										}
									}}
									onChange={(value) => {
										setShowCustomStrands(value === "custom");
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
										inputMode="numeric"
										pattern="[0-9]*"
										onChange={(value) => {
											const currentStrands = form.getValues("strands");
											if (currentStrands) {
												form.setValue(
													"magnetWireSize",
													`${currentStrands}/${value}`,
													{ shouldValidate: true },
												);
											} else {
												form.setValue("magnetWireSize", value, {
													shouldValidate: true,
												});
											}
										}}
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
									onChange={(value) => {
										// Just set the value directly without adding X's
										form.setValue("color", value, { shouldValidate: true });
									}}
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
										pattern: "[0-9]*.?[0-9]{0,3}",
									}}
									onCustomInputChange={(e) => {
										const value = Number.parseFloat(e.target.value);
										if (!e.target.value) {
											form.setValue("thickness", "", { shouldValidate: true });
										} else if (value >= 0.001 && value <= 0.25) {
											// Store the original value for validation
											form.setValue("thickness", value.toString(), {
												shouldValidate: true,
											});
										} else {
											form.setValue("thickness", "invalid", {
												shouldValidate: true,
											});
										}
									}}
									onChange={(value) => {
										setShowCustomThickness(value === "other");
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
										onChange={(value) => {
											form.setValue("magnetWireGrade", value, {
												shouldValidate: true,
											});
										}}
									/>
								)}
							</form>
						</Form>
					</CardContent>
				</Card>

				<PartNumberDisplay partNumber={partNumber} wireType="windingWire" />
			</div>
			<Toaster />
		</div>
	);
}
