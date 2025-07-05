import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	calculateLitzConstruction,
	validateStrandCount,
	calculateBareLitzDiameters,
	calculateInsulatedLitzDiameters,
	checkULApproval,
	type LitzConstruction,
	type StrandValidationResult,
	type DiameterResult,
} from "@/lib/litz-calculations";
import {
	CheckCircle,
	XCircle,
	AlertTriangle,
	Info,
	HelpCircle,
} from "lucide-react";

const formSchema = z
	.object({
		numberOfStrands: z.number().min(1, "Number of strands must be at least 1"),
		wireAWG: z
			.number()
			.min(8, "Wire AWG must be at least 8")
			.max(50, "Wire AWG must be at most 50"),
		litzType: z.enum(["Type 1", "Type 2"]),
		wireType: z.enum(["Bare & Served", "Insulated"]),
		magnetWireGrade: z.string().min(1, "Magnet wire grade is required"),
		insulationType: z.string().optional(),
		wallThickness: z
			.number()
			.min(0, "Wall thickness must be non-negative")
			.optional(),
	})
	.refine(
		(data) => {
			if (data.wireType === "Insulated") {
				return (
					data.insulationType &&
					data.insulationType.length > 0 &&
					data.wallThickness !== undefined
				);
			}
			return true;
		},
		{
			message:
				"Insulation material and wall thickness are required for insulated wire type",
			path: ["insulationType"],
		},
	);

type FormData = z.infer<typeof formSchema>;

