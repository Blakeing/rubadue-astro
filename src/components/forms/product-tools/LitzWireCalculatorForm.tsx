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
import { AlertTriangle, CheckCircle, Info, Zap, Calculator, BookOpen } from "lucide-react";
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
			// Calculate construction with user-selected type
			const construction = calculateLitzConstruction(
				strandCount,
				Number(awgSize),
				constructionType,
			);

			// Calculate electrical properties with all the Excel formulas
			const electricalProps = calculateElectricalProperties(
				strandCount,
				Number(awgSize),
				temperature,
				frequency,
				constructionType,
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
				constructionType,
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

			// Validate construction and generate warnings
			const { warnings, ulCompliant } = validateConstruction(
				strandCount,
				Number(awgSize),
				insulationType,
			);

			const newResults: LitzCalculationResults = {
				construction,
				electrical,
				dimensions,
				partNumbers,
				warnings,
				ulCompliant,
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
			<div className="mb-6">
				<p className="text-muted-foreground">{calculatorInfo.description}</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				{/* Input Form - Left Column (Sticky) */}
				<div className="lg:col-span-4 lg:sticky lg:top-40 lg:self-start">
					<div className="space-y-6">
						<Card>
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
											name="constructionType"
											label="Construction Type"
											placeholder="Select construction type"
											options={constructionTypes.map((type) => ({
												value: type.value,
												label: type.label,
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

						{/* Engineering Considerations in Left Column */}
						{isValidForm && results.warnings.length > 0 && (
							<Alert variant="destructive" className="border-l-4 border-l-red-500">
								<AlertTriangle className="h-5 w-5" />
								<div>
									<h4 className="font-medium">Engineering Considerations Required</h4>
									<ul className="mt-2 space-y-1 text-sm">
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
				</div>

				{/* Results - Right Column */}
				<div className="lg:col-span-8">
					{isValidForm && (
						<div className="space-y-6">
							{/* Header */}
							<div>
								<h3 className="text-lg font-semibold">Engineering Analysis</h3>
							</div>

							{/* Key Results Dashboard */}
							<div className="grid gap-4 md:grid-cols-3">
								<Card className={`border-2 ${
									results.construction.isValid 
										? "border-green-200 bg-green-50" 
										: "border-red-200 bg-red-50"
								}`}>
									<CardContent className="p-4">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-sm font-medium text-gray-900">Total CMA</h4>
												<p className="text-2xl font-bold text-gray-900 mt-1">
													{results.electrical.totalCMA.toLocaleString()}
													<span className="text-sm text-gray-600 ml-1">CMA</span>
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Circular Mil Area
												</p>
											</div>
											<Info className="h-4 w-4 text-gray-400" />
										</div>
									</CardContent>
								</Card>

								<Card className="border-2 border-blue-200 bg-blue-50">
									<CardContent className="p-4">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-sm font-medium text-gray-900">Equivalent AWG</h4>
												<p className="text-2xl font-bold text-gray-900 mt-1">
													{results.electrical.equivalentAWG}
													<span className="text-sm text-gray-600 ml-1">AWG</span>
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Solid wire equivalent
												</p>
											</div>
											<CheckCircle className="h-4 w-4 text-blue-400" />
										</div>
									</CardContent>
								</Card>

								<Card className={`border-2 ${
									results.construction.isValid 
										? "border-green-200 bg-green-50" 
										: "border-red-200 bg-red-50"
								}`}>
									<CardContent className="p-4">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-sm font-medium text-gray-900">Construction</h4>
												<p className="text-2xl font-bold text-gray-900 mt-1">
													{results.construction.type}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{results.construction.operations} operations
												</p>
											</div>
											{results.construction.isValid ? 
												<CheckCircle className="h-4 w-4 text-green-400" /> :
												<AlertTriangle className="h-4 w-4 text-red-400" />
											}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Technical Analysis Tabs */}
							<Tabs defaultValue="skin-effect" className="w-full">
								<TabsList className="grid w-full grid-cols-4">
									<TabsTrigger value="skin-effect" className="flex items-center gap-2">
										<Zap className="h-4 w-4" />
										Skin Effect
									</TabsTrigger>
									<TabsTrigger value="construction" className="flex items-center gap-2">
										<Calculator className="h-4 w-4" />
										Construction
									</TabsTrigger>
									<TabsTrigger value="bare-dimensions" className="flex items-center gap-2">
										<Info className="h-4 w-4" />
										Bare Litz
									</TabsTrigger>
									<TabsTrigger value="insulated-dimensions" className="flex items-center gap-2">
										<Info className="h-4 w-4" />
										Insulated Litz
									</TabsTrigger>
								</TabsList>

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

								<TabsContent value="bare-dimensions" className="space-y-4 mt-4">
									<div className="space-y-6">
										{/* Overview */}
										<Card>
											<CardHeader>
												<CardTitle className="flex items-center gap-2">
													<Info className="h-5 w-5 text-blue-500" />
													Bare and Served Litz Diameters
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-4">
													<div className="bg-blue-50 p-4 rounded-lg">
														<div className="grid grid-cols-2 gap-4">
															<div>
																<p className="text-sm text-blue-900 mb-1">
																	<strong>Magnet Wire Grade:</strong> {magnetWireGrade}
																</p>
																<p className="text-sm text-blue-900">
																	<strong>Construction:</strong> {strandCount} × {awgSize} AWG ({results.construction.type})
																</p>
															</div>
															<div className="text-right">
																<p className="text-xs text-blue-700">
																	All values are calculated and subject to verification.
																</p>
																<p className="text-xs text-blue-700">
																	Double check that the packing factor used matches your desired Litz construction.
																</p>
															</div>
														</div>
													</div>
													
													{/* Comprehensive Dimensions Table - Excel Style */}
													<div className="space-y-6">
														{/* Single Film */}
														<div className="border rounded-lg overflow-hidden">
															<div className="bg-yellow-100 px-4 py-2">
																<h4 className="font-semibold text-yellow-900">Single Film - Bare Litz</h4>
															</div>
															<div className="grid grid-cols-4 gap-4 p-4 bg-yellow-50">
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Bare Bundle</div>
																	<div className="space-y-1 text-sm">
																		<div className="flex justify-between">
																			<span>Min:</span>
																			<span className="font-mono">{results.dimensions.bare.min.toFixed(4)}"</span>
																		</div>
																		<div className="flex justify-between">
																			<span>Nom:</span>
																			<span className="font-mono">{results.dimensions.bare.nom.toFixed(4)}"</span>
																		</div>
																		<div className="flex justify-between">
																			<span>Max:</span>
																			<span className="font-mono">{results.dimensions.bare.max.toFixed(4)}"</span>
																		</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">mm</div>
																	<div className="space-y-1 text-sm">
																		<div className="text-right font-mono">{(results.dimensions.bare.min * 25.4).toFixed(3)}</div>
																		<div className="text-right font-mono">{(results.dimensions.bare.nom * 25.4).toFixed(3)}</div>
																		<div className="text-right font-mono">{(results.dimensions.bare.max * 25.4).toFixed(3)}</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Strand OD's</div>
																	<div className="space-y-1 text-sm">
																		<div className="flex justify-between">
																			<span>Inches:</span>
																			<span className="font-mono">{awgOptions.find(awg => awg.value === awgSize)?.diameter.toFixed(4) || "N/A"}</span>
																		</div>
																		<div className="flex justify-between">
																			<span>mm:</span>
																			<span className="font-mono">{((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 25.4).toFixed(3)}</span>
																		</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Part Number</div>
																	<div className="text-xs font-mono bg-white p-2 rounded border">
																		{results.partNumbers.bare}
																	</div>
																</div>
															</div>
														</div>

														{/* Heavy Film */}
														<div className="border rounded-lg overflow-hidden">
															<div className="bg-orange-100 px-4 py-2">
																<h4 className="font-semibold text-orange-900">Heavy Film - Bare Litz</h4>
															</div>
															<div className="grid grid-cols-4 gap-4 p-4 bg-orange-50">
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Bare Bundle</div>
																	<div className="space-y-1 text-sm">
																		<div className="flex justify-between">
																			<span>Min:</span>
																			<span className="font-mono">{results.dimensions.doubleInsulated.min.toFixed(4)}"</span>
																		</div>
																		<div className="flex justify-between">
																			<span>Nom:</span>
																			<span className="font-mono">{results.dimensions.doubleInsulated.nom.toFixed(4)}"</span>
																		</div>
																		<div className="flex justify-between">
																			<span>Max:</span>
																			<span className="font-mono">{results.dimensions.doubleInsulated.max.toFixed(4)}"</span>
																		</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">mm</div>
																	<div className="space-y-1 text-sm">
																		<div className="text-right font-mono">{(results.dimensions.doubleInsulated.min * 25.4).toFixed(3)}</div>
																		<div className="text-right font-mono">{(results.dimensions.doubleInsulated.nom * 25.4).toFixed(3)}</div>
																		<div className="text-right font-mono">{(results.dimensions.doubleInsulated.max * 25.4).toFixed(3)}</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Strand OD's</div>
																	<div className="space-y-1 text-sm">
																		<div className="flex justify-between">
																			<span>Inches:</span>
																			<span className="font-mono">{awgOptions.find(awg => awg.value === awgSize)?.diameter.toFixed(4) || "N/A"}</span>
																		</div>
																		<div className="flex justify-between">
																			<span>mm:</span>
																			<span className="font-mono">{((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 25.4).toFixed(3)}</span>
																		</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Part Number</div>
																	<div className="text-xs font-mono bg-white p-2 rounded border">
																		{results.partNumbers.doubleInsulated}
																	</div>
																</div>
															</div>
														</div>

														{/* Triple Film */}
														<div className="border rounded-lg overflow-hidden">
															<div className="bg-purple-100 px-4 py-2">
																<h4 className="font-semibold text-purple-900">Triple Film - Bare Litz</h4>
															</div>
															<div className="grid grid-cols-4 gap-4 p-4 bg-purple-50">
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Bare Bundle</div>
																	<div className="space-y-1 text-sm">
																		<div className="flex justify-between">
																			<span>Min:</span>
																			<span className="font-mono">{results.dimensions.tripleInsulated.min.toFixed(4)}"</span>
																		</div>
																		<div className="flex justify-between">
																			<span>Nom:</span>
																			<span className="font-mono">{results.dimensions.tripleInsulated.nom.toFixed(4)}"</span>
																		</div>
																		<div className="flex justify-between">
																			<span>Max:</span>
																			<span className="font-mono">{results.dimensions.tripleInsulated.max.toFixed(4)}"</span>
																		</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">mm</div>
																	<div className="space-y-1 text-sm">
																		<div className="text-right font-mono">{(results.dimensions.tripleInsulated.min * 25.4).toFixed(3)}</div>
																		<div className="text-right font-mono">{(results.dimensions.tripleInsulated.nom * 25.4).toFixed(3)}</div>
																		<div className="text-right font-mono">{(results.dimensions.tripleInsulated.max * 25.4).toFixed(3)}</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Strand OD's</div>
																	<div className="space-y-1 text-sm">
																		<div className="flex justify-between">
																			<span>Inches:</span>
																			<span className="font-mono">{awgOptions.find(awg => awg.value === awgSize)?.diameter.toFixed(4) || "N/A"}</span>
																		</div>
																		<div className="flex justify-between">
																			<span>mm:</span>
																			<span className="font-mono">{((awgOptions.find(awg => awg.value === awgSize)?.diameter || 0) * 25.4).toFixed(3)}</span>
																		</div>
																	</div>
																</div>
																<div>
																	<div className="text-xs font-medium text-gray-600 mb-2">Part Number</div>
																	<div className="text-xs font-mono bg-white p-2 rounded border">
																		{results.partNumbers.tripleInsulated}
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>





									</div>
								</TabsContent>
								<TabsContent value="insulated-dimensions" className="space-y-4 mt-4">
									<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Info className="h-5 w-5 text-green-500" />
											Insulated Litz Diameters (Single Build Enamel)
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-6">
											{/* Header Information */}
											<div className="bg-green-50 p-4 rounded-lg">
												<div className="grid grid-cols-2 gap-4 mb-4">
													<div>
														<p className="text-sm text-green-900 mb-1">
															<strong>Magnet Wire Grade:</strong> {magnetWireGrade}
														</p>
														<div className="flex items-center gap-2">
															<span className="text-sm text-green-900">
																<strong>Insulation Material:</strong>
															</span>
															<span className="bg-yellow-300 px-3 py-1 rounded text-sm font-bold">
																{insulationType}
															</span>
														</div>
													</div>
													<div className="text-right text-xs text-green-700">
														<p>All values are calculated and subject to verification.</p>
														<p>Double check that the packing factor used matches up to your desired Litz construction.</p>
													</div>
												</div>
											</div>

											{/* Single Insulated Wire */}
											<div className="border rounded-lg overflow-hidden">
												<div className="bg-blue-100 px-4 py-2">
													<h4 className="font-semibold text-blue-900">Single Insulated Wire</h4>
													<p className="text-xs text-blue-700">Basic Insulation OD's</p>
												</div>
												<div className="bg-blue-50">
													<div className="grid grid-cols-6 gap-2 px-4 py-2 text-xs font-medium text-gray-700 border-b">
														<div></div>
														<div className="text-center">Inches</div>
														<div className="text-center">mm</div>
														<div className="text-center">Insulation Wall/Layer</div>
														<div className="text-center">Inches</div>
														<div className="text-center">mm</div>
													</div>
													<div className="px-4 py-2 space-y-2">
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Min</div>
															<div className="font-mono text-center">{(results.dimensions.bare.min + 2 * 0.002 - (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.min + 2 * 0.002 - (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)) * 25.4).toFixed(3)}</div>
															<div className="text-center text-xs text-red-600">CONSULT FACTORY</div>
															<div></div>
															<div></div>
														</div>
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Nom</div>
															<div className="font-mono text-center">{(results.dimensions.bare.nom + 2 * 0.002).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.nom + 2 * 0.002) * 25.4).toFixed(3)}</div>
															<div className="font-mono text-center">
																{insulationType === "ETFE" && (0.0015).toFixed(4)}
																{insulationType === "FEP" && (strandCount * 25 < 1939 ? 0.002 : strandCount * 25 < 12405 ? 0.003 : strandCount * 25 < 24978 ? 0.01 : 0.012).toFixed(4)}
																{insulationType === "PFA" && (0.0015).toFixed(4)}
															</div>
															<div className="font-mono text-center">
																{insulationType === "ETFE" && (0.0015 * 25.4).toFixed(3)}
																{insulationType === "FEP" && ((strandCount * 25 < 1939 ? 0.002 : strandCount * 25 < 12405 ? 0.003 : strandCount * 25 < 24978 ? 0.01 : 0.012) * 25.4).toFixed(3)}
																{insulationType === "PFA" && (0.0015 * 25.4).toFixed(3)}
															</div>
														</div>
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Max</div>
															<div className="font-mono text-center">{(results.dimensions.bare.max + 2 * 0.002 + (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.max + 2 * 0.002 + (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)) * 25.4).toFixed(3)}</div>
															<div className="text-center text-xs text-red-600">CONSULT FACTORY</div>
															<div></div>
															<div></div>
														</div>
													</div>
													<div className="border-t bg-white px-4 py-2">
														<div className="text-xs font-mono">
															Rubadue Part Number: SXXL{strandCount}/{awgSize}{insulationType === "FEP" ? "F" : insulationType === "ETFE" ? "T" : "P"}X-{insulationType === "ETFE" ? "1.5" : insulationType === "FEP" ? (strandCount * 25 < 1939 ? "2.0" : strandCount * 25 < 12405 ? "3.0" : strandCount * 25 < 24978 ? "10.0" : "12.0") : "1.5"}({magnetWireGrade})
														</div>
													</div>
												</div>
											</div>

											{/* Double Insulated Wire */}
											<div className="border rounded-lg overflow-hidden">
												<div className="bg-orange-100 px-4 py-2">
													<h4 className="font-semibold text-orange-900">Double Insulated Wire</h4>
													<p className="text-xs text-orange-700">Supplemental Insulation OD's</p>
												</div>
												<div className="bg-orange-50">
													<div className="grid grid-cols-6 gap-2 px-4 py-2 text-xs font-medium text-gray-700 border-b">
														<div></div>
														<div className="text-center">Inches</div>
														<div className="text-center">mm</div>
														<div className="text-center">Insulation Wall/Layer</div>
														<div className="text-center">Inches</div>
														<div className="text-center">mm</div>
													</div>
													<div className="px-4 py-2 space-y-2">
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Min</div>
															<div className="font-mono text-center">{(results.dimensions.bare.min + 2 * 2 * 0.002 - (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.min + 2 * 2 * 0.002 - (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)) * 25.4).toFixed(3)}</div>
															<div className="text-center text-xs text-red-600">CONSULT FACTORY</div>
															<div></div>
															<div></div>
														</div>
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Nom</div>
															<div className="font-mono text-center">{(results.dimensions.bare.nom + 2 * 2 * 0.002).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.nom + 2 * 2 * 0.002) * 25.4).toFixed(3)}</div>
															<div className="font-mono text-center">
																{insulationType === "ETFE" && (0.001).toFixed(4)}
																{insulationType === "FEP" && (strandCount * 25 < 12405 ? 0.002 : strandCount * 25 < 24978 ? 0.005 : 0.006).toFixed(4)}
																{insulationType === "PFA" && (0.0015).toFixed(4)}
															</div>
															<div className="font-mono text-center">
																{insulationType === "ETFE" && (0.001 * 25.4).toFixed(3)}
																{insulationType === "FEP" && ((strandCount * 25 < 12405 ? 0.002 : strandCount * 25 < 24978 ? 0.005 : 0.006) * 25.4).toFixed(3)}
																{insulationType === "PFA" && (0.0015 * 25.4).toFixed(3)}
															</div>
														</div>
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Max</div>
															<div className="font-mono text-center">{(results.dimensions.bare.max + 2 * 2 * 0.002 + (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.max + 2 * 2 * 0.002 + (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)) * 25.4).toFixed(3)}</div>
															<div className="text-center text-xs text-red-600">CONSULT FACTORY</div>
															<div></div>
															<div></div>
														</div>
													</div>
													<div className="border-t bg-white px-4 py-2">
														<div className="text-xs font-mono">
															Rubadue Part Number: DXXL{strandCount}/{awgSize}{insulationType === "FEP" ? "F" : insulationType === "ETFE" ? "T" : "P"}XX-{insulationType === "ETFE" ? "1.0" : insulationType === "FEP" ? (strandCount * 25 < 12405 ? "2.0" : strandCount * 25 < 24978 ? "5.0" : "6.0") : "1.5"}({magnetWireGrade})
														</div>
													</div>
												</div>
											</div>

											{/* Triple Insulated Wire */}
											<div className="border rounded-lg overflow-hidden">
												<div className="bg-purple-100 px-4 py-2">
													<h4 className="font-semibold text-purple-900">Triple Insulated Wire</h4>
													<p className="text-xs text-purple-700">Reinforced Insulation OD's</p>
												</div>
												<div className="bg-purple-50">
													<div className="grid grid-cols-6 gap-2 px-4 py-2 text-xs font-medium text-gray-700 border-b">
														<div></div>
														<div className="text-center">Inches</div>
														<div className="text-center">mm</div>
														<div className="text-center">Insulation Wall/Layer</div>
														<div className="text-center">Inches</div>
														<div className="text-center">mm</div>
													</div>
													<div className="px-4 py-2 space-y-2">
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Min</div>
															<div className="font-mono text-center">{(results.dimensions.bare.min + 2 * 3 * 0.002 - (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.min + 2 * 3 * 0.002 - (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)) * 25.4).toFixed(3)}</div>
															<div className="text-center text-xs text-red-600">CONSULT FACTORY</div>
															<div></div>
															<div></div>
														</div>
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Nom</div>
															<div className="font-mono text-center">{(results.dimensions.bare.nom + 2 * 3 * 0.002).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.nom + 2 * 3 * 0.002) * 25.4).toFixed(3)}</div>
															<div className="font-mono text-center">
																{insulationType === "ETFE" && (0.001).toFixed(4)}
																{insulationType === "FEP" && (strandCount * 25 < 12405 ? 0.002 : 0.004).toFixed(4)}
																{insulationType === "PFA" && (0.0015).toFixed(4)}
															</div>
															<div className="font-mono text-center">
																{insulationType === "ETFE" && (0.001 * 25.4).toFixed(3)}
																{insulationType === "FEP" && ((strandCount * 25 < 12405 ? 0.002 : 0.004) * 25.4).toFixed(3)}
																{insulationType === "PFA" && (0.0015 * 25.4).toFixed(3)}
															</div>
														</div>
														<div className="grid grid-cols-6 gap-2 text-sm">
															<div className="font-medium">Max</div>
															<div className="font-mono text-center">{(results.dimensions.bare.max + 2 * 3 * 0.002 + (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)).toFixed(4)}</div>
															<div className="font-mono text-center">{((results.dimensions.bare.max + 2 * 3 * 0.002 + (results.dimensions.bare.nom > 0.1 ? 0.002 : 0.001)) * 25.4).toFixed(3)}</div>
															<div className="text-center text-xs text-red-600">CONSULT FACTORY</div>
															<div></div>
															<div></div>
														</div>
													</div>
													<div className="border-t bg-white px-4 py-2">
														<div className="text-xs font-mono">
															Rubadue Part Number: TXXL{strandCount}/{awgSize}{insulationType === "FEP" ? "F" : insulationType === "ETFE" ? "T" : "P"}XXX-{insulationType === "ETFE" ? "1.0" : insulationType === "FEP" ? (strandCount * 25 < 12405 ? "2.0" : "4.0") : "1.5"}({magnetWireGrade})
														</div>
													</div>
												</div>
											</div>

											{/* Engineering Notes */}
											<div className="bg-gray-50 p-4 rounded-lg">
												<h4 className="font-medium text-gray-900 mb-2">Insulation Engineering Notes</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
													<div className="space-y-1">
														<div><strong>Wall Thickness:</strong> Calculated per UL and IEC standards</div>
														<div><strong>Temperature Rating:</strong> Based on magnet wire grade selection</div>
														<div><strong>Voltage Rating:</strong> Single/Double/Triple build classifications</div>
													</div>
													<div className="space-y-1">
														<div><strong>Material Properties:</strong></div>
														<div className="ml-2">• FEP: UL approved, excellent chemical resistance</div>
														<div className="ml-2">• ETFE: High temperature, good flexibility</div>
														<div className="ml-2">• PFA: Superior chemical/temperature resistance</div>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
