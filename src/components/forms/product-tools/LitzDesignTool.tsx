import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type DiameterResult,
	type LitzConstruction,
	MAGNET_WIRE_FILM_THICKNESSES,
	STRAND_OD_REFERENCE,
	type StrandValidationResult,
	calculateBareLitzDiameters,
	calculateInsulatedLitzDiameters,
	calculateLitzConstruction,
	calculateNylonServedDiameters,
	checkManufacturingCapability,
	checkULApproval,
	validateStrandCount,
} from "@/lib/litz-calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertTriangle,
	CheckCircle,
	HelpCircle,
	Info,
	XCircle,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InsulationSummaryTable } from "./InsulationSummaryTable";

const formSchema = z
	.object({
		numberOfStrands: z.number().min(1, "Number of strands must be at least 1"),
		wireAWG: z
			.number()
			.min(12, "Wire AWG must be at least 12")
			.max(50, "Wire AWG must be at most 50"),
		litzType: z.enum(["Type 1", "Type 2"]),
		wireType: z.enum(["Bare & Served", "Insulated"]),
		magnetWireGrade: z.string().min(1, "Magnet wire grade is required"),
		insulationType: z.enum(["ETFE", "FEP", "PFA"]).optional(),
	})
	.refine(
		(data) => {
			if (data.wireType === "Insulated") {
				return data.insulationType !== undefined;
			}
			return true;
		},
		{
			message: "Insulation material is required for insulated wire type",
			path: ["insulationType"],
		},
	);

type FormData = z.infer<typeof formSchema>;

