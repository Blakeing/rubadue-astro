import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/react/ui/form";
import { Input } from "@/components/react/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/react/ui/select";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/react/ui/card";
import { Button } from "@/components/react/ui/button";
import { Copy } from "lucide-react";
import { toast, Toaster } from "sonner";

// Define options arrays before the schema
const layersOptions = [
	{ value: "S", label: "Single" },
	{ value: "D", label: "Double" },
	{ value: "T", label: "Triple" },
];

const conductorMaterials = [
	{ value: "A", label: "TPC (Tin Plated Copper)" },
	{ value: "B", label: "SPC (Silver Plated Copper)" },
	{ value: "C", label: "BS (Bare Copper)" },
	{ value: "D", label: "SPA 135" },
	{ value: "E", label: "Enamel" },
	{ value: "H", label: "Heavy Enamel" },
	{ value: "L", label: "Litz Wire" },
	{ value: "N", label: "NPC (Nickel Plated Copper)" },
	{ value: "Q", label: "QPN" },
	{ value: "S", label: "Stainless Steel" },
	{ value: "custom", label: "Contact Customer Service" },
	{ value: "other", label: "Others Available" },
];

const strandsOptions = [
	{ value: "01", label: "Solid" },
	{ value: "07", label: "7 Strands" },
	{ value: "19", label: "19 Strands" },
	{ value: "37", label: "37 Strands" },
	{ value: "65", label: "65 Strands" },
	{ value: "custom", label: "Custom (Enter number)" },
];

const insulationTypes = [
	{ value: "F", label: "FEP" },
	{ value: "P", label: "PFA" },
	{ value: "T", label: "ETFE" },
];

const colorCodes = [
	{ value: "0", label: "Black" },
	{ value: "1", label: "Brown" },
	{ value: "2", label: "Red" },
	{ value: "3", label: "Orange" },
	{ value: "4", label: "Yellow" },
	{ value: "5", label: "Green" },
	{ value: "6", label: "Blue" },
	{ value: "7", label: "Violet" },
	{ value: "8", label: "Gray" },
	{ value: "9", label: "White" },
	{ value: "C", label: "Clear" },
];

const thicknessOptions = [
	{ value: "-1", label: '.001"/layer' },
	{ value: "-1.5", label: '.0015"/layer' },
	{ value: "-2", label: '.002"/layer' },
	{ value: "-3", label: '.003"/layer' },
	{ value: "-5", label: '.005"/layer' },
	{ value: "other", label: "Other" },
];

const magnetWireGrades = [
	{ value: "MW79", label: "MW79" },
	{ value: "MW80", label: "MW80" },
	{ value: "MW77", label: "MW77" },
	{ value: "MW82", label: "MW82" },
	{ value: "MW83", label: "MW83" },
	{ value: "MW35", label: "MW35" },
	{ value: "MW16", label: "MW16" },
];

// Now define the schema with access to the options arrays
const formSchema = z
	.object({
		layers: z.string().min(1, "Required"),
		conductor: z.string().min(1, "Required"),
		awgSize: z.string().optional(),
		strands: z.string().min(1, "Required"),
		magnetWireSize: z
			.string()
			.optional()
			.refine(
				(val) => {
					if (!val) return true;

					const num = Number(val);
					return (
						!Number.isNaN(num) &&
						Number.isInteger(num) &&
						num >= 12 &&
						num <= 50
					);
				},
				{
					message: "Magnet wire size must be a whole number between 12-50 AWG",
				},
			),
		insulation: z.string().min(1, "Required"),
		color: z.string().min(1, "Required"),
		thickness: z.string().refine(
			(val) => {
				// Skip validation for predefined thickness options
				const predefinedValues = thicknessOptions
					.filter((option) => option.value !== "other")
					.map((option) => option.value);

				if (!val || predefinedValues.includes(val)) {
					return true;
				}

				// Only validate custom thickness values
				if (val.startsWith("-")) {
					const num = Number(val.substring(1));
					return !Number.isNaN(num) && num >= 0.001 && num <= 0.25;
				}
				return true;
			},
			{
				message: "Thickness must be between 0.001 and 0.250",
			},
		),
		magnetWireGrade: z.string().optional(),
	})
	.refine(
		(data) => {
			// Validate AWG size for non-Litz wire
			if (data.conductor !== "L") {
				if (!data.awgSize || data.awgSize.trim() === "") {
					return false;
				}

				if (data.awgSize.toUpperCase() === "XX") return true;

				const num = Number(data.awgSize);
				if (Number.isNaN(num) || num < 4 || num > 40) {
					return false;
				}
			}

			// Validate magnet wire size for Litz wire
			if (data.conductor === "L") {
				// Check if magnetWireSize is required but missing
				if (!data.magnetWireSize || data.magnetWireSize.trim() === "") {
					return false;
				}

				// Field-level validation will handle the range check

				// Validate magnet wire grade for Litz wire
				if (!data.magnetWireGrade || data.magnetWireGrade.trim() === "") {
					return false;
				}
			}

			return true;
		},
		{
			message: "Please check all required fields",
			path: ["_errors"], // This will show the error at the form level
		},
	);

