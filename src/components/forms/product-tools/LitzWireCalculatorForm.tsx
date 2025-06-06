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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
	AlertTriangle, 
	CheckCircle, 
	Info, 
	Zap, 
	Calculator, 
	BookOpen,
	Settings,
	Layers,
	Gauge
} from "lucide-react";
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
	constructionTypes,
	insulationTypes,
	magnetWireGrades,
	litzFormSchema,
	calculatorInfo,
} from "./litz-types";
import {
	calculateLitzConstruction,
	calculateLitzDimensions,
	calculateElectricalProperties,
	calculateDCResistance,
	generatePartNumber,
	validateConstructionLimits,
	calculateLitzType,
	getAWGSpec,
	getPackingFactor,
	getTakeUpFactor,
	calculateElectricalProperties as calculateCMAAndAWG,
	getFilmDimensions,
	calculateServedDimensions,
} from "@/lib/litz-utils";

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
			// Single Film
			bare: { min: 0, nom: 0, max: 0 },
			singleInsulated: { min: 0, nom: 0, max: 0 },
			doubleInsulated: { min: 0, nom: 0, max: 0 },
			
			// Heavy Film
			heavyBare: { min: 0, nom: 0, max: 0 },
			heavyServed: { min: 0, nom: 0, max: 0 },
			heavyDoubleServed: { min: 0, nom: 0, max: 0 },
			
			// Triple Film
			tripleInsulated: { min: 0, nom: 0, max: 0 },
			tripleServed: { min: 0, nom: 0, max: 0 },
			tripleDoubleServed: { min: 0, nom: 0, max: 0 },
			
			// Quad Film
			quadBare: { min: 0, nom: 0, max: 0 },
			quadServed: { min: 0, nom: 0, max: 0 },
			quadDoubleServed: { min: 0, nom: 0, max: 0 },
		},
		partNumbers: {
			// Single Film
			bare: "",
			singleInsulated: "",
			doubleInsulated: "",
			
			// Heavy Film
			heavyBare: "",
			heavyServed: "",
			heavyDoubleServed: "",
			
			// Triple Film
			tripleInsulated: "",
			tripleServed: "",
			tripleDoubleServed: "",
			
			// Quad Film
			quadBare: "",
			quadServed: "",
			quadDoubleServed: "",
		},
		warnings: [],
		ulCompliant: false,
	});

	const form = useForm<LitzFormValues>({
		resolver: zodResolver(litzFormSchema),
		defaultValues: {
			strandCount: 20,
			awgSize: "28",
			constructionType: "Type 1",
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
	const constructionType = formValues.constructionType;
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
	const isValidForm = isValidInput && constructionType && insulationType && magnetWireGrade;

	// Update results when form values change
	useEffect(() => {
		if (!isValidForm) return;

		try {
			// Calculate construction using the Excel algorithm
			const construction = calculateLitzConstruction(strandCount, Number(awgSize));

			// Calculate packing and take-up factors
			const packingFactor = getPackingFactor(constructionType, construction.operations, Number(awgSize));
			const takeUpFactor = getTakeUpFactor(strandCount, construction.operations);

			// Calculate electrical properties
			const electricalProps = calculateCMAAndAWG(strandCount, Number(awgSize));
			const dcResistance = calculateDCResistance(strandCount, Number(awgSize), takeUpFactor);

			// Enhanced electrical properties
			const electrical = {
				totalCMA: electricalProps.totalCMA,
				dcResistance: dcResistance.ohmsPerFt,
				dcResistancePerFoot: dcResistance.ohmsPerFt,
				equivalentAWG: electricalProps.equivalentAWG,
				skinDepth: 0, // Placeholder - would need skin depth calculation
				n1Max: 0, // Placeholder - would need N1 Max calculation
				n1MaxCalculated: 0,
				skinDepthMils: 0,
			};

			// Calculate dimensions for different film types
			const singleFilmBare = calculateLitzDimensions(strandCount, Number(awgSize), packingFactor, 'single');
			const singleFilmServed = singleFilmBare ? calculateServedDimensions(singleFilmBare, 'single') : null;
			const singleFilmDoubleServed = singleFilmBare ? calculateServedDimensions(singleFilmBare, 'double') : null;
			
			const heavyFilmBare = calculateLitzDimensions(strandCount, Number(awgSize), packingFactor, 'heavy');
			const heavyFilmServed = heavyFilmBare ? calculateServedDimensions(heavyFilmBare, 'single') : null;
			const heavyFilmDoubleServed = heavyFilmBare ? calculateServedDimensions(heavyFilmBare, 'double') : null;
			
			const tripleFilmBare = calculateLitzDimensions(strandCount, Number(awgSize), packingFactor, 'triple');
			const tripleFilmServed = tripleFilmBare ? calculateServedDimensions(tripleFilmBare, 'single') : null;
			const tripleFilmDoubleServed = tripleFilmBare ? calculateServedDimensions(tripleFilmBare, 'double') : null;
			
			const quadFilmBare = calculateLitzDimensions(strandCount, Number(awgSize), packingFactor, 'quad');
			const quadFilmServed = quadFilmBare ? calculateServedDimensions(quadFilmBare, 'single') : null;
			const quadFilmDoubleServed = quadFilmBare ? calculateServedDimensions(quadFilmBare, 'double') : null;

			const dimensions = {
				// Single Film
				bare: singleFilmBare || { min: 0, nom: 0, max: 0 },
				singleInsulated: singleFilmServed || { min: 0, nom: 0, max: 0 },
				doubleInsulated: singleFilmDoubleServed || { min: 0, nom: 0, max: 0 },
				
				// Heavy Film
				heavyBare: heavyFilmBare || { min: 0, nom: 0, max: 0 },
				heavyServed: heavyFilmServed || { min: 0, nom: 0, max: 0 },
				heavyDoubleServed: heavyFilmDoubleServed || { min: 0, nom: 0, max: 0 },
				
				// Triple Film
				tripleInsulated: tripleFilmBare || { min: 0, nom: 0, max: 0 },
				tripleServed: tripleFilmServed || { min: 0, nom: 0, max: 0 },
				tripleDoubleServed: tripleFilmDoubleServed || { min: 0, nom: 0, max: 0 },
				
				// Quad Film
				quadBare: quadFilmBare || { min: 0, nom: 0, max: 0 },
				quadServed: quadFilmServed || { min: 0, nom: 0, max: 0 },
				quadDoubleServed: quadFilmDoubleServed || { min: 0, nom: 0, max: 0 },
			};

			// Generate part numbers  
			const partNumbers = {
				// Single Film
				bare: generatePartNumber(strandCount, Number(awgSize), 'single', magnetWireGrade),
				singleInsulated: generatePartNumber(strandCount, Number(awgSize), 'single', magnetWireGrade, 'single'),
				doubleInsulated: generatePartNumber(strandCount, Number(awgSize), 'single', magnetWireGrade, 'double'),
				
				// Heavy Film
				heavyBare: generatePartNumber(strandCount, Number(awgSize), 'heavy', magnetWireGrade),
				heavyServed: generatePartNumber(strandCount, Number(awgSize), 'heavy', magnetWireGrade, 'single'),
				heavyDoubleServed: generatePartNumber(strandCount, Number(awgSize), 'heavy', magnetWireGrade, 'double'),
				
				// Triple Film
				tripleInsulated: generatePartNumber(strandCount, Number(awgSize), 'triple', magnetWireGrade),
				tripleServed: generatePartNumber(strandCount, Number(awgSize), 'triple', magnetWireGrade, 'single'),
				tripleDoubleServed: generatePartNumber(strandCount, Number(awgSize), 'triple', magnetWireGrade, 'double'),
				
				// Quad Film
				quadBare: generatePartNumber(strandCount, Number(awgSize), 'quad', magnetWireGrade),
				quadServed: generatePartNumber(strandCount, Number(awgSize), 'quad', magnetWireGrade, 'single'),
				quadDoubleServed: generatePartNumber(strandCount, Number(awgSize), 'quad', magnetWireGrade, 'double'),
			};

			// Validate construction
			const validation = validateConstructionLimits(strandCount, Number(awgSize), constructionType, construction.operations);

			const newResults: LitzCalculationResults = {
				construction: {
					type: constructionType,
					operations: construction.operations,
					finalStrands: strandCount,
					isValid: validation.valid,
				},
				electrical,
				dimensions,
				partNumbers,
				warnings: validation.valid ? [] : [validation.message || 'Construction validation failed'],
				ulCompliant: false, // Would need UL compliance logic
			};

			setResults(newResults);
			onResultsCalculated?.(newResults);
		} catch (error) {
			console.error("Calculation error:", error);
		}
	}, [
		strandCount,
		awgSize,
		constructionType,
		insulationType,
		magnetWireGrade,
		temperature,
		frequency,
		isValidForm,
		onResultsCalculated,
	]);

	return (
		<div className={className}>
			{/* Header Section */}
			<div className="mb-6">
				<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
					<h1 className="text-2xl font-bold flex items-center gap-3">
						<Calculator className="h-8 w-8" />
						Litz Wire Design Tool
					</h1>
					<p className="text-blue-100 mt-2">{calculatorInfo.description}</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				{/* Excel-Style Input Panel - Left Column */}
				<div className="lg:col-span-3 space-y-4">
					{/* Construction Details Input */}
					<Card className="border-2 border-blue-200">
						<CardHeader className="bg-blue-50 ">
							<CardTitle className="text-lg flex items-center gap-2">
								<Settings className="h-5 w-5 text-blue-600" />
								Construction Details
							</CardTitle>
						</CardHeader>
						<CardContent className="p-5 space-y-4">
							<Form {...form}>
								<form className="space-y-4">
									<InputField
										control={control}
										name="strandCount"
										label="Total Wires"
										placeholder="20"
										type="number"
										min={1}
										max={1000}
										required
									/>

									<SelectField
										control={control}
										name="awgSize"
										label="Wire AWG"
										placeholder="Select AWG size"
										options={awgOptions.map((awg: AWGData) => ({
											value: awg.value,
											label: `${awg.value} AWG`,
										}))}
										required
									/>

									<div>
										<Label className="text-sm font-medium text-gray-700">Number of Operations</Label>
										<div className="mt-1 p-3 bg-gray-50 border rounded-md">
											<span className="text-sm font-mono text-gray-800">
												{isValidForm ? results.construction.operations : "—"}
											</span>
										</div>
									</div>

									<SelectField
										control={control}
										name="constructionType"
										label="Litz Type"
										placeholder="Select type"
										options={constructionTypes.map((type) => ({
											value: type.value,
											label: type.label,
										}))}
										required
									/>

									<SelectField
										control={control}
										name="magnetWireGrade"
										label="Magnet Wire Grade"
										placeholder="Select grade"
										options={magnetWireGrades.map((grade: MagnetWireGradeInfo) => ({
											value: grade.value,
											label: `${grade.label} (${grade.tempRating}°C)`,
										}))}
										required
									/>

									<SelectField
										control={control}
										name="insulationType"
										label="Insulation Material"
										placeholder="Select insulation"
										options={insulationTypes.map((type: InsulationTypeInfo) => ({
											value: type.value,
											label: type.label,
										}))}
										required
									/>

									<InputField
										control={control}
										name="temperature"
										label="Temperature (°C)"
										placeholder="20"
										type="number"
										min={-40}
										max={200}
										required
									/>

									<InputField
										control={control}
										name="frequency"
										label="Frequency (Hz)"
										placeholder="1000"
										type="number"
										min={1}
										max={10000000}
										required
									/>
								</form>
							</Form>
						</CardContent>
					</Card>

					{/* Engineering Warnings */}
					{isValidForm && results.warnings.length > 0 && (
						<Alert variant="destructive" className="border-l-4 border-l-red-500">
							<AlertTriangle className="h-5 w-5" />
							<div>
								<h4 className="font-medium text-sm">Engineering Considerations Required</h4>
								<ul className="mt-2 space-y-1 text-xs">
									{results.warnings.map((warning: string, i) => (
										<li key={i} className="flex items-start gap-2">
											<span className="text-red-500 mt-0.5">•</span>
											{warning}
										</li>
									))}
								</ul>
							</div>
						</Alert>
					)}
				</div>

				{/* Excel-Style Results Panel - Right Column */}
				<div className="lg:col-span-9">
					{isValidForm && (
						<div className="space-y-6">
							{/* DC Resistance Section */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Litz DC Resistance */}
								<Card className="border-2 border-orange-200 h-fit">
									<CardHeader className="bg-orange-50">
										<CardTitle className="text-lg flex items-center gap-2">
											<Zap className="h-5 w-5 text-orange-600" />
											Litz DC Resistance (IEC Method)
										</CardTitle>
									</CardHeader>
									<CardContent className="p-5">
										<div className="space-y-4 text-sm">
											<div className="flex justify-between items-center">
												<span className="font-medium">Take Up Factor (DCR):</span>
												<span className="font-mono bg-yellow-100 px-2 py-1 rounded">
													{isValidForm ? (() => {
														if (strandCount < 26) return "1.02";
														if (results.construction.operations === 1) return "1.051";
														if (results.construction.operations === 2) return "1.071";
														return "1.092";
													})() : "—"}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="font-medium">Wire Max DCR:</span>
												<span className="font-mono">{(awgOptions.find(awg => awg.value === awgSize)?.resistance || 0).toFixed(2)} Ω/kft</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="font-medium">Max DCR at 20°C (Ω/FT):</span>
												<span className="font-mono">{(results.electrical.dcResistancePerFoot * 1000).toFixed(5)}</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="font-medium">Max DCR at 20°C (Ω/mtr):</span>
												<span className="font-mono">{(results.electrical.dcResistancePerFoot * 1000 / 0.3048).toFixed(5)}</span>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Take Up Factors */}
								<Card className="border-2 border-green-200 h-fit">
									<CardHeader className="bg-green-50">
										<CardTitle className="text-lg flex items-center gap-2">
											<Gauge className="h-5 w-5 text-green-600" />
											Take Up Factors - DCR Resistance
										</CardTitle>
									</CardHeader>
									<CardContent className="p-5">
										<div className="space-y-4 text-sm">
											<div className="flex justify-between items-center">
												<span className="font-medium">Up to 25 Wires:</span>
												<span className="font-mono">1.02</span>
											</div>
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<span className="font-medium">More than 25 Wires:</span>
													<span></span>
												</div>
												<div className="ml-4 space-y-2 text-xs">
													<div className="flex justify-between items-center">
														<span>1.051</span>
														<span className="text-gray-500">if 1 operation</span>
													</div>
													<div className="flex justify-between items-center">
														<span>1.071</span>
														<span className="text-gray-500">if 2 operations</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="bg-yellow-100 px-1 rounded">1.092</span>
														<span className="text-gray-500">if 3+ operations</span>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Electrical Properties Summary */}
							<Card className="border-2 border-blue-200">
								<CardHeader className="bg-blue-50 ">
									<CardTitle className="text-lg flex items-center gap-2">
										<Calculator className="h-5 w-5 text-blue-600" />
										Electrical Properties
									</CardTitle>
								</CardHeader>
								<CardContent className="p-5">
									<div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
										<div className="text-center p-4 bg-gray-50 rounded-lg">
											<div className="font-medium text-gray-600 mb-2">Total Copper Area</div>
											<div className="text-lg font-mono text-blue-600 mb-1">{results.electrical.totalCMA.toLocaleString()}</div>
											<div className="text-xs text-gray-500">CMA</div>
										</div>
										<div className="text-center p-4 bg-gray-50 rounded-lg">
											<div className="font-medium text-gray-600 mb-2">Total Copper Area</div>
											<div className="text-lg font-mono text-blue-600 mb-1">{(results.electrical.totalCMA * 0.000506707).toFixed(3)}</div>
											<div className="text-xs text-gray-500">mm²</div>
										</div>
										<div className="text-center p-4 bg-green-50 rounded-lg">
											<div className="font-medium text-gray-600 mb-2">Equivalent AWG</div>
											<div className="text-lg font-mono text-green-600 mb-1">{results.electrical.equivalentAWG}</div>
											<div className="text-xs text-gray-500">Solid Wire</div>
										</div>
										<div className="text-center p-4 bg-purple-50 rounded-lg">
											<div className="font-medium text-gray-600 mb-2">Construction</div>
											<div className="text-lg font-mono text-purple-600 mb-1">{results.construction.type}</div>
											<div className="text-xs text-gray-500">{results.construction.operations} ops</div>
										</div>
										<div className="text-center p-4 bg-orange-50 rounded-lg">
											<div className="font-medium text-gray-600 mb-2">Packing Factor</div>
											<div className="text-lg font-mono text-orange-600 mb-1">
												{(() => {
													// Get packing factor based on construction and operations
													if (results.construction.type === "Type 1") {
														return "1.155";
													} else if (results.construction.type === "Type 2") {
														if (results.construction.operations === 4 && Number(awgSize) < 44) {
															return "1.363";
														} else if (results.construction.operations <= 3) {
															return "1.236";
														} else {
															return "1.271";
														}
													}
													return "1.155";
												})()}
											</div>
											<div className="text-xs text-gray-500">OD Factor</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Technical Analysis Tabs */}
							<Tabs defaultValue="dimensions" className="w-full">
								<TabsList className="grid w-full grid-cols-4 mb-6">
									<TabsTrigger value="dimensions" className="flex items-center gap-2">
										<Layers className="h-4 w-4" />
										Dimensions
									</TabsTrigger>
									<TabsTrigger value="part-numbers" className="flex items-center gap-2">
										<BookOpen className="h-4 w-4" />
										Part Numbers
									</TabsTrigger>
									<TabsTrigger value="skin-effect" className="flex items-center gap-2">
										<Zap className="h-4 w-4" />
										Skin Effect
									</TabsTrigger>
									<TabsTrigger value="construction" className="flex items-center gap-2">
										<Calculator className="h-4 w-4" />
										Construction
									</TabsTrigger>
								</TabsList>

								<TabsContent value="dimensions" className="space-y-6 mt-6">
									{/* Comprehensive Bare and Served Litz Diameters */}
									<Card>
										<CardHeader className="pb-4">
											<CardTitle className="text-xl">Bare and Served Litz Diameters</CardTitle>
											<div className="flex items-center justify-between mt-2">
												<p className="text-sm text-gray-600">All values are calculated and subject to verification.</p>
												<div className="text-sm text-gray-600">
													<strong>Magnet Wire Grade:</strong> <span className="ml-1 font-mono">{magnetWireGrade}</span>
												</div>
											</div>
											<p className="text-xs text-gray-500 mt-1">Double check that the packing factor used matches up to your desired Litz construction.</p>
										</CardHeader>
										<CardContent className="p-6">
											<div className="space-y-8">
												{/* Single Film Section */}
												<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
													{/* Single Film - Bare Litz */}
													<div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
														<h4 className="font-semibold mb-3 text-sm text-green-800 text-center">Single Film - Bare Litz</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-green-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.bare.min.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.bare.min * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.bare.nom.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.bare.nom * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.bare.max.toFixed(3)}</td>
																		<td className="p-2 text-center font-mono">{(results.dimensions.bare.max * 25.4).toFixed(3)}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-green-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.bare}</code>
														</div>
													</div>

													{/* Single Film - Single Nylon Serve */}
													<div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
														<h4 className="font-semibold mb-3 text-sm text-blue-800 text-center">Single Film - Single Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-blue-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.singleInsulated.min.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.singleInsulated.min * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.singleInsulated.nom.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.singleInsulated.nom * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.singleInsulated.max.toFixed(3)}</td>
																		<td className="p-2 text-center font-mono">{(results.dimensions.singleInsulated.max * 25.4).toFixed(3)}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-blue-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.singleInsulated}</code>
														</div>
													</div>

													{/* Single Film - Double Nylon Serve */}
													<div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
														<h4 className="font-semibold mb-3 text-sm text-purple-800 text-center">Single Film - Double Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-purple-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.doubleInsulated.min.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.doubleInsulated.min * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.doubleInsulated.nom.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.doubleInsulated.nom * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.doubleInsulated.max.toFixed(3)}</td>
																		<td className="p-2 text-center font-mono">{(results.dimensions.doubleInsulated.max * 25.4).toFixed(3)}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-purple-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.doubleInsulated}</code>
														</div>
													</div>
												</div>

												{/* Heavy Film Section */}
												<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
													{/* Heavy Film - Bare Litz */}
													<div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
														<h4 className="font-semibold mb-3 text-sm text-orange-800 text-center">Heavy Film - Bare Litz</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-orange-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyBare.min > 0 ? results.dimensions.heavyBare.min.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyBare.min > 0 ? (results.dimensions.heavyBare.min * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyBare.nom > 0 ? results.dimensions.heavyBare.nom.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyBare.nom > 0 ? (results.dimensions.heavyBare.nom * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.heavyBare.max > 0 ? results.dimensions.heavyBare.max.toFixed(3) : '—'}</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.heavyBare.max > 0 ? (results.dimensions.heavyBare.max * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-orange-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.heavyBare || 'Contact Engineering'}</code>
														</div>
													</div>

													{/* Heavy Film - Single Nylon Serve */}
													<div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
														<h4 className="font-semibold mb-3 text-sm text-red-800 text-center">Heavy Film - Single Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-red-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyServed.min > 0 ? results.dimensions.heavyServed.min.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyServed.min > 0 ? (results.dimensions.heavyServed.min * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyServed.nom > 0 ? results.dimensions.heavyServed.nom.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyServed.nom > 0 ? (results.dimensions.heavyServed.nom * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.heavyServed.max > 0 ? results.dimensions.heavyServed.max.toFixed(3) : '—'}</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.heavyServed.max > 0 ? (results.dimensions.heavyServed.max * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-red-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.heavyServed || 'Contact Engineering'}</code>
														</div>
													</div>

													{/* Heavy Film - Double Nylon Serve */}
													<div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
														<h4 className="font-semibold mb-3 text-sm text-gray-800 text-center">Heavy Film - Double Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-gray-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyDoubleServed.min > 0 ? results.dimensions.heavyDoubleServed.min.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyDoubleServed.min > 0 ? (results.dimensions.heavyDoubleServed.min * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyDoubleServed.nom > 0 ? results.dimensions.heavyDoubleServed.nom.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.heavyDoubleServed.nom > 0 ? (results.dimensions.heavyDoubleServed.nom * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.heavyDoubleServed.max > 0 ? results.dimensions.heavyDoubleServed.max.toFixed(3) : '—'}</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.heavyDoubleServed.max > 0 ? (results.dimensions.heavyDoubleServed.max * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-gray-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.heavyDoubleServed || 'Contact Engineering'}</code>
														</div>
													</div>
												</div>

												{/* Triple Film Section */}
												<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
													{/* Triple Film - Bare Litz */}
													<div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
														<h4 className="font-semibold mb-3 text-sm text-yellow-800 text-center">Triple Film - Bare Litz</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-yellow-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleInsulated.min.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.tripleInsulated.min * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleInsulated.nom.toFixed(3)}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{(results.dimensions.tripleInsulated.nom * 25.4).toFixed(3)}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.tripleInsulated.max.toFixed(3)}</td>
																		<td className="p-2 text-center font-mono">{(results.dimensions.tripleInsulated.max * 25.4).toFixed(3)}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.tripleInsulated}</code>
														</div>
													</div>

													{/* Triple Film - Single Nylon Serve */}
													<div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
														<h4 className="font-semibold mb-3 text-sm text-indigo-800 text-center">Triple Film - Single Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-indigo-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleServed.min > 0 ? results.dimensions.tripleServed.min.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleServed.min > 0 ? (results.dimensions.tripleServed.min * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleServed.nom > 0 ? results.dimensions.tripleServed.nom.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleServed.nom > 0 ? (results.dimensions.tripleServed.nom * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.tripleServed.max > 0 ? results.dimensions.tripleServed.max.toFixed(3) : '—'}</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.tripleServed.max > 0 ? (results.dimensions.tripleServed.max * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-indigo-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.tripleServed || 'Contact Engineering'}</code>
														</div>
													</div>

													{/* Triple Film - Double Nylon Serve */}
													<div className="bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
														<h4 className="font-semibold mb-3 text-sm text-pink-800 text-center">Triple Film - Double Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-pink-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleDoubleServed.min > 0 ? results.dimensions.tripleDoubleServed.min.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleDoubleServed.min > 0 ? (results.dimensions.tripleDoubleServed.min * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleDoubleServed.nom > 0 ? results.dimensions.tripleDoubleServed.nom.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.tripleDoubleServed.nom > 0 ? (results.dimensions.tripleDoubleServed.nom * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.tripleDoubleServed.max > 0 ? results.dimensions.tripleDoubleServed.max.toFixed(3) : '—'}</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.tripleDoubleServed.max > 0 ? (results.dimensions.tripleDoubleServed.max * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-pink-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.tripleDoubleServed || 'Contact Engineering'}</code>
														</div>
													</div>
												</div>

												{/* Quadruple Film Section */}
												<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
													{/* Quadruple Film - Bare Litz */}
													<div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200">
														<h4 className="font-semibold mb-3 text-sm text-teal-800 text-center">Quadruple Film - Bare Litz</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-teal-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.quadBare.min > 0 ? results.dimensions.quadBare.min.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.quadBare.min > 0 ? (results.dimensions.quadBare.min * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.quadBare.nom > 0 ? results.dimensions.quadBare.nom.toFixed(3) : '—'}</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">{results.dimensions.quadBare.nom > 0 ? (results.dimensions.quadBare.nom * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.quadBare.max > 0 ? results.dimensions.quadBare.max.toFixed(3) : '—'}</td>
																		<td className="p-2 text-center font-mono">{results.dimensions.quadBare.max > 0 ? (results.dimensions.quadBare.max * 25.4).toFixed(3) : '—'}</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-teal-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">{results.partNumbers.quadBare || 'Contact Engineering'}</code>
														</div>
													</div>

													{/* Quad Film - Single Nylon Serve */}
													<div className="bg-cyan-50 p-4 rounded-lg border-2 border-cyan-200">
														<h4 className="font-semibold mb-3 text-sm text-cyan-800 text-center">Quad Film - Single Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-cyan-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">—</td>
																		<td className="p-2 text-center font-mono">—</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-cyan-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">Contact Engineering</code>
														</div>
													</div>

													{/* Quad Film - Double Nylon Serve */}
													<div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
														<h4 className="font-semibold mb-3 text-sm text-slate-800 text-center">Quad Film - Double Nylon Serve</h4>
														<div className="overflow-x-auto">
															<table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
																<thead className="bg-slate-100">
																	<tr>
																		<th className="border-b border-gray-300 p-2 text-left font-semibold"></th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">Inches</th>
																		<th className="border-b border-gray-300 p-2 text-center font-semibold">mm</th>
																	</tr>
																</thead>
																<tbody className="bg-white">
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Min</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="border-b border-gray-200 p-2 font-medium">Nom</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																		<td className="border-b border-gray-200 p-2 text-center font-mono">—</td>
																	</tr>
																	<tr className="hover:bg-gray-50">
																		<td className="p-2 font-medium">Max</td>
																		<td className="p-2 text-center font-mono">—</td>
																		<td className="p-2 text-center font-mono">—</td>
																	</tr>
																</tbody>
															</table>
														</div>
														<div className="mt-3 p-2 bg-slate-100 rounded text-xs">
															<strong>Rubadue Part Number:</strong><br/>
															<code className="text-xs">Contact Engineering</code>
														</div>
													</div>
												</div>

												{/* Additional Strand OD's Section */}
												<div className="mt-8 p-4 bg-gray-100 rounded-lg">
													<h4 className="font-semibold mb-3 text-sm text-gray-800">Strand OD's</h4>
													<div className="grid grid-cols-2 gap-4 text-sm">
														<div>
															<strong>Single Wire OD (Inches):</strong>
															<div className="font-mono mt-1">{awgOptions.find(awg => awg.value === awgSize)?.diameter.toFixed(4) || "—"}</div>
														</div>
														<div>
															<strong>Single Wire OD (mm):</strong>
															<div className="font-mono mt-1">{((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 25.4).toFixed(3)}</div>
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="part-numbers" className="space-y-4 mt-4">
									<Card>
										<CardHeader>
											<CardTitle>Rubadue Part Numbers</CardTitle>
											<p className="text-sm text-gray-600">
												<strong>Magnet Wire Grade:</strong> {magnetWireGrade}
											</p>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="grid gap-4">
													<div className="p-4 border rounded-lg bg-blue-50">
														<h4 className="font-semibold text-blue-800 mb-2">Bare Litz Wire</h4>
														<code className="text-sm bg-white px-3 py-2 rounded border">{results.partNumbers.bare}</code>
													</div>
													<div className="p-4 border rounded-lg bg-green-50">
														<h4 className="font-semibold text-green-800 mb-2">Single Insulated</h4>
														<code className="text-sm bg-white px-3 py-2 rounded border">{results.partNumbers.singleInsulated}</code>
													</div>
													<div className="p-4 border rounded-lg bg-purple-50">
														<h4 className="font-semibold text-purple-800 mb-2">Double Insulated</h4>
														<code className="text-sm bg-white px-3 py-2 rounded border">{results.partNumbers.doubleInsulated}</code>
													</div>
													<div className="p-4 border rounded-lg bg-orange-50">
														<h4 className="font-semibold text-orange-800 mb-2">Triple Insulated</h4>
														<code className="text-sm bg-white px-3 py-2 rounded border">{results.partNumbers.tripleInsulated}</code>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="skin-effect" className="space-y-4 mt-4">
									<div className="space-y-6">
										{/* Input Parameters */}
										<Card>
											<CardHeader>
												<CardTitle className="flex items-center gap-2">
													<Zap className="h-5 w-5 text-blue-500" />
													Skin Effect Analysis @ {(frequency / 1000).toFixed(1)}kHz
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="grid grid-cols-2 gap-6">
													<div className="bg-blue-50 p-4 rounded-lg">
														<h5 className="font-medium text-blue-900 mb-3">Input Parameters</h5>
														<div className="space-y-2 text-sm">
															<div className="flex justify-between">
																<span>Frequency (f):</span>
																<span className="font-mono">{frequency.toLocaleString()} Hz</span>
															</div>
															<div className="flex justify-between">
																<span>Temperature:</span>
																<span className="font-mono">{temperature}°C</span>
															</div>
															<div className="flex justify-between">
																<span>Conductor:</span>
																<span className="font-mono">Copper</span>
															</div>
															<div className="flex justify-between">
																<span>Permeability (μ₀):</span>
																<span className="font-mono">1.257 × 10⁻⁶ H/m</span>
															</div>
														</div>
													</div>

													<div className="bg-green-50 p-4 rounded-lg">
														<h5 className="font-medium text-green-900 mb-3">Copper Resistivity</h5>
														<div className="space-y-2 text-sm">
															<div className="flex justify-between">
																<span>At 20°C (reference):</span>
																<span className="font-mono">1.72 × 10⁻⁸ Ω·m</span>
															</div>
															<div className="flex justify-between">
																<span>At {temperature}°C (corrected):</span>
																<span className="font-mono">{(1.72e-8 * (1 + 0.00393 * (temperature - 20))).toExponential(2)} Ω·m</span>
															</div>
															<div className="flex justify-between">
																<span>Temp. coefficient (α):</span>
																<span className="font-mono">0.00393/°C</span>
															</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>

										{/* Skin Depth Results */}
										<Card>
											<CardHeader>
												<CardTitle>Skin Depth Calculations</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="bg-gray-50 p-4 rounded-lg">
													<div className="grid grid-cols-3 gap-6 mb-4">
														<div className="text-center">
															<h5 className="font-medium text-gray-900 mb-2">Skin Depth (δ)</h5>
															<div className="space-y-1 text-sm">
																<div className="font-mono text-lg text-blue-600">{(results.electrical.skinDepthMils / 1000).toFixed(6)} m</div>
																<div className="font-mono">{(results.electrical.skinDepthMils / 39.37).toFixed(3)} mm</div>
																<div className="font-mono">{(results.electrical.skinDepthMils / 1000).toFixed(4)} in</div>
																<div className="font-mono text-green-600">{results.electrical.skinDepthMils?.toFixed(2)} mils</div>
															</div>
														</div>

														<div className="text-center">
															<h5 className="font-medium text-gray-900 mb-2">2× Skin Depth</h5>
															<div className="space-y-1 text-sm">
																<div className="font-mono text-lg text-purple-600">{((results.electrical.skinDepthMils / 1000) * 2).toFixed(6)} m</div>
																<div className="font-mono">{((results.electrical.skinDepthMils / 39.37) * 2).toFixed(3)} mm</div>
																<div className="font-mono">{((results.electrical.skinDepthMils / 1000) * 2).toFixed(4)} in</div>
																<div className="font-mono text-purple-600">{(results.electrical.skinDepthMils * 2)?.toFixed(2)} mils</div>
															</div>
														</div>

														<div className="text-center">
															<h5 className="font-medium text-gray-900 mb-2">Strand Diameter</h5>
															<div className="space-y-1 text-sm">
																<div className="font-mono text-lg text-orange-600">{((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 0.0254).toFixed(6)} m</div>
																<div className="font-mono">{((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 25.4).toFixed(3)} mm</div>
																<div className="font-mono">{(awgOptions.find(awg => awg.value === awgSize)?.diameter || 0).toFixed(4)} in</div>
																<div className="font-mono text-orange-600">{((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 1000).toFixed(1)} mils</div>
															</div>
														</div>
													</div>

													<div className="border-t pt-4">
														<div className="text-center">
															<h5 className="font-medium text-gray-900 mb-2">N1 Max Calculation</h5>
															<div className="text-2xl font-mono text-red-600 mb-2">{results.electrical.n1MaxCalculated || results.electrical.n1Max}</div>
															<p className="text-xs text-gray-600">Maximum recommended strands for first bunching operation</p>
														</div>
													</div>
												</div>

												<div className="mt-4 bg-white border p-4 rounded-lg">
													<h5 className="font-medium text-gray-900 mb-3">Calculation Formulas</h5>
													<div className="space-y-3 text-sm">
														<div className="bg-blue-50 p-3 rounded">
															<strong>Skin Depth Formula:</strong>
															<div className="font-mono mt-1">δ = √(ρ / (π × μ₀ × f))</div>
															<div className="text-xs text-gray-600 mt-1">
																Where: ρ = resistivity, μ₀ = permeability of free space, f = frequency
															</div>
														</div>
														<div className="bg-green-50 p-3 rounded">
															<strong>Temperature Correction:</strong>
															<div className="font-mono mt-1">ρ(T) = ρ₀ × (1 + α × (T - T₀))</div>
															<div className="text-xs text-gray-600 mt-1">
																Where: α = 0.00393/°C for copper, T₀ = 20°C reference
															</div>
														</div>
														<div className="bg-purple-50 p-3 rounded">
															<strong>N1 Max Formula:</strong>
															<div className="font-mono mt-1">N₁ = floor(4 × (δ/d)²)</div>
															<div className="text-xs text-gray-600 mt-1">
																Where: δ = skin depth, d = strand diameter
															</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>

										{/* Engineering Guidance */}
										<Card>
											<CardHeader>
												<CardTitle>Engineering Guidance</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-4">
													<div className={`p-4 rounded-lg ${
														results.electrical.n1MaxCalculated && strandCount > results.electrical.n1MaxCalculated 
															? "bg-red-50 border border-red-200" 
															: "bg-green-50 border border-green-200"
													}`}>
														<h5 className="font-medium mb-2">
															{results.electrical.n1MaxCalculated && strandCount > results.electrical.n1MaxCalculated 
																? "⚠️ Optimization Required" 
																: "✅ Optimal Design"
															}
														</h5>
														<p className="text-sm">
															{results.electrical.n1MaxCalculated && strandCount > results.electrical.n1MaxCalculated 
																? `Your strand count (${strandCount}) exceeds N1 Max (${results.electrical.n1MaxCalculated}). Consider reducing strands or frequency to minimize skin effect losses.`
																: `Your strand count (${strandCount}) is within the optimal range for ${(frequency/1000).toFixed(1)}kHz operation.`
															}
														</p>
													</div>

													<div className="bg-blue-50 p-4 rounded-lg">
														<h5 className="font-medium text-blue-900 mb-2">Understanding Skin Effect</h5>
														<div className="text-sm text-blue-800 space-y-2">
															<p>
																<strong>Skin depth (δ)</strong> is the distance from the conductor surface where current density drops to 37% (1/e) of its surface value.
															</p>
															<p>
																<strong>N1 max</strong> is the recommended maximum number of strands for the first bunching operation to minimize bundle-level skin-effect losses.
															</p>
															<p>
																At {(frequency/1000).toFixed(1)}kHz, the skin depth is {results.electrical.skinDepthMils?.toFixed(2)} mils, which is {
																	((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 1000) > results.electrical.skinDepthMils 
																		? "smaller than" 
																		: "larger than"
																} your {awgSize} AWG strand diameter ({((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 1000).toFixed(1)} mils).
															</p>
														</div>
													</div>

													<div className="bg-gray-50 p-4 rounded-lg">
														<h5 className="font-medium text-gray-900 mb-2">Design References</h5>
														<div className="text-xs text-gray-700 space-y-1">
															<div>This calculator implements the method from "Simplified Design Method for Litz Wire" by C. R. Sullivan and R. Y. Zhang.</div>
															<div>For additional details, see published research on litz wire optimization for high-frequency applications.</div>
															<div>Temperature coefficient values are based on standard copper properties at room temperature.</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</TabsContent>

								<TabsContent value="construction" className="space-y-4 mt-4">
									<Card>
										<CardHeader>
											<CardTitle>Construction Analysis</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
																				<div className="bg-gray-50 p-4 rounded-lg">
										<h4 className="font-medium text-gray-900 mb-3">Manufacturing Process</h4>
										<p className="text-sm text-gray-700 mb-3">
											This shows how your litz wire will be manufactured in our facility:
										</p>
										
										<div className="space-y-3">
											<div className="flex items-center gap-2 text-sm">
												<span className="bg-blue-100 px-2 py-1 rounded font-mono">{strandCount} strands</span>
												<span>→</span>
												<span className="bg-green-100 px-2 py-1 rounded">{results.construction.type}</span>
												<span>→</span>
												<span className="bg-purple-100 px-2 py-1 rounded">{results.construction.operations} operations</span>
												<span>→</span>
												<span className="bg-orange-100 px-2 py-1 rounded">{results.construction.finalStrands} final groups</span>
											</div>
											
											<div className="text-xs text-gray-600 space-y-1">
												<div><span className="inline-block w-3 h-3 bg-blue-100 rounded mr-2"></span><strong>{strandCount} Individual Wires:</strong> We start with {strandCount} separate {awgSize} AWG copper strands</div>
												<div><span className="inline-block w-3 h-3 bg-green-100 rounded mr-2"></span><strong>{results.construction.type} Process:</strong> {results.construction.type === "Type 1" ? "Simple bunching method for easier manufacturing" : "Multi-step twisting process for optimal strand arrangement"}</div>
												<div><span className="inline-block w-3 h-3 bg-purple-100 rounded mr-2"></span><strong>{results.construction.operations} Manufacturing Steps:</strong> {results.construction.operations === 1 ? "Single operation - all strands twisted together at once" : `${results.construction.operations} sequential twisting operations for proper strand distribution`}</div>
												<div><span className="inline-block w-3 h-3 bg-orange-100 rounded mr-2"></span><strong>{results.construction.finalStrands} Final Groups:</strong> Results in {results.construction.finalStrands} effective strand groups in the finished bundle</div>
											</div>
											
											<div className="border-t pt-2 mt-2">
												<p className="text-xs text-gray-500">
													<strong>Why this matters:</strong> The manufacturing method affects bundle diameter, flexibility, electrical performance, and production cost. More operations generally mean tighter control but higher complexity.
												</p>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="bg-blue-50 p-4 rounded-lg">
											<h5 className="font-medium text-blue-900 mb-2">Construction Logic</h5>
											<div className="text-sm text-blue-800 space-y-1">
												<div>Type determination based on:</div>
												<div className="text-xs">
													<div>• Wire size (AWG ≥ 26 = Type 1)</div>
													<div>• Strand count vs. manufacturing limits</div>
													<div>• Process capabilities for fine wires</div>
												</div>
											</div>
										</div>
										
										<div className="bg-yellow-50 p-4 rounded-lg">
											<h5 className="font-medium text-yellow-900 mb-2">Construction Factors</h5>
											<div className="text-sm text-yellow-800 space-y-1">
												<div>• <strong>Packing Factor:</strong> Bundle diameter calculation</div>
												<div>• <strong>Take Up Factor:</strong> Resistance adjustment for twisting</div>
												<div>• <strong>Operations:</strong> Number of twisting steps required</div>
											</div>
										</div>
									</div>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