export function LitzDesignToolV2() {
	const [isCalculating, setIsCalculating] = useState(false);
	const [calculationError, setCalculationError] = useState<string | null>(null);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			numberOfStrands: 200,
			wireAWG: 36,
			litzType: "Type 1",
			wireType: "Bare & Served",
			magnetWireGrade: "MW 79-C",
			insulationType: "",
			wallThickness: 0,
		},
	});

	const formData = form.watch();

	const [validation, setValidation] = useState<StrandValidationResult | null>(
		null,
	);
	const [construction, setConstruction] = useState<LitzConstruction | null>(
		null,
	);
	const [diameterResults, setDiameterResults] = useState<{
		bare?: Record<string, DiameterResult>;
		insulated?: Record<string, DiameterResult>;
		ulWarnings: string[];
	}>({ ulWarnings: [] });

	// Memoize validation result to avoid unnecessary recalculations
	const validationResult = useMemo(() => {
		if (formData.numberOfStrands > 0 && formData.wireAWG > 0) {
			return validateStrandCount(formData.numberOfStrands, formData.wireAWG);
		}
		return null;
	}, [formData.numberOfStrands, formData.wireAWG]);

	// Calculate results whenever form data changes
	const calculateResults = useCallback(async () => {
		if (formData.numberOfStrands > 0 && formData.wireAWG > 0) {
			setIsCalculating(true);
			setCalculationError(null);

			try {
				// Validate strand count
				const validationResult = validateStrandCount(
					formData.numberOfStrands,
					formData.wireAWG,
				);
				setValidation(validationResult);

				if (validationResult.isValid) {
					// Calculate construction
					const constructionResult = calculateLitzConstruction(
						formData.numberOfStrands,
						formData.wireAWG,
						formData.litzType,
						formData.magnetWireGrade,
					);
					setConstruction(constructionResult);

					// Calculate diameters
					const results: {
						bare?: Record<string, DiameterResult>;
						insulated?: Record<string, DiameterResult>;
						ulWarnings: string[];
					} = { ulWarnings: [] };

					if (formData.wireType === "Bare & Served") {
						// Calculate bare Litz diameters for all film types
						const bareResults: Record<string, DiameterResult> = {};
						const filmTypes = [
							"Single",
							"Heavy",
							"Triple",
							"Quadruple",
						] as const;

						for (const filmType of filmTypes) {
							try {
								bareResults[filmType] = calculateBareLitzDiameters(
									formData.numberOfStrands,
									formData.wireAWG,
									constructionResult.packingFactor,
									formData.magnetWireGrade,
									filmType,
								);
							} catch (error) {
								console.error(`Error calculating ${filmType} film:`, error);
							}
						}

						results.bare = bareResults;
					} else if (
						formData.wireType === "Insulated" &&
						formData.insulationType &&
						formData.wallThickness
					) {
						// Calculate insulated Litz diameters
						const insulatedResults: Record<string, DiameterResult> = {};
						const layers = [1, 2, 3] as const;

						// Get bare diameter for base calculation
						const bareDiameter = calculateBareLitzDiameters(
							formData.numberOfStrands,
							formData.wireAWG,
							constructionResult.packingFactor,
							formData.magnetWireGrade,
							"Single",
						).nom;

						for (const layer of layers) {
							try {
								insulatedResults[
									`${layer === 1 ? "Single" : layer === 2 ? "Double" : "Triple"} Insulated`
								] = calculateInsulatedLitzDiameters(
									bareDiameter,
									formData.wireAWG,
									formData.insulationType || "",
									formData.wallThickness || 0,
									layer,
									formData.magnetWireGrade,
								);
							} catch (error) {
								console.error(
									`Error calculating ${layer}-layer insulation:`,
									error,
								);
							}
						}

						results.insulated = insulatedResults;

						// Check UL approval requirements
						const ulWarnings = checkULApproval(
							bareDiameter,
							formData.insulationType,
							formData.wallThickness,
							constructionResult.totalCopperAreaCMA,
						);
						results.ulWarnings = ulWarnings;
					}

					setDiameterResults(results);
				} else {
					setConstruction(null);
					setDiameterResults({ ulWarnings: [] });
				}
			} catch (error) {
				console.error("Calculation error:", error);
				setCalculationError(
					"An error occurred during calculation. Please check your inputs and try again.",
				);
				setConstruction(null);
				setDiameterResults({ ulWarnings: [] });
			} finally {
				setIsCalculating(false);
			}
		}
	}, [
		formData.numberOfStrands,
		formData.wireAWG,
		formData.litzType,
		formData.wireType,
		formData.magnetWireGrade,
		formData.insulationType,
		formData.wallThickness,
	]);

	useEffect(() => {
		calculateResults();
	}, [calculateResults]);

	return (
		<TooltipProvider>
			<div className="max-w-7xl mx-auto p-6 space-y-8">
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
					{/* Input Form */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle>Construction Parameters</CardTitle>
							<CardDescription>
								Enter your Litz wire specifications to calculate construction
								details and diameters
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<Form {...form}>
								<form className="space-y-6">
									<FormField
										control={form.control}
										name="numberOfStrands"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													Number of Strands
													<Tooltip>
														<TooltipTrigger asChild>
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent>
															<p>
																Total number of individual wire strands in the
																Litz construction
															</p>
														</TooltipContent>
													</Tooltip>
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="1"
														placeholder="e.g., 200"
														{...field}
														onChange={(e) =>
															field.onChange(
																Number.parseInt(e.target.value) || 0,
															)
														}
														disabled={isCalculating}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="wireAWG"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													Wire AWG
													<Tooltip>
														<TooltipTrigger asChild>
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent>
															<p>
																American Wire Gauge of individual strands (8-50)
															</p>
														</TooltipContent>
													</Tooltip>
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="8"
														max="50"
														placeholder="e.g., 36"
														{...field}
														onChange={(e) =>
															field.onChange(
																Number.parseInt(e.target.value) || 0,
															)
														}
														disabled={isCalculating}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="litzType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Litz Type</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
													disabled={isCalculating}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Type 1">Type 1</SelectItem>
														<SelectItem value="Type 2">Type 2</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="wireType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Wire Type</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
													disabled={isCalculating}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Bare & Served">
															Bare & Served Litz Wires
														</SelectItem>
														<SelectItem value="Insulated">
															Insulated Litz Wires
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="magnetWireGrade"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Magnet Wire Grade</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
													disabled={isCalculating}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="MW 79-C">MW 79-C</SelectItem>
														<SelectItem value="MW 80-C">MW 80-C</SelectItem>
														<SelectItem value="MW 77-C">MW 77-C</SelectItem>
														<SelectItem value="MW 35-C">MW 35-C</SelectItem>
														<SelectItem value="MW 16-C">MW 16-C</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{formData.wireType === "Insulated" && (
										<>
											<FormField
												control={form.control}
												name="insulationType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Insulation Material</FormLabel>
														<Select
															onValueChange={field.onChange}
															value={field.value}
															disabled={isCalculating}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select insulation" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="ETFE">ETFE</SelectItem>
																<SelectItem value="FEP">FEP</SelectItem>
																<SelectItem value="PFA">PFA</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="wallThickness"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Wall Thickness (inches)</FormLabel>
														<FormControl>
															<Input
																type="number"
																step="0.0001"
																placeholder="e.g., 0.002"
																{...field}
																onChange={(e) =>
																	field.onChange(
																		Number.parseFloat(e.target.value) || 0,
																	)
																}
																disabled={isCalculating}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</>
									)}
								</form>
							</Form>

							{/* Calculation Error */}
							{calculationError && (
								<Alert className="border-red-500">
									<XCircle className="h-4 w-4 text-red-500" />
									<AlertDescription>
										<div className="font-medium">Calculation Error</div>
										<div className="text-sm">{calculationError}</div>
									</AlertDescription>
								</Alert>
							)}

							{/* Validation Alert */}
							{validation && (
								<Alert
									className={
										validation.isValid ? "border-green-500" : "border-red-500"
									}
								>
									{validation.isValid ? (
										<CheckCircle className="h-4 w-4 text-green-500" />
									) : (
										<XCircle className="h-4 w-4 text-red-500" />
									)}
									<AlertDescription>
										<div className="font-medium">{validation.message}</div>
										{validation.breakdown.length > 1 && (
											<div className="mt-2">
												<span className="text-sm">Breakdown: </span>
												{validation.breakdown.join(" → ")}
											</div>
										)}
										{validation.nearbyValid.length > 0 && (
											<div className="mt-2">
												<span className="text-sm">Nearby valid counts: </span>
												{validation.nearbyValid.join(", ")}
											</div>
										)}
									</AlertDescription>
								</Alert>
							)}

							{/* UL Warnings - moved here from right column */}
							{diameterResults.ulWarnings.length > 0 && (
								<Alert className="border-yellow-500">
									<AlertTriangle className="h-4 w-4 text-yellow-500" />
									<AlertDescription>
										<div className="font-medium">UL Approval Warnings:</div>
										<ul className="mt-2 space-y-1">
											{diameterResults.ulWarnings.map((warning) => (
												<li key={warning} className="text-sm">
													• {warning}
												</li>
											))}
										</ul>
									</AlertDescription>
								</Alert>
							)}

							{/* Loading Indicator */}
							{isCalculating && (
								<Alert className="border-blue-500">
									<Info className="h-4 w-4 text-blue-500" />
									<AlertDescription>
										<div className="font-medium">Calculating...</div>
										<div className="text-sm">
											Please wait while we process your specifications
										</div>
									</AlertDescription>
								</Alert>
							)}
						</CardContent>
					</Card>

					{/* Results Display */}
					<div className="space-y-6 lg:col-span-3">
						{/* Construction Details */}
						<Card className={!construction ? "border-red-500" : ""}>
							<CardHeader>
								<CardTitle>Construction Details</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<div className="text-sm text-muted-foreground">
											Operations
										</div>
										<div className="font-medium">
											{construction ? construction.numberOfOperations : "N/A"}
										</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											Packing Factor
										</div>
										<div className="font-medium">
											{construction
												? construction.packingFactor.toFixed(3)
												: "N/A"}
										</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											Take Up Factor
										</div>
										<div className="font-medium">
											{construction
												? construction.takeUpFactor.toFixed(3)
												: "N/A"}
										</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											Copper Area (CMA)
										</div>
										<div className="font-medium">
											{construction
												? construction.totalCopperAreaCMA.toFixed(1)
												: "N/A"}
										</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											Copper Area (mm²)
										</div>
										<div className="font-medium">
											{construction
												? construction.totalCopperAreaMM2.toFixed(3)
												: "N/A"}
										</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											Equivalent AWG
										</div>
										<div className="font-medium">
											{construction ? construction.equivalentAWG : "N/A"}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Bare & Served Results */}
						{formData.wireType === "Bare & Served" && (
							<Card className={!construction ? "border-red-500" : ""}>
								<CardHeader>
									<CardTitle>Bare & Served Litz Diameters</CardTitle>
									<CardDescription>
										Diameter specifications for different film types
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{(["Single", "Heavy", "Triple", "Quadruple"] as const).map(
											(filmType) => {
												const result = diameterResults.bare?.[filmType];
												return (
													<div key={filmType} className="border rounded-lg p-4">
														<h4 className="font-semibold mb-3">
															{filmType} Film
														</h4>
														<div className="grid grid-cols-3 gap-2 text-sm mb-3">
															<div>
																<span className="text-muted-foreground">
																	Min:
																</span>
																<div className="font-medium">
																	{result ? `${result.min.toFixed(3)}"` : "N/A"}
																</div>
															</div>
															<div>
																<span className="text-muted-foreground">
																	Nom:
																</span>
																<div className="font-medium">
																	{result ? `${result.nom.toFixed(3)}"` : "N/A"}
																</div>
															</div>
															<div>
																<span className="text-muted-foreground">
																	Max:
																</span>
																<div className="font-medium">
																	{result ? `${result.max.toFixed(3)}"` : "N/A"}
																</div>
															</div>
														</div>
														<div className="pt-2 border-t">
															<div className="text-xs text-muted-foreground">
																Part Number:
															</div>
															<div className="font-mono text-sm">
																{result ? result.partNumber : "N/A"}
															</div>
														</div>
													</div>
												);
											},
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Insulated Results */}
						{formData.wireType === "Insulated" && (
							<Card className={!construction ? "border-red-500" : ""}>
								<CardHeader>
									<CardTitle>Insulated Litz Diameters</CardTitle>
									<CardDescription>
										Diameter specifications for different insulation layers
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										{(
											[
												"Single Insulated",
												"Double Insulated",
												"Triple Insulated",
											] as const
										).map((insType) => {
											const result = diameterResults.insulated?.[insType];
											return (
												<div key={insType} className="border rounded-lg p-4">
													<h4 className="font-semibold mb-3">{insType}</h4>
													<div className="grid grid-cols-3 gap-2 text-sm mb-3">
														<div>
															<span className="text-muted-foreground">
																Min:
															</span>
															<div className="font-medium">
																{result ? `${result.min.toFixed(3)}"` : "N/A"}
															</div>
														</div>
														<div>
															<span className="text-muted-foreground">
																Nom:
															</span>
															<div className="font-medium">
																{result ? `${result.nom.toFixed(3)}"` : "N/A"}
															</div>
														</div>
														<div>
															<span className="text-muted-foreground">
																Max:
															</span>
															<div className="font-medium">
																{result ? `${result.max.toFixed(3)}"` : "N/A"}
															</div>
														</div>
													</div>
													<div className="pt-2 border-t">
														<div className="text-xs text-muted-foreground">
															Part Number:
														</div>
														<div className="font-mono text-sm">
															{result ? result.partNumber : "N/A"}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
