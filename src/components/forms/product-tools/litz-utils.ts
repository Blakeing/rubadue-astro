import {
	type InsulationType,
	type InsulationLayerType,
	type LitzType,
	type ConstructionEntry,
	type ConstructionResults,
	type DimensionResults,
	type DimensionSet,
	type MagnetWireGrade,
	constructionLimits,
	type1ConstructionTable,
	type2ConstructionTable,
	temperatureCoefficients,
	awgData,
	maxEndsTable,
	singleInsulationData,
	heavyInsulationData,
	tripleInsulationData,
	quadInsulationData,
	awgOptions,
	constants,
	insulationTypes,
	magnetWireGrades,
} from "./litz-types";

/**
 * Calculate litz construction based on strand count and AWG size
 * Implements the complex Excel logic from Cover Sheet rows 14-33
 */
export function calculateLitzConstruction(
	strandCount: number | string,
	awgSize: number | string,
): ConstructionResults {
	// Convert and validate inputs
	const validStrandCount = Number(strandCount);
	const validAwgSize = Number(awgSize);

	// Input validation
	if (Number.isNaN(validStrandCount) || validStrandCount <= 0) {
		throw new Error(`Invalid strand count: ${strandCount}`);
	}
	if (Number.isNaN(validAwgSize) || validAwgSize <= 0) {
		throw new Error(`Invalid AWG size: ${awgSize}`);
	}

	console.log("🔧 calculateLitzConstruction:", {
		strandCount: validStrandCount,
		awgSize: validAwgSize,
	});

	// Determine if Type 1 or Type 2 construction
	const maxEnds = getMaxEnds(validAwgSize);
	const isType1 =
		validAwgSize < 26 || (validAwgSize < 32 && validStrandCount <= maxEnds);
	const type: LitzType = isType1 ? "Type 1" : "Type 2";

	console.log("📊 Construction type determination:", {
		maxEnds,
		isType1,
		type,
	});

	// Calculate construction operations using the Excel algorithm
	let operations = 1;
	let currentStrands = validStrandCount;
	let finalStrands = validStrandCount;

	console.log("🔄 Starting multi-level divisibility checking...");

	// Implement the multi-level divisibility checking from the Excel formulas
	for (let level = 0; level < 5; level++) {
		const candidates = [];

		// Check divisibility by 5, 3, and 4 (order matters for Excel compatibility)
		if (currentStrands % 5 === 0 && currentStrands / 5 > 1) {
			candidates.push({ strands: currentStrands / 5, divisor: 5 });
		}
		if (currentStrands % 3 === 0 && currentStrands / 3 > 1) {
			candidates.push({ strands: currentStrands / 3, divisor: 3 });
		}
		if (currentStrands % 4 === 0 && currentStrands / 4 > 1) {
			candidates.push({ strands: currentStrands / 4, divisor: 4 });
		}

		console.log(`🎯 Level ${level} candidates:`, candidates);

		// Apply AWG-specific constraints
		const validCandidates = candidates.filter((candidate) => {
			if (validAwgSize < 49) {
				return candidate.strands <= maxEnds;
			}
			// For AWG >= 49, additional constraints apply
			return (
				candidate.strands >= constructionLimits.MIN_STRANDS_LARGE_AWG &&
				candidate.strands / candidate.divisor > 9
			);
		});

		console.log(`✅ Level ${level} valid candidates:`, validCandidates);

		if (validCandidates.length === 0) {
			console.log(`🛑 No valid candidates at level ${level}, breaking`);
			break;
		}

		// Select the first valid candidate (matches Excel priority)
		const selected = validCandidates[0];
		currentStrands = selected.strands;
		operations++;

		console.log(
			"🔄 Selected:",
			selected,
			`New currentStrands: ${currentStrands}, operations: ${operations}`,
		);

		// Check if we've reached a final construction
		if (currentStrands <= maxEnds && operations <= getMaxOperations(type)) {
			finalStrands = currentStrands;
			console.log(`🎯 Final construction reached: ${finalStrands} strands`);
			break;
		}
	}

	// Validate construction
	const isValid = validateConstructionLimits(
		validStrandCount,
		validAwgSize,
		operations,
		type,
	);

	const result = {
		type,
		operations,
		finalStrands,
		isValid,
	};

	console.log("✅ Construction result:", result);
	return result;
}

