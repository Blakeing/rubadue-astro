import { useState, useEffect, useMemo, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
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
import {
	SelectField,
	InputField,
	SelectWithCustomInput,
} from "@/components/react/shared/FormFields";

// Define constants for form options
const ENAMEL_BUILD_OPTIONS = [
	{ value: "S", label: "Single" },
	{ value: "H", label: "Heavy" },
];

const MAGNET_WIRE_GRADE_OPTIONS = [
	{ value: "MW79", label: "MW79-C" },
	{ value: "MW80", label: "MW80-C" },
	{ value: "MW16", label: "MW16-C" },
	{ value: "MW35", label: "MW35-C" },
	{ value: "MW77", label: "MW77-C" },
	{ value: "MW82", label: "MW82-C" },
	{ value: "MW83", label: "MW83-C" },
];

const SERVE_LAYER_OPTIONS = [
	{ value: "N", label: "None" },
	{ value: "F", label: "FEP" },
	{ value: "P", label: "PFA" },
	{ value: "T", label: "ETFE" },
];

const NUMBER_OF_STRANDS_OPTIONS = [
	{ value: "10", label: "10" },
	{ value: "20", label: "20" },
	{ value: "40", label: "40" },
	{ value: "60", label: "60" },
	{ value: "80", label: "80" },
	{ value: "100", label: "100" },
	{ value: "120", label: "120" },
	{ value: "150", label: "150" },
	{ value: "200", label: "200" },
	{ value: "250", label: "250" },
	{ value: "300", label: "300" },
	{ value: "350", label: "350" },
	{ value: "400", label: "400" },
	{ value: "450", label: "450" },
	{ value: "500", label: "500" },
	{ value: "custom", label: "Custom (Enter number)" },
];

// Create the form schema with validation
const formSchema = z.object({
	rubadueLitz: z.literal("RL").default("RL"),
	numberOfStrands: z
		.string()
		.min(1, "Required")
		.refine(
			(val) => {
				const num = Number(val);
				return !Number.isNaN(num) && num > 0 && Number.isInteger(num);
			},
			{
				message: "Must be a positive whole number",
			},
		),
	strandSize: z
		.string()
		.min(1, "Required")
		.refine(
			(val) => {
				const num = Number(val);
				return (
					!Number.isNaN(num) && Number.isInteger(num) && num >= 36 && num <= 50
				);
			},
			{
				message: "Must be a whole number between 36-50",
			},
		),
	enamelBuild: z.string().min(1, "Required"),
	magnetWireGrade: z.string().min(1, "Required"),
	serveLayer: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof formSchema>;

// Interface for example part numbers
interface ExamplePartNumber {
	id: string;
	number: string;
	description: string;
}

export default function LitzWirePartNumberBuilder() {
	const [partNumber, setPartNumber] = useState("");
	const [showCustomStrands, setShowCustomStrands] = useState(false);
	const uniqueIdentifier = "XX";

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			rubadueLitz: "RL",
			numberOfStrands: "",
			strandSize: "",
			enamelBuild: "",
			magnetWireGrade: "",
			serveLayer: "",
		},
		mode: "onTouched",
	});

	const formValues = form.watch();

	// Memoize the part number generation logic to improve performance
	const generatePartNumber = useCallback((values: FormData) => {
		const {
			rubadueLitz,
			numberOfStrands,
			strandSize,
			enamelBuild,
			magnetWireGrade,
			serveLayer,
		} = values;

		// Only generate if we have all required values
		if (
			!numberOfStrands ||
			!strandSize ||
			!enamelBuild ||
			!magnetWireGrade ||
			!serveLayer
		) {
			return "";
		}

		// Format the part number with the XX unique identifier
		return `${rubadueLitz}-${numberOfStrands}/${strandSize}${enamelBuild}-${magnetWireGrade}-${serveLayer}-${uniqueIdentifier}`;
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
				number: "RL-100/44S-MW79-C-F-XX",
				description:
					"Rubadue Litz, 100 strands of 44 AWG, Single build enamel, MW79-C grade, FEP serve, XX unique identifier",
			},
			{
				id: "example-2",
				number: "RL-250/40H-MW80-C-N-XX",
				description:
					"Rubadue Litz, 250 strands of 40 AWG, Heavy build enamel, MW80-C grade, No serve, XX unique identifier",
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
							<CardTitle>Build Your Litz Wire Part Number</CardTitle>
							<CardDescription>
								Fill out the form to generate your custom Litz wire part number
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form className="space-y-6">
									{/* Number of Strands */}
									<SelectWithCustomInput
										control={form.control}
										name="numberOfStrands"
										label="Number of Strands"
										placeholder="Select number of strands"
										options={NUMBER_OF_STRANDS_OPTIONS}
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
												form.setValue("numberOfStrands", `${num}`);
											} else {
												form.setValue("numberOfStrands", value);
											}
										}}
									/>

									{/* Strand Size */}
									<InputField
										control={form.control}
										name="strandSize"
										label="Strand Size (AWG 36-50)"
										placeholder="Enter AWG size (36-50)"
										type="number"
										min="36"
										max="50"
										step="1"
									/>

									{/* Enamel Build */}
									<SelectField
										control={form.control}
										name="enamelBuild"
										label="Enamel Build"
										placeholder="Select enamel build"
										options={ENAMEL_BUILD_OPTIONS}
									/>

									{/* Magnet Wire Grade */}
									<SelectField
										control={form.control}
										name="magnetWireGrade"
										label="Magnet Wire Grade"
										placeholder="Select grade"
										options={MAGNET_WIRE_GRADE_OPTIONS}
									/>

									{/* Serve Layer */}
									<SelectField
										control={form.control}
										name="serveLayer"
										label="Serve Layer"
										placeholder="Select serve layer"
										options={SERVE_LAYER_OPTIONS}
									/>
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
		</>
	);
}