export function LitzDesignToolV2() {
	const [isCalculating, setIsCalculating] = useState(false);
	const [calculationError, setCalculationError] = useState<string | null>(null);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		mode: "onBlur",
		defaultValues: {
			numberOfStrands: 0,
			wireAWG: 0,
			litzType: "Type 1",
			wireType: "Bare & Served",
			magnetWireGrade: "MW 79-C",
			insulationType: undefined,
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
		manufacturingWarnings: string[];
	}>({ ulWarnings: [], manufacturingWarnings: [] });

	// Insulation type selection state (moved here to be available for calculations)
	const insulationTypes = [
		"Single Insulated",
		"Double Insulated",
		"Triple Insulated",
	] as const;
	const [selectedInsulationType, setSelectedInsulationType] =
		useState<(typeof insulationTypes)[number]>("Single Insulated");

	// Helper functions
	const toMm = (inches: number | undefined) =>
		typeof inches === "number" ? inches * 25.4 : null;

	const displayValue = (val: number | undefined | null, decimals = 3) =>
		val === null || val === undefined || Number.isNaN(val) ? (
			<span className="text-muted-foreground font-semibold">N/A</span>
		) : (
			val.toFixed(decimals)
		);

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
						manufacturingWarnings: string[];
					} = { ulWarnings: [], manufacturingWarnings: [] };

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
								// Error handled silently
							}
						}

						results.bare = bareResults;

						// Check manufacturing capability warnings for bare & served
						const manufacturingWarnings = checkManufacturingCapability(
							constructionResult.totalCopperAreaCMA,
							"", // No insulation type for bare wire
							undefined, // No wall thickness for bare wire
						);
						results.manufacturingWarnings = manufacturingWarnings;
					} else if (formData.wireType === "Insulated") {
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

						// Use ETFE as default insulation type if none selected
						const insulationType = formData.insulationType || ("ETFE" as const);

						for (const layer of layers) {
							try {
								insulatedResults[
									`${layer === 1 ? "Single" : layer === 2 ? "Double" : "Triple"} Insulated`
								] = calculateInsulatedLitzDiameters(
									formData.wireAWG,
									insulationType,
									layer,
									formData.magnetWireGrade,
									formData.numberOfStrands,
									constructionResult.packingFactor,
								);
							} catch (error) {
								// Error handled silently
							}
						}

						// Check UL approval requirements for the selected insulation type only
						const selectedResult = insulatedResults[selectedInsulationType];
						const selectedUlWarnings: string[] = [];
						const selectedManufacturingWarnings: string[] = [];

						if (selectedResult) {
							const layerCount = selectedInsulationType.includes("Single")
								? 1
								: selectedInsulationType.includes("Double")
									? 2
									: 3;

							const ulWarnings = checkULApproval(
								selectedResult.nom, // Fixed: Use insulated diameter, not bare diameter
								insulationType,
								constructionResult.totalCopperAreaCMA,
								selectedResult.wallThicknessInches || undefined,
								layerCount,
							);
							selectedUlWarnings.push(...ulWarnings);

							const manufacturingWarnings = checkManufacturingCapability(
								constructionResult.totalCopperAreaCMA,
								insulationType,
								selectedResult.wallThicknessInches || undefined,
								layerCount,
							);
							selectedManufacturingWarnings.push(...manufacturingWarnings);
						}

						results.insulated = insulatedResults;
						results.ulWarnings = selectedUlWarnings;
						results.manufacturingWarnings = selectedManufacturingWarnings;
					}

					setDiameterResults(results);
				} else {
					setConstruction(null);
					setDiameterResults({ ulWarnings: [], manufacturingWarnings: [] });
				}
			} catch (error) {
				setCalculationError(
					"An error occurred during calculation. Please check your inputs and try again.",
				);
				setConstruction(null);
				setDiameterResults({ ulWarnings: [], manufacturingWarnings: [] });
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
		selectedInsulationType,
	]);

	useEffect(() => {
		calculateResults();
	}, [calculateResults]);

	// Reset insulation type when wire type changes to "Bare & Served"
	useEffect(() => {
		if (
			formData.wireType === "Bare & Served" &&
			formData.insulationType !== undefined
		) {
			form.setValue("insulationType", undefined);
		}
	}, [formData.wireType, formData.insulationType, form]);

	// New state for tabs and dropdowns
	const [bareServedTab, setBareServedTab] = useState<"bare" | "served">("bare");
	const filmTypes = ["Single", "Heavy", "Triple", "Quadruple"] as const;
	const [bareFilmType, setBareFilmType] =
		useState<(typeof filmTypes)[number]>("Single");
	const [servedFilmType, setServedFilmType] =
		useState<(typeof filmTypes)[number]>("Single");
	const serveTypes = ["Single Nylon Serve", "Double Nylon Serve"] as const;
	const [nylonServeType, setNylonServeType] =
		useState<(typeof serveTypes)[number]>("Single Nylon Serve");

	function sentenceCaseWithAcronyms(str: string) {
		if (!str) return str;
		// List of acronyms to preserve
		const acronyms = ["UL", "FEP", "ETFE", "PFA", "CMA", "AWG"];
		// Sentence case
		let result = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
		// Restore acronyms (whole word only)
		for (const acronym of acronyms) {
			const regex = new RegExp(`\\b${acronym}\\b`, "ig");
			result = result.replace(regex, acronym);
		}
		return result;
	}

	// Consolidated Rubadue Engineering consult alerts
	const showType1OpsWarning =
		construction &&
		construction.numberOfOperations > 3 &&
		formData.litzType === "Type 1";
	const showAwgStrandWarning =
		formData.wireAWG > 49 ||
		(formData.wireAWG < 23 && formData.numberOfStrands > 8);

	const awgFieldError = form.formState.errors.wireAWG;
	const strandFieldError = form.formState.errors.numberOfStrands;

	return (
		<TooltipProvider>
			<div className="max-w-7xl py-6 sm:py-12 md:py-16  mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
				<div className="grid grid-cols-1 xl:grid-cols-5 gap-6 sm:gap-8">
					{/* Input Form */}
					<Card className="xl:col-span-2">
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
														placeholder="Enter strand count"
														{...field}
														value={field.value || ""}
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
										render={({ field, fieldState }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													Wire AWG
													<Tooltip>
														<TooltipTrigger asChild>
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent>
															<p>
																American Wire Gauge of individual strands
																(12-50)
															</p>
														</TooltipContent>
													</Tooltip>
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="12"
														max="50"
														placeholder="Enter AWG"
														{...field}
														value={field.value || ""}
														onChange={(e) =>
															field.onChange(
																Number.parseInt(e.target.value) || 0,
															)
														}
														onBlur={field.onBlur}
														disabled={isCalculating}
														className={
															fieldState.error && fieldState.isTouched
																? "border-red-500 focus-visible:ring-red-500"
																: ""
														}
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
														<SelectItem value="MW 82-C">MW 82-C</SelectItem>
														<SelectItem value="MW 83-C">MW 83-C</SelectItem>
														<SelectItem value="Other">Other</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{formData.wireType === "Insulated" && (
										<FormField
											control={form.control}
											name="insulationType"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Insulation Material</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value || ""}
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
							{validation &&
								formData.numberOfStrands > 0 &&
								formData.wireAWG > 0 &&
								!awgFieldError &&
								!strandFieldError && (
									<Alert
										className={
											validation.isValid
												? "border-green-500 bg-green-50/60 rounded-lg"
												: "border-red-500 bg-red-50/60 rounded-lg"
										}
									>
										{validation.isValid ? (
											<CheckCircle className="h-4 w-4 text-green-500" />
										) : (
											<XCircle className="h-4 w-4 text-red-500" />
										)}
										<AlertDescription>
											<div className="text-sm font-medium mb-1 flex items-center gap-2 text-foreground">
												{validation.isValid
													? "Valid Strand Count"
													: "Invalid Strand Count"}
											</div>

											{validation.isValid ? (
												<div className="space-y-2">
													{/* Construction breakdown with explanation - no need to repeat "valid" */}
													{validation.breakdown.length > 1 && (
														<div className="text-sm text-muted-foreground space-y-1">
															<div>
																<span className="font-medium">
																	Breakdown process:
																</span>{" "}
																{validation.breakdown.join(" → ")} strands
															</div>
															<div className="text-sm">
																Each step represents a manufacturing level where
																strands are divided by 5, 3, or 4 until reaching
																the final bundle size.
															</div>
														</div>
													)}
												</div>
											) : (
												<div className="text-sm text-muted-foreground mb-2">
													{validation.message.charAt(0).toUpperCase() +
														validation.message.slice(1)}
												</div>
											)}

											{validation.nearbyValid.length > 0 && (
												<div className="mt-3 pt-2 border-t border-border/50">
													<div className="text-xs font-medium text-muted-foreground mb-2">
														Try these alternatives:
													</div>
													<div className="flex items-center gap-2 flex-wrap">
														{validation.nearbyValid.slice(0, 5).map((count) => (
															<button
																key={count}
																type="button"
																className="focus:outline-none"
																onClick={() =>
																	form.setValue("numberOfStrands", count)
																}
															>
																<Badge
																	variant="secondary"
																	className="cursor-pointer hover:bg-primary/10 hover:border-primary/20 transition text-xs text-foreground"
																>
																	{count}
																</Badge>
															</button>
														))}
													</div>
												</div>
											)}
										</AlertDescription>
									</Alert>
								)}

							{/* Manufacturing Capability Warnings */}
							{diameterResults.manufacturingWarnings.length > 0 && (
								<Alert className="border-orange-500 bg-orange-50/60 rounded-lg">
									<AlertTriangle className="h-4 w-4 text-orange-500" />
									<AlertDescription>
										<div className="text-sm font-medium mb-1 flex items-center gap-2 text-foreground">
											Manufacturing Capability Warnings
										</div>
										{diameterResults.manufacturingWarnings.length === 1 ? (
											<div className="text-sm text-muted-foreground font-normal">
												{sentenceCaseWithAcronyms(
													diameterResults.manufacturingWarnings[0],
												)}
											</div>
										) : (
											<ul className="mt-2 space-y-2">
												{diameterResults.manufacturingWarnings.map(
													(warning) => (
														<li
															key={warning}
															className="flex items-start gap-2 text-sm text-muted-foreground font-normal"
														>
															<span className="mt-0.5">•</span>
															<span>{sentenceCaseWithAcronyms(warning)}</span>
														</li>
													),
												)}
											</ul>
										)}
									</AlertDescription>
								</Alert>
							)}

							{/* UL Warnings - moved here from right column */}
							{formData.insulationType &&
								diameterResults.ulWarnings.length > 0 && (
									<Alert className="border-yellow-500 bg-yellow-50/60 rounded-lg">
										<AlertTriangle className="h-4 w-4 text-yellow-500" />
										<AlertDescription>
											<div className="text-sm font-medium mb-1 flex items-center gap-2 text-foreground">
												UL Approval Warnings
											</div>
											{diameterResults.ulWarnings.length === 1 ? (
												<div className="text-sm text-muted-foreground font-normal">
													{sentenceCaseWithAcronyms(
														diameterResults.ulWarnings[0],
													)}
												</div>
											) : (
												<ul className="mt-2 space-y-2">
													{diameterResults.ulWarnings.map((warning) => (
														<li
															key={warning}
															className="flex items-start gap-2 text-sm text-muted-foreground font-normal"
														>
															<span className="mt-0.5">•</span>
															<span>{sentenceCaseWithAcronyms(warning)}</span>
														</li>
													))}
												</ul>
											)}
										</AlertDescription>
									</Alert>
								)}

							{/* Type 1 Litz 4+ Operations Warning - moved to left column */}
							{formData.numberOfStrands > 0 &&
								formData.wireAWG > 0 &&
								!awgFieldError &&
								!strandFieldError &&
								(showType1OpsWarning || showAwgStrandWarning) && (
									<Alert className="border-orange-500 bg-orange-50/60 rounded-lg">
										<AlertTriangle className="h-4 w-4 text-orange-500" />
										<AlertDescription>
											{showType1OpsWarning && showAwgStrandWarning ? (
												<>
													<div className="text-sm text-muted-foreground font-normal mb-1">
														Please consult Rubadue Engineering for the
														following:
													</div>
													<ul className="list-disc pl-5 text-sm text-muted-foreground font-normal mb-2">
														<li>
															Type 1 Litz constructions requiring 4+ operations
														</li>
														{formData.wireAWG > 49 && (
															<li>
																For strand sizes smaller than 48 AWG, please
																consult Rubadue Engineering to confirm final
																construction.
															</li>
														)}
														{formData.wireAWG < 23 &&
															formData.numberOfStrands > 8 && (
																<li>
																	For large strand counts (more than 8) with
																	heavy-gauge wire (AWG less than 23), special
																	construction may be required. Please consult
																	Rubadue Engineering to confirm
																	manufacturability.
																</li>
															)}
													</ul>
												</>
											) : showType1OpsWarning ? (
												<div className="text-sm text-muted-foreground font-normal">
													Please consult Rubadue Engineering for Type 1 Litz
													constructions requiring 4+ operations.
												</div>
											) : formData.wireAWG > 49 ? (
												<div className="text-sm text-muted-foreground font-normal">
													For strand sizes smaller than 48 AWG, please consult
													Rubadue Engineering to confirm final construction.
												</div>
											) : (
												<div className="text-sm text-muted-foreground font-normal">
													For large strand counts (more than 8) with heavy-gauge
													wire (AWG less than 23), special construction may be
													required. Please consult Rubadue Engineering to
													confirm manufacturability.
												</div>
											)}
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
					<div className="space-y-6 xl:col-span-3">
						{/* Construction Details */}
						<Card
							className={
								!construction &&
								formData.numberOfStrands > 0 &&
								formData.wireAWG > 0
									? "border-red-500"
									: ""
							}
						>
							<CardHeader>
								<CardTitle>Construction Details</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
											{construction &&
											!(
												construction.numberOfOperations > 3 &&
												formData.litzType === "Type 1"
											)
												? construction.packingFactor.toFixed(3)
												: "N/A"}
										</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											Take Up Factor
										</div>
										<div className="font-medium">
											{construction &&
											!(
												construction.numberOfOperations > 3 &&
												formData.litzType === "Type 1"
											)
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
												? Number.parseFloat(
														construction.totalCopperAreaCMA.toFixed(1),
													).toString()
												: "N/A"}
										</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											Copper Area (mm²)
										</div>
										<div className="font-medium">
											{construction
												? construction.totalCopperAreaMM2.toFixed(2)
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

						{/* Bare & Served Results with Tabs and Dropdowns */}
						{formData.wireType === "Bare & Served" && (
							<Card
								className={
									!construction &&
									formData.numberOfStrands > 0 &&
									formData.wireAWG > 0
										? "border-red-500"
										: ""
								}
							>
								<CardHeader>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-muted-foreground/20">
										<div className="space-y-1">
											<CardTitle>Bare & Served Litz Diameters</CardTitle>
											<CardDescription>
												Diameter specifications for different film and serve
												types
											</CardDescription>
										</div>
										<div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-left sm:text-right">
											<span>Part Number</span>
											<div className="text-base font-semibold tracking-wider text-foreground break-all">
												{(() => {
													let partNumber = "N/A";
													if (
														bareServedTab === "bare" &&
														diameterResults.bare?.[bareFilmType]?.partNumber
													) {
														partNumber =
															diameterResults.bare[bareFilmType].partNumber;
													} else if (
														bareServedTab === "served" &&
														diameterResults.bare?.[servedFilmType]
													) {
														const servedResult = calculateNylonServedDiameters(
															diameterResults.bare[servedFilmType],
															nylonServeType,
														);
														partNumber = servedResult.partNumber;
													}

													return partNumber;
												})()}
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 sm:items-end">
										<div className="flex flex-col">
											<span className="mb-1">Litz Type</span>
											<Select
												value={bareServedTab}
												onValueChange={(v) =>
													setBareServedTab(v as "bare" | "served")
												}
											>
												<SelectTrigger className="w-full sm:w-40">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="bare">Bare Litz</SelectItem>
													<SelectItem value="served">Nylon Served</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="flex flex-col">
											<span className="mb-1">Film Type</span>
											<Select
												value={
													bareServedTab === "bare"
														? bareFilmType
														: servedFilmType
												}
												onValueChange={(v) =>
													bareServedTab === "bare"
														? setBareFilmType(v as (typeof filmTypes)[number])
														: setServedFilmType(v as (typeof filmTypes)[number])
												}
											>
												<SelectTrigger className="w-full sm:w-40">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{filmTypes.map((type) => (
														<SelectItem key={type} value={type}>
															{type} Film
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										{bareServedTab === "served" && (
											<div className="flex flex-col">
												<span className="mb-1">Serve Type</span>
												<Select
													value={nylonServeType}
													onValueChange={(v) =>
														setNylonServeType(v as (typeof serveTypes)[number])
													}
												>
													<SelectTrigger className="w-full sm:w-48">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{serveTypes.map((type) => (
															<SelectItem key={type} value={type}>
																{type}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										)}
									</div>
									{bareServedTab === "bare"
										? (() => {
												const result = diameterResults.bare?.[bareFilmType];
												let strandOD: {
													min: number | undefined;
													nom: number | undefined;
													max: number | undefined;
												} = { min: undefined, nom: undefined, max: undefined };

												// Get strand OD from film thickness data based on selected film type
												const filmData =
													MAGNET_WIRE_FILM_THICKNESSES?.[formData.wireAWG];
												if (filmData) {
													const filmType =
														bareFilmType.toLowerCase() as keyof typeof filmData;
													const thickness = filmData[filmType];
													if (thickness && thickness.nom > 0) {
														strandOD = {
															min: thickness.min,
															nom: thickness.nom,
															max: thickness.max,
														};
													}
												}

												// Check if construction is valid
												const isValid = construction?.isValid;
												return (
													<div className="p-2">
														<div className="flex items-center justify-between mb-2 relative">
															<div className="font-bold text-lg">
																{bareFilmType} Film - Bare Litz
															</div>
														</div>
														<div className="overflow-x-auto">
															<Table>
																<TableHeader>
																	<TableRow className="hover:bg-transparent">
																		<TableHead
																			rowSpan={2}
																			className="text-center align-middle w-20"
																		/>
																		<TableHead
																			colSpan={2}
																			className="text-center align-middle w-32"
																		>
																			Bare Litz
																		</TableHead>
																		<TableHead
																			colSpan={2}
																			className="text-center align-middle w-32"
																		>
																			Strand OD's
																		</TableHead>
																	</TableRow>
																	<TableRow className="hover:bg-transparent">
																		<TableHead className="text-center w-16">
																			Inches
																		</TableHead>
																		<TableHead className="text-center w-16">
																			mm
																		</TableHead>
																		<TableHead className="text-center w-16">
																			Inches
																		</TableHead>
																		<TableHead className="text-center w-16">
																			mm
																		</TableHead>
																	</TableRow>
																</TableHeader>
																<TableBody>
																	<TableRow>
																		<TableHead className="text-center align-middle">
																			Min
																		</TableHead>
																		<TableCell className="text-center align-middle">
																			{displayValue(result?.min, 3)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{displayValue(toMm(result?.min), 3)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{isValid ? (
																				displayValue(strandOD.min, 4)
																			) : (
																				<span className="text-muted-foreground font-semibold">
																					N/A
																				</span>
																			)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{isValid ? (
																				displayValue(toMm(strandOD.min), 3)
																			) : (
																				<span className="text-muted-foreground font-semibold">
																					N/A
																				</span>
																			)}
																		</TableCell>
																	</TableRow>
																	<TableRow>
																		<TableHead className="text-center align-middle">
																			Nom
																		</TableHead>
																		<TableCell className="text-center align-middle">
																			{displayValue(result?.nom, 3)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{displayValue(toMm(result?.nom), 3)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{isValid ? (
																				displayValue(strandOD.nom, 4)
																			) : (
																				<span className="text-muted-foreground font-semibold">
																					N/A
																				</span>
																			)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{isValid ? (
																				displayValue(toMm(strandOD.nom), 3)
																			) : (
																				<span className="text-muted-foreground font-semibold">
																					N/A
																				</span>
																			)}
																		</TableCell>
																	</TableRow>
																	<TableRow>
																		<TableHead className="text-center align-middle">
																			Max
																		</TableHead>
																		<TableCell className="text-center align-middle">
																			{displayValue(result?.max, 3)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{displayValue(toMm(result?.max), 3)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{isValid ? (
																				displayValue(strandOD.max, 4)
																			) : (
																				<span className="text-muted-foreground font-semibold">
																					N/A
																				</span>
																			)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{isValid ? (
																				displayValue(toMm(strandOD.max), 3)
																			) : (
																				<span className="text-muted-foreground font-semibold">
																					N/A
																				</span>
																			)}
																		</TableCell>
																	</TableRow>
																</TableBody>
															</Table>
														</div>
													</div>
												);
											})()
										: (() => {
												const bareResult =
													diameterResults.bare?.[servedFilmType];
												const result = bareResult
													? calculateNylonServedDiameters(
															bareResult,
															nylonServeType,
														)
													: null;
												return (
													<div className="p-2">
														<div className="flex items-center justify-between mb-2 relative">
															<div className="font-bold text-lg">
																{servedFilmType} Film - {nylonServeType}
															</div>
														</div>
														<div className="overflow-x-auto">
															<Table>
																<TableHeader>
																	<TableRow className="hover:bg-transparent">
																		<TableHead
																			rowSpan={2}
																			className="text-center align-middle w-20"
																		/>
																		<TableHead
																			colSpan={2}
																			className="text-center align-middle w-32"
																		>
																			Nylon Served
																		</TableHead>
																	</TableRow>
																	<TableRow className="hover:bg-transparent">
																		<TableHead className="text-center w-16">
																			Inches
																		</TableHead>
																		<TableHead className="text-center w-16">
																			mm
																		</TableHead>
																	</TableRow>
																</TableHeader>
																<TableBody>
																	<TableRow>
																		<TableHead className="text-center align-middle">
																			Min
																		</TableHead>
																		<TableCell className="text-center align-middle">
																			{displayValue(result?.min)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{displayValue(
																				toMm(result?.min ?? undefined),
																			)}
																		</TableCell>
																	</TableRow>
																	<TableRow>
																		<TableHead className="text-center align-middle">
																			Nom
																		</TableHead>
																		<TableCell className="text-center align-middle">
																			{displayValue(result?.nom)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{displayValue(
																				toMm(result?.nom ?? undefined),
																			)}
																		</TableCell>
																	</TableRow>
																	<TableRow>
																		<TableHead className="text-center align-middle">
																			Max
																		</TableHead>
																		<TableCell className="text-center align-middle">
																			{displayValue(result?.max)}
																		</TableCell>
																		<TableCell className="text-center align-middle">
																			{displayValue(
																				toMm(result?.max ?? undefined),
																			)}
																		</TableCell>
																	</TableRow>
																</TableBody>
															</Table>
														</div>
													</div>
												);
											})()}
								</CardContent>
							</Card>
						)}

						{/* Insulated Results */}
						{formData.wireType === "Insulated" && (
							<Card
								className={
									!construction &&
									formData.numberOfStrands > 0 &&
									formData.wireAWG > 0
										? "border-red-500"
										: ""
								}
							>
								<CardHeader>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-muted-foreground/20">
										<div className="space-y-1">
											<CardTitle>Insulated Litz Diameters</CardTitle>
											<CardDescription>
												Diameter specifications for different insulation layers
											</CardDescription>
										</div>
										<div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-left sm:text-right">
											<span className="font-mono">Part Number</span>
											<div className="text-base font-semibold tracking-wider text-foreground break-all">
												{(() => {
													const result =
														diameterResults.insulated?.[selectedInsulationType];
													const partNumber = result?.partNumber || "N/A";

													return partNumber;
												})()}
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 sm:items-end">
										<div className="flex flex-col">
											<span className="mb-1">Insulation Type</span>
											<Select
												value={selectedInsulationType}
												onValueChange={(v) =>
													setSelectedInsulationType(
														v as (typeof insulationTypes)[number],
													)
												}
											>
												<SelectTrigger className="w-full sm:w-48">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{insulationTypes.map((type) => (
														<SelectItem key={type} value={type}>
															{type === "Single Insulated"
																? "Single Insulated Wire"
																: type === "Double Insulated"
																	? "Double Insulated Wire"
																	: "Triple Insulated Wire"}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									{(() => {
										const result =
											diameterResults.insulated?.[selectedInsulationType];
										const title =
											selectedInsulationType === "Single Insulated"
												? "Single Insulated Wire"
												: selectedInsulationType === "Double Insulated"
													? "Double Insulated Wire"
													: "Triple Insulated Wire";
										return (
											<InsulationSummaryTable
												key={selectedInsulationType}
												title={title}
												min={{
													inches: result?.min ?? null,
													mm: toMm(result?.min) ?? null,
												}}
												nom={{
													inches: result?.nom ?? null,
													mm: toMm(result?.nom) ?? null,
												}}
												max={{
													inches: result?.max ?? null,
													mm: toMm(result?.max) ?? null,
												}}
												wallInches={result?.wallThicknessInches ?? null}
												wallMm={result?.wallThicknessMm ?? null}
												partNumber={result?.partNumber ?? "N/A"}
												nomWallInches={result?.wallThicknessInches ?? null}
												nomWallMm={result?.wallThicknessMm ?? null}
											/>
										);
									})()}
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