/**
 * Calculate electrical properties including DC resistance and equivalent AWG
 * Implements Excel formulas from Cover Sheet H4, H5, H6, D9, D10
 */
export function calculateElectricalProperties(
	strandCount: number | string,
	awgSize: number | string,
	temperature: number | string,
	packingFactor: number | string,
	frequency: number | string = 1000, // Hz, default to 1kHz
): {
	totalCMA: number;
	dcResistance: number;
	dcResistancePerFoot: number;
	equivalentAWG: string;
	skinDepth: number;
	n1Max: number;
} {
	// Convert and validate inputs
	const validStrandCount = Number(strandCount);
	const validAwgSize = Number(awgSize);
	const validTemperature = Number(temperature);
	const validPackingFactor = Number(packingFactor);
	const validFrequency = Number(frequency);

	// Input validation
	if (Number.isNaN(validStrandCount) || validStrandCount <= 0) {
		throw new Error(`Invalid strand count: ${strandCount}`);
	}
	if (Number.isNaN(validAwgSize) || validAwgSize <= 0) {
		throw new Error(`Invalid AWG size: ${awgSize}`);
	}
	if (Number.isNaN(validTemperature)) {
		throw new Error(`Invalid temperature: ${temperature}`);
	}
	if (Number.isNaN(validPackingFactor) || validPackingFactor <= 0) {
		throw new Error(`Invalid packing factor: ${packingFactor}`);
	}
	if (Number.isNaN(validFrequency) || validFrequency <= 0) {
		throw new Error(`Invalid frequency: ${frequency}`);
	}

	console.log("⚡ calculateElectricalProperties:", {
		strandCount: validStrandCount,
		awgSize: validAwgSize,
		temperature: validTemperature,
		packingFactor: validPackingFactor,
		frequency: validFrequency,
	});

	const awgData = awgOptions.find(
		(awg) => awg.value === validAwgSize.toString(),
	);
	if (!awgData) {
		throw new Error(`AWG size ${validAwgSize} not found`);
	}

	console.log("📊 AWG Data:", awgData);

	// Calculate total CMA (D9 formula: CMA_SOLID * strand_count)
	const totalCMA = awgData.cma * validStrandCount;
	console.log("🔢 Total CMA calculation:", {
		singleStrandCMA: awgData.cma,
		strandCount: validStrandCount,
		totalCMA,
	});

	// Calculate temperature-adjusted resistivity using Excel Q6 formula
	// Q6: =E4*(1+N6*(P6-O6)) where E4=resistivity, N6=temp_coeff, P6=operating_temp, O6=reference_temp
	const tempCorrectedResistivity =
		temperatureCoefficients.copperResistivityRef *
		(1 +
			temperatureCoefficients.copperTempCoeff *
				(validTemperature - temperatureCoefficients.referenceTemp));

	console.log("🌡️ Enhanced temperature-corrected resistivity (Q6 formula):", {
		baseResistivity: temperatureCoefficients.copperResistivityRef,
		tempCoeff: temperatureCoefficients.copperTempCoeff,
		operatingTemp: validTemperature,
		referenceTemp: temperatureCoefficients.referenceTemp,
		tempDelta: validTemperature - temperatureCoefficients.referenceTemp,
		tempCorrectedResistivity,
		excelFormula: "=E4*(1+N6*(P6-O6))",
	});

	// Calculate DC resistance per 1000 feet (H4 formula from Excel)
	const baseDCR = awgData.resistance;
	const tempAdjustedDCR =
		baseDCR *
		(1 +
			temperatureCoefficients.copperTempCoeff *
				(validTemperature - temperatureCoefficients.referenceTemp));

	console.log("🔋 DC Resistance calculations:", {
		baseDCR,
		tempAdjustedDCR,
		tempFactor:
			1 +
			temperatureCoefficients.copperTempCoeff *
				(validTemperature - temperatureCoefficients.referenceTemp),
	});

	// Apply packing factor for litz construction (H5 formula: (DCR/strand_count)*packing_factor/1000)
	const dcResistancePerFoot =
		((tempAdjustedDCR / validStrandCount) * validPackingFactor) / 1000;
	const dcResistance = dcResistancePerFoot * 1000; // per 1000 feet

	console.log("📐 Litz construction resistance:", {
		perStrandDCR: tempAdjustedDCR / validStrandCount,
		packingFactor: validPackingFactor,
		dcResistancePerFoot,
		dcResistance,
	});

	// Calculate equivalent solid AWG (find closest CMA match)
	const equivalentAWG = findEquivalentAWG(totalCMA);
	console.log("🔄 Equivalent AWG:", { totalCMA, equivalentAWG });

	// Calculate skin depth (δ = √(ρ/(π*μ*f))) - using provided frequency
	const skinDepth = Math.sqrt(
		tempCorrectedResistivity /
			(Math.PI * constants.PERMEABILITY_FREE_SPACE * validFrequency),
	);

	console.log("📏 Skin depth calculation:", {
		frequency: validFrequency,
		permeability: constants.PERMEABILITY_FREE_SPACE,
		denominator: Math.PI * constants.PERMEABILITY_FREE_SPACE * validFrequency,
		skinDepth,
		skinDepthMils: skinDepth * 1000,
	});

	// Calculate N1 Max (maximum strands within skin depth)
	const strandDiameter = awgData.diameter * 0.0254; // Convert inches to meters
	const strandRadius = strandDiameter / 2;
	const n1Max = Math.floor(4 * (skinDepth / strandRadius) ** 2);

	console.log("🎯 N1 Max calculation:", {
		strandDiameterInches: awgData.diameter,
		strandDiameterMeters: strandDiameter,
		strandRadius,
		skinDepth,
		skinDepthToRadiusRatio: skinDepth / strandRadius,
		n1Max,
	});

	const result = {
		totalCMA,
		dcResistance,
		dcResistancePerFoot,
		equivalentAWG,
		skinDepth: skinDepth * 1000, // convert to mm
		n1Max,
	};

	console.log("✅ Electrical properties result:", result);
	return result;
}

