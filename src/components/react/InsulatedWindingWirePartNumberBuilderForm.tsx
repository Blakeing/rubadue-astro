import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
	SelectField,
	InputField,
	SelectWithCustomInput,
} from "@/components/react/shared/FormFields";

// Define options arrays as constants outside the component
const LAYERS_OPTIONS = [
	{ value: "S", label: "Single" },
	{ value: "D", label: "Double" },
	{ value: "T", label: "Triple" },
];

const CONDUCTOR_MATERIALS = [
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

const STRANDS_OPTIONS = [
	{ value: "01", label: "Solid" },
	{ value: "07", label: "7 Strands" },
	{ value: "19", label: "19 Strands" },
	{ value: "37", label: "37 Strands" },
	{ value: "65", label: "65 Strands" },
	{ value: "custom", label: "Custom (Enter number)" },
];

const INSULATION_TYPES = [
	{ value: "F", label: "FEP" },
	{ value: "P", label: "PFA" },
	{ value: "T", label: "ETFE" },
];

const COLOR_CODES = [
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

const THICKNESS_OPTIONS = [
	{ value: "-1", label: '.001"/layer' },
	{ value: "-1.5", label: '.0015"/layer' },
	{ value: "-2", label: '.002"/layer' },
	{ value: "-3", label: '.003"/layer' },
	{ value: "-5", label: '.005"/layer' },
	{ value: "other", label: "Other" },
];

const MAGNET_WIRE_GRADES = [
	{ value: "MW79", label: "MW79" },
	{ value: "MW80", label: "MW80" },
	{ value: "MW77", label: "MW77" },
	{ value: "MW82", label: "MW82" },
	{ value: "MW83", label: "MW83" },
	{ value: "MW35", label: "MW35" },
	{ value: "MW16", label: "MW16" },
];

// Create the form schema with validation
const formSchema = z
	.object({
		layers: z.string().min(1, "Required"),
		conductor: z.string().min(1, "Required"),
		awgSize: z
			.string()
			.min(1, "Required")
			.regex(/^\d+$/, "Must be a whole number")
			.refine((val) => {
				const num = Number.parseInt(val);
				return num >= 4 && num <= 40;
			}, "Must be between 4 and 40"),
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
				// Skip validation if the field is empty
				if (!val) return true;

				// Skip validation for predefined thickness options
				const predefinedValues = THICKNESS_OPTIONS.filter(
					(option) => option.value !== "other",
				).map((option) => option.value);

				if (predefinedValues.includes(val)) {
					return true;
				}

				// Validate custom thickness values
				if (val.startsWith("-")) {
					const num = Number(val.substring(1));
					return !Number.isNaN(num) && num >= 0.001 && num <= 0.25;
				}
				return false;
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

// Interface for example part numbers
interface ExamplePartNumber {
	id: string;
	number: string;
	description: string;
}

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

	// Memoize the part number generation logic to improve performance
	const generatePartNumber = useCallback((values: FormData) => {
		// Check if Litz wire is selected
		const isLitz = values.conductor === "L";

		// Format AWG size to be 2 digits
		let formattedAwgSize = values.awgSize || "";
		if (
			formattedAwgSize &&
			formattedAwgSize !== "XX" &&
			!Number.isNaN(Number(formattedAwgSize))
		) {
			formattedAwgSize = formattedAwgSize.padStart(2, "0");
		}

		// Add X's after color based on layers
		let colorWithX = values.color || "";
		if (values.layers === "D" && colorWithX) {
			colorWithX = `${colorWithX}X`;
		} else if (values.layers === "T" && colorWithX) {
			colorWithX = `${colorWithX}XX`;
		}

		if (isLitz) {
			// Litz wire format
			const layers = values.layers || "";
			const strands = values.strands || "";
			const magnetWireSize = values.magnetWireSize || "";
			const strandInfo =
				strands && magnetWireSize ? `${strands}/${magnetWireSize}` : "";
			const insulation = values.insulation || "";
			const thickness = values.thickness || "";
			const magnetWireGrade = values.magnetWireGrade
				? `(${values.magnetWireGrade})`
				: "";

			return `${layers}XXL${strandInfo}${insulation}${colorWithX}${thickness}${magnetWireGrade}`;
		}

		// Standard wire format
		const layers = values.layers || "";
		const conductor = values.conductor || "";
		const strands = values.strands || "";
		const insulation = values.insulation || "";
		const thickness = values.thickness || "";

		return `${layers}${formattedAwgSize}${conductor}${strands}${insulation}${colorWithX}${thickness}`;
	}, []);

	// Update part number when form values change
	useEffect(() => {
		const newPartNumber = generatePartNumber(formValues);
		setPartNumber(newPartNumber);
	}, [formValues, generatePartNumber]);

	// Memoize example part numbers
	const examplePartNumbers = useMemo<ExamplePartNumber[]>(
		() => [
			{
				id: "example-1",
				number: "S14A19F1-5",
				description:
					'Single Insulated (1), 14 AWG, Tin Plated Copper, 19 Strands, FEP, Brown, .0015"/layer',
			},
			{
				id: "example-2",
				number: "DXXL360/44T3X-1.5(MW79)",
				description:
					'Double Insulated (2), Litz Wire, 360 Strands of 44 AWG, ETFE, Orange with X suffix, .0015"/layer, MW79 grade',
			},
		],
		[],
	);

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
									<SelectField
										control={form.control}
										name="layers"
										label="Layers of Insulation"
										placeholder="Select layers"
										options={LAYERS_OPTIONS}
									/>

									{/* Conductor Material */}
									<SelectField
										control={form.control}
										name="conductor"
										label="Conductor Material"
										placeholder="Select conductor"
										options={CONDUCTOR_MATERIALS}
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
											onChange={(e) => {
												const value = e.target.value.toUpperCase();
												form.setValue("awgSize", value);
											}}
										/>
									)}

									{/* Strands in Conductor */}
									<SelectWithCustomInput
										control={form.control}
										name="strands"
										label="Strands in Conductor"
										placeholder="Select strands"
										options={STRANDS_OPTIONS}
										customOptionValue="custom"
										showCustomInput={showCustomStrands}
										setShowCustomInput={(show) => {
											setShowCustomStrands(show);
										}}
										customInputProps={{
											type: "number",
											min: 1,
											step: 1,
											placeholder: "Enter number of strands",
										}}
										onCustomInputChange={(e) => {
											const value = e.target.value;
											// Ensure it's a valid number
											const num = Number.parseInt(value, 10);
											if (!Number.isNaN(num) && num > 0) {
												form.setValue(
													"strands",
													num < 10 ? `0${num}` : `${num}`,
												);
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
											min="12"
											max="50"
											step="1"
											onChange={(e) => {
												// Always update the field value, validation will handle the constraints
												form.setValue("magnetWireSize", e.target.value);
											}}
										/>
									)}

									{/* Insulation Type */}
									<SelectField
										control={form.control}
										name="insulation"
										label="Insulation Type"
										placeholder="Select insulation"
										options={INSULATION_TYPES}
									/>

									{/* Color Code */}
									<SelectField
										control={form.control}
										name="color"
										label="Color Code"
										placeholder="Select color"
										options={COLOR_CODES}
									/>

									{/* Insulation Thickness */}
									<SelectWithCustomInput
										control={form.control}
										name="thickness"
										label="Insulation Thickness per Layer"
										placeholder="Select thickness"
										options={THICKNESS_OPTIONS}
										customOptionValue="other"
										showCustomInput={showCustomThickness}
										setShowCustomInput={(show) => {
											setShowCustomThickness(show);
										}}
										customInputProps={{
											type: "number",
											step: "0.001",
											min: "0.001",
											max: "0.250",
											placeholder: "Enter thickness (0.001-0.250)",
										}}
										onCustomInputChange={(e) => {
											const value = Number.parseFloat(e.target.value);
											if (!e.target.value) {
												form.setValue("thickness", "");
											} else if (value >= 0.001 && value <= 0.25) {
												form.setValue("thickness", `-${value}`);
												// Trigger validation
												form.trigger("thickness");
											} else {
												// Set an invalid value to trigger validation
												form.setValue("thickness", "-invalid");
												// Trigger validation
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
											options={MAGNET_WIRE_GRADES}
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
											onClick={() => {
												if (partNumber) {
													navigator.clipboard.writeText(partNumber);
													toast.success("Part number copied!", {
														description:
															"The part number has been copied to your clipboard",
													});
												}
											}}
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
								{examplePartNumbers.map((example) => (
									<div key={example.id}>
										<div className="font-medium font-mono tracking-wider mb-2">
											{example.number}
										</div>
										<p className="text-sm text-muted-foreground">
											{example.description}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			<Toaster />
		</>
	);
}
