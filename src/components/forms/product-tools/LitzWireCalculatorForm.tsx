import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { InputField, SelectField } from "@/components/ui/FormFields";
import type {
	LitzCalculationResults,
	LitzFormValues,
	InsulationType,
	MagnetWireGrade,
	AWGData,
	InsulationTypeInfo,
	MagnetWireGradeInfo,
} from "./litz-types";
import {
	awgOptions,
	insulationTypes,
	magnetWireGrades,
	litzFormSchema,
	calculatorInfo,
} from "./litz-types";
import {
	calculateLitzConstruction,
	calculateInsulationDimensions,
	calculateElectricalProperties,
	calculateN1Max,
	generatePartNumber,
	validateConstruction,
} from "./litz-utils";

/**
 * Props for the Litz Wire Calculator form
 */
interface LitzWireCalculatorFormProps {
	/** Initial form values */
	initialValues?: Partial<LitzFormValues>;
	/** Callback when results are calculated */
	onResultsCalculated?: (results: LitzCalculationResults) => void;
	/** Additional class name for the form */
	className?: string;
}

/**
 * Litz Wire Design Calculator form component
 */
export default function LitzWireCalculatorForm({
	initialValues,
	onResultsCalculated,
	className,
}: LitzWireCalculatorFormProps) {
	const [results, setResults] = useState<LitzCalculationResults>({
		construction: {
			type: "Type 1",
			operations: 0,
			finalStrands: 0,
			isValid: false,
		},
		electrical: {
			totalCMA: 0,
			dcResistance: 0,
			dcResistancePerFoot: 0,
			equivalentAWG: "",
			skinDepth: 0,
			n1Max: 0,
			n1MaxCalculated: 0,
			skinDepthMils: 0,
		},
		dimensions: {
			bare: { min: 0, nom: 0, max: 0 },
			singleInsulated: { min: 0, nom: 0, max: 0 },
			doubleInsulated: { min: 0, nom: 0, max: 0 },
			tripleInsulated: { min: 0, nom: 0, max: 0 },
		},
		partNumbers: {
			bare: "",
			singleInsulated: "",
			doubleInsulated: "",
			tripleInsulated: "",
		},
		warnings: [],
		ulCompliant: false,
	});

	const form = useForm<LitzFormValues>({
		resolver: zodResolver(litzFormSchema),
		defaultValues: {
			strandCount: 20,
			awgSize: "28",
			insulationType: "FEP",
			magnetWireGrade: "MW80C",
			temperature: 20,
			frequency: 1000,
			...initialValues,
		},
		mode: "onChange",
	});

	const { control, watch } = form;

	// Watch form values
	const formValues = watch();

	// Extract and validate numeric values with proper type conversion
	const strandCount = Number(formValues.strandCount) || 0;
	const awgSize = formValues.awgSize;
	const insulationType = formValues.insulationType;
	const magnetWireGrade = formValues.magnetWireGrade;
	const temperature = Number(formValues.temperature) || 20;
	const frequency = Number(formValues.frequency) || 1000;

	// Validate that we have valid numeric values
	const isValidInput =
		!Number.isNaN(strandCount) &&
		strandCount > 0 &&
		!Number.isNaN(temperature) &&
		!Number.isNaN(frequency) &&
		frequency > 0 &&
		awgSize;

	// Validate form
	const isValidForm = isValidInput && insulationType && magnetWireGrade;

	// Update results when form values change
	useEffect(() => {
		if (!isValidForm) return;

		try {
			// Calculate construction
			const construction = calculateLitzConstruction(
				strandCount,
				Number(awgSize),
			);

			// Calculate electrical properties with all the Excel formulas
			const packingFactor = 1.2; // Will be calculated properly in utils
			const electricalProps = calculateElectricalProperties(
				strandCount,
				Number(awgSize),
				temperature,
				packingFactor,
				frequency,
			);

			// Calculate N1 Max for high-frequency analysis
			const n1MaxData = calculateN1Max(Number(awgSize), frequency, temperature);

			// Enhanced electrical properties
			const electrical = {
				totalCMA: electricalProps.totalCMA,
				dcResistance: electricalProps.dcResistance,
				dcResistancePerFoot: electricalProps.dcResistancePerFoot,
				equivalentAWG: electricalProps.equivalentAWG,
				skinDepth: electricalProps.skinDepth,
				n1Max: electricalProps.n1Max,
				n1MaxCalculated: n1MaxData.n1Max,
				skinDepthMils: n1MaxData.skinDepthMils,
			};

			// Calculate dimensions for different insulation types
			const dimensions = calculateInsulationDimensions(
				strandCount,
				Number(awgSize),
				insulationType,
				construction.finalStrands,
			);

			// Generate part numbers
			const partNumbers = {
				bare: generatePartNumber(strandCount, awgSize, "BARE", magnetWireGrade),
				singleInsulated: generatePartNumber(
					strandCount,
					awgSize,
					"SINGLE",
					magnetWireGrade,
				),
				doubleInsulated: generatePartNumber(
					strandCount,
					awgSize,
					"DOUBLE",
					magnetWireGrade,
				),
				tripleInsulated: generatePartNumber(
					strandCount,
					awgSize,
					"TRIPLE",
					magnetWireGrade,
				),
			};

			// Validate construction and get warnings
			const validation = validateConstruction(
				strandCount,
				Number(awgSize),
				insulationType,
			);

			const newResults: LitzCalculationResults = {
				construction,
				electrical,
				dimensions,
				partNumbers,
				warnings: validation.warnings,
				ulCompliant: validation.ulCompliant,
			};

			setResults(newResults);
			onResultsCalculated?.(newResults);
		} catch (error) {
			console.error("Error calculating litz wire results:", error);
		}
	}, [
		isValidForm,
		strandCount,
		awgSize,
		insulationType,
		magnetWireGrade,
		temperature,
		frequency,
		onResultsCalculated,
	]);

	return (
		<div className={className}>
			<div className="mb-8 space-y-2">
				<p className="text-muted-foreground">{calculatorInfo.description}</p>
			</div>

			<div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
				{/* Input Form */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Design Parameters</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Form {...form}>
							<form className="space-y-4">
								<InputField
									control={control}
									name="strandCount"
									label="Number of Strands"
									placeholder="Enter strand count"
									type="number"
									min={1}
									max={1000}
									required
								/>

								<SelectField
									control={control}
									name="awgSize"
									label="Strand AWG Size"
									placeholder="Select AWG size"
									options={awgOptions.map((awg: AWGData) => ({
										value: awg.value,
										label: `${awg.value} AWG (${awg.diameter.toFixed(4)}")`,
									}))}
									required
								/>

								<SelectField
									control={control}
									name="insulationType"
									label="Insulation Type"
									placeholder="Select insulation"
									options={insulationTypes.map((type: InsulationTypeInfo) => ({
										value: type.value,
										label: `${type.label} - ${type.description}`,
									}))}
									required
								/>

								<SelectField
									control={control}
									name="magnetWireGrade"
									label="Magnet Wire Grade"
									placeholder="Select grade"
									options={magnetWireGrades.map(
										(grade: MagnetWireGradeInfo) => ({
											value: grade.value,
											label: `${grade.label} (${grade.tempRating}°C)`,
										}),
									)}
									required
								/>

								<InputField
									control={control}
									name="temperature"
									label="Operating Temperature (°C)"
									placeholder="Enter temperature"
									type="number"
									min={-40}
									max={200}
									required
								/>

								<InputField
									control={control}
									name="frequency"
									label="Frequency (kHz)"
									placeholder="Enter frequency"
									type="number"
									min={1}
									max={10000}
									required
								/>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Construction Results */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Construction Analysis</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div>
								<Label className="text-sm font-medium">Litz Type</Label>
								<p className="text-lg font-semibold">
									{results.construction.type}
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">
									Operations Required
								</Label>
								<p className="text-lg font-semibold">
									{results.construction.operations}
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">Final Strands</Label>
								<p className="text-lg font-semibold">
									{results.construction.finalStrands}
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">Total CMA</Label>
								<p className="text-lg font-semibold">
									{results.electrical.totalCMA.toLocaleString()}
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">
									Equivalent Solid AWG
								</Label>
								<p className="text-lg font-semibold">
									{results.electrical.equivalentAWG} AWG
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">
									Construction Valid
								</Label>
								<Badge
									variant={
										results.construction.isValid ? "default" : "destructive"
									}
								>
									{results.construction.isValid ? "Valid" : "Invalid"}
								</Badge>
							</div>

							<div>
								<Label className="text-sm font-medium">UL Compliant</Label>
								<Badge variant={results.ulCompliant ? "default" : "secondary"}>
									{results.ulCompliant ? "Yes" : "No"}
								</Badge>
							</div>
						</div>

						{/* Warnings */}
						{results.warnings.length > 0 && (
							<div className="space-y-2">
								{results.warnings.map((warning: string) => (
									<Alert key={warning} variant="destructive">
										<AlertDescription className="text-xs">
											{warning}
										</AlertDescription>
									</Alert>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Electrical Properties */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Electrical Properties</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div>
								<Label className="text-sm font-medium">
									DC Resistance (Ω/1000ft)
								</Label>
								<p className="text-lg font-semibold">
									{results.electrical.dcResistance.toFixed(4)}
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">
									DC Resistance (Ω/ft)
								</Label>
								<p className="text-lg font-semibold">
									{results.electrical.dcResistancePerFoot.toFixed(6)}
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">
									Skin Depth @ {(frequency / 1000).toFixed(1)}kHz (mils)
								</Label>
								<p className="text-lg font-semibold">
									{results.electrical.skinDepthMils?.toFixed(4) || "N/A"}
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">
									N1 Max @ {(frequency / 1000).toFixed(1)}kHz
								</Label>
								<p className="text-lg font-semibold">
									{results.electrical.n1MaxCalculated ||
										results.electrical.n1Max}
								</p>
								<p className="text-xs text-muted-foreground">
									Maximum strands within skin depth
								</p>
							</div>

							<div>
								<Label className="text-sm font-medium">
									Operating Temperature
								</Label>
								<p className="text-lg font-semibold">{temperature}°C</p>
							</div>

							<div>
								<Label className="text-sm font-medium">Frequency</Label>
								<p className="text-lg font-semibold">
									{(frequency / 1000).toFixed(1)} kHz
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Dimensions and Part Numbers */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Dimensions & Part Numbers</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Bare Wire */}
						<div className="border rounded-lg p-3 space-y-2">
							<Label className="font-medium">Bare Litz Wire</Label>
							<div className="text-xs space-y-1">
								<div>Min: {results.dimensions.bare.min.toFixed(4)}"</div>
								<div>Nom: {results.dimensions.bare.nom.toFixed(4)}"</div>
								<div>Max: {results.dimensions.bare.max.toFixed(4)}"</div>
							</div>
							<div className="text-xs font-mono bg-muted p-2 rounded">
								{results.partNumbers.bare}
							</div>
						</div>

						{/* Single Insulated */}
						<div className="border rounded-lg p-3 space-y-2">
							<Label className="font-medium">Single Insulated</Label>
							<div className="text-xs space-y-1">
								<div>
									Min: {results.dimensions.singleInsulated.min.toFixed(4)}"
								</div>
								<div>
									Nom: {results.dimensions.singleInsulated.nom.toFixed(4)}"
								</div>
								<div>
									Max: {results.dimensions.singleInsulated.max.toFixed(4)}"
								</div>
							</div>
							<div className="text-xs font-mono bg-muted p-2 rounded">
								{results.partNumbers.singleInsulated}
							</div>
						</div>

						{/* Double Insulated */}
						<div className="border rounded-lg p-3 space-y-2">
							<Label className="font-medium">Double Insulated</Label>
							<div className="text-xs space-y-1">
								<div>
									Min: {results.dimensions.doubleInsulated.min.toFixed(4)}"
								</div>
								<div>
									Nom: {results.dimensions.doubleInsulated.nom.toFixed(4)}"
								</div>
								<div>
									Max: {results.dimensions.doubleInsulated.max.toFixed(4)}"
								</div>
							</div>
							<div className="text-xs font-mono bg-muted p-2 rounded">
								{results.partNumbers.doubleInsulated}
							</div>
						</div>

						{/* Triple Insulated */}
						<div className="border rounded-lg p-3 space-y-2">
							<Label className="font-medium">Triple Insulated</Label>
							<div className="text-xs space-y-1">
								<div>
									Min: {results.dimensions.tripleInsulated.min.toFixed(4)}"
								</div>
								<div>
									Nom: {results.dimensions.tripleInsulated.nom.toFixed(4)}"
								</div>
								<div>
									Max: {results.dimensions.tripleInsulated.max.toFixed(4)}"
								</div>
							</div>
							<div className="text-xs font-mono bg-muted p-2 rounded">
								{results.partNumbers.tripleInsulated}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