/**
 * Find equivalent solid AWG for given total CMA
 */
function findEquivalentAWG(totalCMA: number): string {
	let closestAWG = awgOptions[0];
	let minDifference = Math.abs(awgOptions[0].cma - totalCMA);

	for (const awg of awgOptions) {
		const difference = Math.abs(awg.cma - totalCMA);
		if (difference < minDifference) {
			minDifference = difference;
			closestAWG = awg;
		}
	}

	return closestAWG.value;
}

/**
 * Calculate insulation dimensions for all insulation types
 * Implements the diameter calculations from Cover Sheet rows 39-62 using Excel lookup tables
 */
export function calculateInsulationDimensions(
	strandCount: number,
	awgSize: number,
	insulationType: InsulationType,
	finalStrands: number,
): DimensionResults {
	const awgData = awgOptions.find((awg) => awg.value === awgSize.toString());
	if (!awgData) {
		throw new Error(`AWG size ${awgSize} not found`);
	}

	// Get construction info for proper packing factor calculation
	const construction = calculateLitzConstruction(strandCount, awgSize);
	const packingFactor = getPackingFactor(
		strandCount,
		construction.operations,
		construction.type,
	);

	console.log("📐 calculateInsulationDimensions:", {
		strandCount,
		awgSize,
		insulationType,
		finalStrands,
		packingFactor,
	});

	const strandDiameter = awgData.diameter;

	// Calculate bare wire dimensions (C39-C41 formulas)
	const bareDiameter = Math.sqrt(strandCount) * strandDiameter * packingFactor;
	const bare: DimensionSet = {
		min: bareDiameter,
		nom: bareDiameter,
		max: bareDiameter,
	};

	console.log("🔧 Bare wire dimensions:", bare);

	// Calculate insulated wire dimensions using Excel lookup tables
	const singleInsulated = calculateInsulatedBundleDimensions(
		bareDiameter,
		"SINGLE",
		awgSize,
	);

	const doubleInsulated = calculateInsulatedBundleDimensions(
		bareDiameter,
		"HEAVY",
		awgSize,
	);

	const tripleInsulated = calculateInsulatedBundleDimensions(
		bareDiameter,
		"TRIPLE",
		awgSize,
	);

	const result = {
		bare,
		singleInsulated,
		doubleInsulated,
		tripleInsulated,
	};

	console.log("✅ All insulation dimensions:", result);
	return result;
}

/**
 * Calculate insulated bundle dimensions using Excel lookup tables
 * This calculates the overall bundle diameter with insulation
 */