type FormData = z.infer<typeof formSchema>;

export default function InsulatedWindingWirePartNumberBuilder() {
	const [partNumber, setPartNumber] = useState("");
	const [showCustomThickness, setShowCustomThickness] = useState(false);
	const [showCustomStrands, setShowCustomStrands] = useState(false);
	const [isLitzWire, setIsLitzWire] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			layers: "",
			conductor: "",
			awgSize: "",
			strands: "",
			magnetWireSize: "",
			insulation: "",
			color: "",
			thickness: "",
			magnetWireGrade: "",
		},
		mode: "onTouched",
	});

	const formValues = form.watch();

	useEffect(() => {
		// Check if Litz wire is selected
		setIsLitzWire(formValues.conductor === "L");

		// Format part number based on conductor type
		let newPartNumber = "";

		// Format AWG size to be 2 digits
		let formattedAwgSize = formValues.awgSize || "";
		if (
			formattedAwgSize &&
			formattedAwgSize !== "XX" &&
			!Number.isNaN(Number(formattedAwgSize))
		) {
			formattedAwgSize = formattedAwgSize.padStart(2, "0");
		}

		// Add X's after color based on layers
		let colorWithX = formValues.color || "";
		if (formValues.layers === "D" && colorWithX) {
			colorWithX = `${colorWithX}X`;
		} else if (formValues.layers === "T" && colorWithX) {
			colorWithX = `${colorWithX}XX`;
		}

		if (formValues.conductor === "L") {
			// Litz wire format
			const layers = formValues.layers || "";
			const strands = formValues.strands || "";
			const magnetWireSize = formValues.magnetWireSize || "";
			const strandInfo =
				strands && magnetWireSize ? `${strands}/${magnetWireSize}` : "";
			const insulation = formValues.insulation || "";
			const thickness = formValues.thickness || "";
			const magnetWireGrade = formValues.magnetWireGrade
				? `(${formValues.magnetWireGrade})`
				: "";

			newPartNumber = `${layers}XXL${strandInfo}${insulation}${colorWithX}${thickness}${magnetWireGrade}`;
		} else {
			// Standard wire format
			const layers = formValues.layers || "";
			const conductor = formValues.conductor || "";
			const strands = formValues.strands || "";
			const insulation = formValues.insulation || "";
			const thickness = formValues.thickness || "";

			newPartNumber = `${layers}${formattedAwgSize}${conductor}${strands}${insulation}${colorWithX}${thickness}`;
		}

		setPartNumber(newPartNumber);
	}, [formValues]);

	const copyToClipboard = () => {
		if (partNumber) {
			navigator.clipboard.writeText(partNumber);
			toast.success("Part number copied!", {
				description: "The part number has been copied to your clipboard",
			});
		}
	};

	return (
		<>
			<div className="relative mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-24 ">
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
								<form className="space-y-6">
									{/* Layers of Insulation */}
									<FormField
										control={form.control}
										name="layers"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Layers of Insulation</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select layers" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{layersOptions.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Conductor Material */}
									<FormField
										control={form.control}
										name="conductor"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Conductor Material</FormLabel>
												<Select
													onValueChange={(value) => {
														field.onChange(value);
														setIsLitzWire(value === "L");
														// Reset related fields when changing conductor type
														if (value === "L") {
															form.setValue("awgSize", "", {
																shouldValidate: false,
															});
														} else {
															form.setValue("magnetWireSize", "", {
																shouldValidate: false,
															});
															form.setValue("magnetWireGrade", "", {
																shouldValidate: false,
															});
														}
														// Only validate the conductor field
														form.trigger("conductor");
													}}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select conductor" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{conductorMaterials.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* AWG Size - Only show if not Litz wire */}
									{!isLitzWire && (
										<FormField
											control={form.control}
											name="awgSize"
											render={({ field }) => (
												<FormItem>
													<FormLabel>AWG Size (4-40)</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter AWG size (4-40)"
															{...field}
															onChange={(e) => {
																const value = e.target.value.toUpperCase();
																field.onChange(value);
																form.trigger("awgSize");
															}}
															onBlur={(e) => {
																field.onBlur();
																form.trigger("awgSize");
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}

									{/* Strands in Conductor */}
									<FormField
										control={form.control}
										name="strands"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Strands in Conductor</FormLabel>
												<div className="space-y-2">
													<Select
														onValueChange={(value) => {
															if (value === "custom") {
																setShowCustomStrands(true);
																field.onChange("");
															} else {
																setShowCustomStrands(false);
																field.onChange(value);
															}
														}}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select strands" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{strandsOptions.map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>

													{showCustomStrands && (
														<FormControl>
															<Input
																type="number"
																min="1"
																step="1"
																placeholder="Enter number of strands"
																onChange={(e) => {
																	const value = e.target.value;
																	// Ensure it's a valid number
																	const num = Number.parseInt(value, 10);
																	if (!Number.isNaN(num) && num > 0) {
																		// Format as string with leading zeros for single digits
																		field.onChange(
																			num < 10 ? `0${num}` : `${num}`,
																		);
																	} else {
																		field.onChange(value);
																	}
																	form.trigger("strands");
																}}
															/>
														</FormControl>
													)}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Magnet Wire Size - Only show if Litz wire */}
									{isLitzWire && (
										<FormField
											control={form.control}
											name="magnetWireSize"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Magnet Wire Size (AWG 12-50)</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="12"
															max="50"
															step="1"
															placeholder="Enter AWG size (12-50)"
															{...field}
															onChange={(e) => {
																const value = e.target.value;
																const num = Number.parseInt(value, 10);

																// Validate the input is a number between 12-50
																if (
																	!value ||
																	(Number.isInteger(num) &&
																		num >= 12 &&
																		num <= 50)
																) {
																	field.onChange(value);
																} else {
																	// If invalid, still update the field to show validation error
																	field.onChange(value);
																}

																// Trigger validation for this field
																form.trigger("magnetWireSize");
															}}
															onBlur={(e) => {
																field.onBlur();
																form.trigger("magnetWireSize");
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}

									{/* Insulation Type */}
									<FormField
										control={form.control}
										name="insulation"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Insulation Type</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select insulation" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{insulationTypes.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Color Code */}
									<FormField
										control={form.control}
										name="color"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Color Code</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select color" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{colorCodes.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Insulation Thickness */}
									<FormField
										control={form.control}
										name="thickness"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Insulation Thickness per Layer</FormLabel>
												<div className="space-y-2">
													<Select
														onValueChange={(value) => {
															if (value === "other") {
																setShowCustomThickness(true);
																field.onChange("");
															} else {
																setShowCustomThickness(false);
																field.onChange(value);
															}
														}}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select thickness" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{thicknessOptions.map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>

													{showCustomThickness && (
														<FormControl>
															<Input
																type="number"
																step="0.001"
																min="0.001"
																max="0.250"
																placeholder="Enter thickness (0.001-0.250)"
																onChange={(e) => {
																	const value = Number.parseFloat(
																		e.target.value,
																	);
																	if (!e.target.value) {
																		field.onChange("");
																	} else if (value >= 0.001 && value <= 0.25) {
																		field.onChange(`-${value}`);
																	} else {
																		// Set an invalid value to trigger validation
																		field.onChange("-invalid");
																	}
																	// Trigger validation after value change
																	form.trigger("thickness");
																}}
															/>
														</FormControl>
													)}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Magnet Wire Grade - Only show if Litz wire */}
									{isLitzWire && (
										<FormField
											control={form.control}
											name="magnetWireGrade"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Magnet Wire Grade</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select grade" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{magnetWireGrades.map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</form>
							</Form>
						</CardContent>
					</Card>

					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Generated Part Number</CardTitle>
								<CardDescription>
									Your custom part number will appear here as you fill out the
									form
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<Input
											value={partNumber}
											disabled
											className="font-mono text-xl w-full"
											placeholder="Part number"
										/>
										<Button
											variant="outline"
											size="sm"
											className="gap-2 whitespace-nowrap"
											onClick={copyToClipboard}
											disabled={!partNumber}
										>
											<Copy className="h-4 w-4" />
											Copy
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Example Part Numbers</CardTitle>
							</CardHeader>
							<CardContent className="space-y-8">
								<div>
									<div className="text-2xl font-mono tracking-wider mb-2">
										S14A19F1-5
									</div>
									<p className="text-sm text-muted-foreground">
										Single Insulated (1), 14 AWG, Tin Plated Copper, 19 Strands,
										FEP, Brown, .0015"/layer
									</p>
								</div>
								<div>
									<div className="text-2xl font-mono tracking-wider mb-2">
										DXXL360/44T3X-1.5(MW79)
									</div>
									<p className="text-sm text-muted-foreground">
										Double Insulated (2), Litz Wire, 360 Strands of 44 AWG,
										ETFE, Orange with X suffix, .0015"/layer, MW79 grade
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			<Toaster />
		</>
	);
}