function calculateInsulatedBundleDimensions(
	bareBundleDiameter: number,
	insulationType: "SINGLE" | "HEAVY" | "TRIPLE" | "QUAD",
	awgSize: number,
): { min: number; nom: number; max: number } {
	console.log(
		`🔍 Calculating bundle dimensions for ${insulationType}, AWG ${awgSize}`,
	);

	// Get strand diameter from AWG data
	const awgData = awgOptions.find((awg) => awg.value === awgSize.toString());
	if (!awgData) {
		console.log(`❌ AWG ${awgSize} not found in awgData`);
		return {
			min: bareBundleDiameter,
			nom: bareBundleDiameter,
			max: bareBundleDiameter,
		};
	}

	const bareStrandDiameter = awgData.diameter;

	// Get insulated strand dimensions from lookup tables
	const strandDimensions = calculateInsulatedDimensionsWithLookup(
		bareStrandDiameter,
		insulationType,
		awgSize,
	);

	// Calculate the insulation wall thickness per strand
	const wallThickness = (strandDimensions.nom - bareStrandDiameter) / 2;

	// Apply the same wall thickness to the bundle
	const insulatedBundleDiameter = bareBundleDiameter + wallThickness * 2;

	// Calculate tolerances based on the strand data
	const minWallThickness = (strandDimensions.min - bareStrandDiameter) / 2;
	const maxWallThickness = (strandDimensions.max - bareStrandDiameter) / 2;

	console.log("✅ Bundle insulation calculation:", {
		bareBundle: bareBundleDiameter,
		bareStrand: bareStrandDiameter,
		strandWithInsulation: strandDimensions.nom,
		wallThickness,
		insulatedBundle: insulatedBundleDiameter,
	});

	return {
		min: bareBundleDiameter + minWallThickness * 2,
		nom: insulatedBundleDiameter,
		max: bareBundleDiameter + maxWallThickness * 2,
	};
}

/**
 * Calculate insulated dimensions using Excel lookup tables
 * Implements exact Excel INDEX/MATCH operations for wall thickness lookup
 */
function calculateInsulatedDimensionsWithLookup(
	bareStrandDiameter: number,
	insulationType: "SINGLE" | "HEAVY" | "TRIPLE" | "QUAD",
	awgSize: number,
): { min: number; nom: number; max: number } {
	console.log(
		`🔍 Looking up insulation data for ${insulationType}, AWG ${awgSize}`,
	);

	// Select the appropriate insulation table
	let insulationTable: typeof singleInsulationData;
	switch (insulationType) {
		case "SINGLE":
			insulationTable = singleInsulationData;
			break;
		case "HEAVY":
			insulationTable = heavyInsulationData;
			break;
		case "TRIPLE":
			insulationTable = tripleInsulationData;
			break;
		case "QUAD":
			insulationTable = quadInsulationData;
			break;
		default:
			console.log(`❌ Unknown insulation type: ${insulationType}`);
			return {
				min: bareStrandDiameter,
				nom: bareStrandDiameter,
				max: bareStrandDiameter,
			};
	}

	// Find the AWG entry in the table (Excel INDEX/MATCH equivalent)
	const insulationEntry = insulationTable.find(
		(entry) => entry.awg === awgSize,
	);

	if (insulationEntry) {
		console.log("✅ Found insulation data:", insulationEntry);
		return {
			min: insulationEntry.min,
			nom: insulationEntry.nom,
			max: insulationEntry.max,
		};
	}

	// Fallback for AWG sizes not in table
	console.log(
		`⚠️  AWG ${awgSize} not found in ${insulationType} table, using bare diameter`,
	);
	return {
		min: bareStrandDiameter,
		nom: bareStrandDiameter,
		max: bareStrandDiameter,
	};
}

/**
 * Calculate dimensions for insulated wire
 * Implements the Excel formulas for insulation wall thickness calculation (E73, E81, E89)
 */
function calculateInsulatedDimensions(
	bareDiameter: number,
	strandDiameter: number,
	insulationType: InsulationType,
	layers: number,
): DimensionSet {
	const insulationInfo = insulationTypes.find(
		(type) => type.value === insulationType,
	);
	if (!insulationInfo) {
		throw new Error(`Insulation type ${insulationType} not found`);
	}

	// Calculate wall thickness based on strand diameter (6% rule from Excel G73, G81, G89)
	const calculatedThickness = (strandDiameter * 0.06) / layers;
	const minRequiredThickness = insulationInfo.minThickness / layers;

	// Use the larger of calculated or minimum required thickness
	let wallThickness = Math.max(calculatedThickness, minRequiredThickness);

	// Round to nearest 0.0005" as per Excel logic (H73, H81, H89)
	const roundedThickness = Math.round(wallThickness / 0.0005) * 0.0005;
	wallThickness =
		roundedThickness < wallThickness
			? roundedThickness + 0.0005
			: roundedThickness;

	// Apply insulation-specific rules from Excel
	wallThickness = applyInsulationRules(
		wallThickness,
		insulationType,
		strandDiameter,
		layers,
	);

	// Calculate final dimensions (C72-C74, C80-C82, C88-C90 formulas)
	const totalWallThickness = wallThickness * layers * 2; // Both sides
	const tolerance = bareDiameter > 0.1 ? 0.002 : 0.001;

	return {
		min: bareDiameter + totalWallThickness - tolerance,
		nom: bareDiameter + totalWallThickness,
		max:
			bareDiameter + totalWallThickness + tolerance * (layers === 3 ? 1.5 : 1),
	};
}

/**
 * Apply insulation-specific thickness rules from Excel (E73, E81, E89 formulas)
 */
function applyInsulationRules(
	thickness: number,
	insulationType: InsulationType,
	strandDiameter: number,
	layers: number,
): number {
	const totalCMA = (strandDiameter * 1000) ** 2; // Convert to CMA (D9 formula)

	switch (insulationType) {
		case "ETFE":
		case "PFA":
			return Math.max(thickness, 0.0015);

		case "FEP":
			// Complex FEP rules from Excel formulas
			if (totalCMA < 1939) return Math.max(thickness, 0.002);
			if (totalCMA < 12405) return Math.max(thickness, 0.003);
			if (totalCMA < 24978)
				return Math.max(thickness, layers === 1 ? 0.01 : 0.005);
			return Math.max(thickness, layers === 1 ? 0.012 : 0.006);

		case "TCA1":
			return Math.max(thickness, 0.002);

		case "TCA2":
			return Math.max(thickness, 0.003);

		case "TCA3":
			return Math.max(thickness, 0.004);

		default:
			return thickness;
	}
}

/**
 * Generate Rubadue part number
 * Implements the part number format from Excel formulas (B42, B49, B56, B63)
 */
export function generatePartNumber(
	strandCount: number,
	awgSize: string,
	layerType: InsulationLayerType,
	magnetWireGrade: MagnetWireGrade,
): string {
	const gradeInfo = magnetWireGrades.find(
		(grade) => grade.value === magnetWireGrade,
	);
	const gradeCode = gradeInfo?.code || "80";

	const typeCode = getTypeCode(layerType);
	const suffix = getSuffix(layerType);

	return `RL-${strandCount}-${awgSize}${typeCode}${gradeCode}-${suffix}`;
}

/**
 * Get type code for part number
 */
function getTypeCode(layerType: InsulationLayerType): string {
	switch (layerType) {
		case "BARE":
			return "";
		case "SINGLE":
			return "S";
		case "DOUBLE":
			return "H"; // Heavy build
		case "TRIPLE":
			return "T";
		case "QUAD":
			return "Q";
		default:
			return "";
	}
}

/**
 * Get suffix for part number
 */
function getSuffix(layerType: InsulationLayerType): string {
	switch (layerType) {
		case "BARE":
			return "XX";
		case "SINGLE":
			return "SN-XX";
		case "DOUBLE":
			return "DN-XX";
		case "TRIPLE":
			return "TN-XX";
		case "QUAD":
			return "QN-XX";
		default:
			return "XX";
	}
}

/**
 * Validate construction and generate warnings
 * Implements all warning logic from Excel (B1, B11, B34, G67, G68, etc.)
 */
export function validateConstruction(
	strandCount: number,
	awgSize: number,
	insulationType: InsulationType,
): { warnings: string[]; ulCompliant: boolean } {
	const warnings: string[] = [];
	let ulCompliant = true;

	const totalCMA =
		awgOptions.find((awg) => awg.value === awgSize.toString())?.cma || 0;
	const strandCMA = totalCMA * strandCount;

	// Check for construction warnings from Excel (B1, B11 formulas)
	if (strandCMA > 4807 && strandCount === 1 && awgSize > 8) {
		warnings.push(
			"CONSULT RUBADUE ENGINEERING WITH RESPECT TO THIS CONSTRUCTION.",
		);
	}

	// AWG size warnings (B34 formula)
	if (awgSize > 49) {
		warnings.push(
			"FOR STRAND SIZES SMALLER THAN 48 AWG, PLEASE CONFIRM FINAL CONSTRUCTION WITH RUBADUE ENGINEERING.",
		);
	}

	if (awgSize < 23 && strandCount > 8) {
		warnings.push("CONSULT RUBADUE ENGINEERING.");
	}

	// Check UL compliance (G67, G68 formulas)
	const construction = calculateLitzConstruction(strandCount, awgSize);
	const dimensions = calculateInsulationDimensions(
		strandCount,
		awgSize,
		insulationType,
		construction.finalStrands,
	);

	// UL diameter limit check (G67 formula)
	if (dimensions.singleInsulated.nom > constants.MAX_UL_DIAMETER) {
		ulCompliant = false;
		warnings.push(
			"THIS PRODUCT WILL NOT CARRY ANY UL APPROVALS. CONDUCTOR DIAMETER EXCEEDS UL MAXIMUM OF 0.200 inches / 5mm.",
		);
	}

	// Insulation-specific UL warnings (G68, G74, G75, etc.)
	const insulationInfo = insulationTypes.find(
		(type) => type.value === insulationType,
	);
	if (!insulationInfo?.ulApproved) {
		ulCompliant = false;
		warnings.push("THIS INSULATION TYPE WILL NOT CARRY UL APPROVALS.");
	}

	// FEP-specific warnings (G68 formula)
	if (insulationType !== "FEP" && strandCMA > 12404) {
		warnings.push(
			"SELECT FEP INSULATION IF UL APPROVALS ARE DESIRED/NECESSARY.",
		);
	}

	// Manufacturing capability warnings (G74, G82, G90 formulas)
	if (strandCMA < 9.61) {
		warnings.push(
			"CONSULT RUBADUE ENGINEERING TO VERIFY MANUFACTURING CAPABILITY.",
		);
	}

	// Wall thickness manufacturing warnings
	if (insulationType === "ETFE" && strandCMA > 769) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR SUPPLEMENTAL/REINFORCED INSULATION.",
		);
	}

	// Construction validity check
	if (!construction.isValid) {
		ulCompliant = false;
		warnings.push(
			"INVALID CONSTRUCTION: This construction exceeds manufacturing capabilities.",
		);
	}

	return { warnings, ulCompliant };
}

/**
 * Calculate N1 Max for given frequency
 * Implements N1 Max Calculator sheet formulas (E8, E9, E17)
 */
export function calculateN1Max(
	awgSize: number,
	frequency: number,
	temperature = 20,
): {
	skinDepth: number;
	skinDepthMils: number;
	strandDiameter: number;
	n1Max: number;
} {
	const awgData = awgOptions.find((awg) => awg.value === awgSize.toString());
	if (!awgData) {
		throw new Error(`AWG size ${awgSize} not found`);
	}

	// Temperature-corrected resistivity using Excel Q6 formula
	// Q6: =E4*(1+N6*(P6-O6))
	const resistivity =
		temperatureCoefficients.copperResistivityRef *
		(1 +
			temperatureCoefficients.copperTempCoeff *
				(temperature - temperatureCoefficients.referenceTemp));

	console.log("🌡️ N1Max temperature correction (Q6):", {
		referenceResistivity: temperatureCoefficients.copperResistivityRef,
		temperature,
		referenceTemp: temperatureCoefficients.referenceTemp,
		tempCoeff: temperatureCoefficients.copperTempCoeff,
		correctedResistivity: resistivity,
	});

	// Skin depth calculation (E8 formula: SQRT(resistivity/(PI*permeability*frequency)))
	const skinDepth = Math.sqrt(
		resistivity / (Math.PI * constants.PERMEABILITY_FREE_SPACE * frequency),
	);

	// Convert to mils (E9 formula: skin_depth * 1000)
	const skinDepthMils = skinDepth * 1000;

	// Strand diameter in meters (E16 formula)
	const strandDiameter = awgData.diameter * 0.0254; // Convert inches to meters

	// N1 Max calculation (E17 formula: 4 * (skin_depth^2 / strand_diameter^2))
	const n1Max = Math.floor(4 * (skinDepth / strandDiameter) ** 2);

	return {
		skinDepth: skinDepthMils,
		skinDepthMils,
		strandDiameter: awgData.diameter,
		n1Max,
	};
}

/**
 * Get maximum number of ends for AWG size
 * Uses actual MAXENDS table from Excel (Max Ends Single Op.csv)
 */
function getMaxEnds(awgSize: number): number {
	console.log(`🔍 Getting max ends for AWG ${awgSize}`);

	// Find the AWG entry in the real MAXENDS table
	const maxEndEntry = maxEndsTable.find((entry) => entry.awg === awgSize);

	if (maxEndEntry) {
		console.log(
			`✅ Found max ends from Excel table: ${maxEndEntry.maxStrands}`,
		);
		return maxEndEntry.maxStrands;
	}

	// Fallback for AWG sizes not in table
	if (awgSize <= 10) {
		console.log(
			`⚠️  AWG ${awgSize} too large for litz construction (0 strands)`,
		);
		return 0;
	}

	// Conservative fallback for very small wire sizes
	console.log(
		`⚠️  AWG ${awgSize} not in MAXENDS table, using conservative fallback`,
	);
	return 10;
}

/**
 * Get maximum operations for construction type
 */
function getMaxOperations(type: string): number {
	return type === "Type 1"
		? constructionLimits.TYPE1_MAX_OPERATIONS
		: constructionLimits.TYPE2_MAX_OPERATIONS;
}

/**
 * Get packing factor using Excel lookup tables (D7, D8 formulas)
 * Implements: IF(D6="Type 1",VLOOKUP(D5,TYPE1,4,0),VLOOKUP(D5,TYPE2,4,0))
 */
function getPackingFactor(
	strandCount: number,
	operations: number,
	litzType: LitzType,
): number {
	console.log("📦 getPackingFactor lookup:", {
		strandCount,
		operations,
		litzType,
	});

	// Select the appropriate lookup table based on construction type
	const lookupTable =
		litzType === "Type 1" ? type1ConstructionTable : type2ConstructionTable;

	// Find the entry for the number of operations (D5 in Excel)
	const entry = lookupTable.find((row) => row.operations === operations);

	if (!entry) {
		console.log("⚠️ No packing factor entry found, using default");
		// Fallback to simplified calculation if lookup fails
		if (strandCount <= 7) return 1.0;
		if (strandCount <= 19) return 1.1;
		if (strandCount <= 37) return 1.15;
		if (strandCount <= 61) return 1.2;
		if (strandCount <= 91) return 1.25;
		return 1.3;
	}

	// Excel D7 formula logic: IF(D6="Type 1",VLOOKUP(D5,TYPE1,4,0),IF(AND(D5=4,D6="TYPE 2",D4<44),1.363,VLOOKUP(D5,TYPE2,4,0)))
	// Special case for Type 2, 4 operations (1.363 factor)
	if (litzType === "Type 2" && operations === 4) {
		console.log("✅ Using special Type 2, 4-operation factor: 1.363");
		return 1.363;
	}

	// Use the standard packing factor from the lookup table (column 4 = packingFactor1)
	const packingFactor = entry.packingFactor1;
	console.log(`✅ Packing factor from ${litzType} table:`, packingFactor);

	return packingFactor;
}

/**
 * Validate construction limits based on AWG size and operations
 */
function validateConstructionLimits(
	strandCount: number | string,
	awgSize: number | string,
	operations: number,
	type: LitzType,
): boolean {
	// Convert and validate inputs
	const validStrandCount = Number(strandCount);
	const validAwgSize = Number(awgSize);

	if (Number.isNaN(validStrandCount) || Number.isNaN(validAwgSize)) {
		return false;
	}

	// AWG size-specific validation (from Excel formulas B32-M32)
	if (validAwgSize < 32) {
		const maxEnds = getMaxEnds(validAwgSize);
		return validStrandCount < maxEnds + 1;
	}
	if (validAwgSize < 47) {
		return validStrandCount < 67;
	}
	if (validAwgSize < 49) {
		return validStrandCount < 25;
	}
	// For AWG >= 49
	return validStrandCount >= 10 && validStrandCount <= 20;
}
