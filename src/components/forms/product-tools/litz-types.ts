import { z } from "zod";

/**
 * Insulation types available for litz wire
 */
export type InsulationType = "ETFE" | "FEP" | "PFA" | "TCA1" | "TCA2" | "TCA3";

/**
 * Litz construction types
 */
export type LitzType = "Type 1" | "Type 2";

/**
 * Magnet wire grade types
 */
export type MagnetWireGrade =
	| "MW80C"
	| "MW105C"
	| "MW130C"
	| "MW155C"
	| "MW180C"
	| "MW200C"
	| "MW220C";

/**
 * Insulation layer types
 */
export type InsulationLayerType =
	| "BARE"
	| "SINGLE"
	| "DOUBLE"
	| "TRIPLE"
	| "QUAD";

/**
 * Form values for the Litz Wire Calculator
 */
export interface LitzFormValues {
	strandCount: number;
	awgSize: string;
	insulationType: InsulationType;
	magnetWireGrade: MagnetWireGrade;
	temperature: number;
	frequency: number; // Hz for skin depth calculation
}

/**
 * Construction analysis results
 */
export interface ConstructionResults {
	type: LitzType;
	operations: number;
	finalStrands: number;
	isValid: boolean;
}

/**
 * Electrical properties
 */
export interface ElectricalResults {
	totalCMA: number;
	dcResistance: number;
	dcResistancePerFoot: number;
	equivalentAWG: string;
	skinDepth: number;
	n1Max: number;
	n1MaxCalculated: number;
	skinDepthMils: number;
}

/**
 * Dimension results for each insulation type
 */
export interface DimensionSet {
	min: number;
	nom: number;
	max: number;
}

/**
 * All dimension results
 */
export interface DimensionResults {
	bare: DimensionSet;
	singleInsulated: DimensionSet;
	doubleInsulated: DimensionSet;
	tripleInsulated: DimensionSet;
}

/**
 * Part number results
 */
export interface PartNumberResults {
	bare: string;
	singleInsulated: string;
	doubleInsulated: string;
	tripleInsulated: string;
}

/**
 * Complete calculation results
 */
export interface LitzCalculationResults {
	construction: ConstructionResults;
	electrical: ElectricalResults;
	dimensions: DimensionResults;
	partNumbers: PartNumberResults;
	warnings: string[];
	ulCompliant: boolean;
}

/**
 * AWG wire data
 */
export interface AWGData {
	value: string;
	diameter: number; // inches
	cma: number; // circular mils
	resistance: number; // ohms per 1000 ft at 20°C
}

/**
 * Insulation type definition
 */
export interface InsulationTypeInfo {
	value: InsulationType;
	label: string;
	description: string;
	minThickness: number; // inches
	ulApproved: boolean;
}

/**
 * Magnet wire grade definition
 */
export interface MagnetWireGradeInfo {
	value: MagnetWireGrade;
	label: string;
	tempRating: number; // °C
	code: string;
}

/**
 * Form validation schema with proper string-to-number transformation
 */
export const litzFormSchema = z.object({
	strandCount: z.preprocess(
		(val) => (typeof val === "string" ? Number.parseFloat(val) : val),
		z.number().min(1),
	),
	awgSize: z.string().min(1),
	insulationType: z.enum(["ETFE", "FEP", "PFA", "TCA1", "TCA2", "TCA3"]),
	magnetWireGrade: z.enum([
		"MW80C",
		"MW105C",
		"MW130C",
		"MW155C",
		"MW180C",
		"MW200C",
		"MW220C",
	]),
	temperature: z.preprocess(
		(val) => (typeof val === "string" ? Number(val) : val),
		z.number(),
	),
	frequency: z.preprocess(
		(val) => (typeof val === "string" ? Number(val) : val),
		z
			.number()
			.min(1), // Only require positive values
	),
});

/**
 * AWG size options with electrical properties
 */
export const awgOptions: AWGData[] = [
	{ value: "10", diameter: 0.1019, cma: 10380, resistance: 0.999 },
	{ value: "12", diameter: 0.0808, cma: 6530, resistance: 1.588 },
	{ value: "14", diameter: 0.0641, cma: 4107, resistance: 2.525 },
	{ value: "16", diameter: 0.0508, cma: 2583, resistance: 4.016 },
	{ value: "18", diameter: 0.0403, cma: 1624, resistance: 6.385 },
	{ value: "20", diameter: 0.032, cma: 1022, resistance: 10.15 },
	{ value: "22", diameter: 0.0253, cma: 640.4, resistance: 16.14 },
	{ value: "24", diameter: 0.0201, cma: 404.0, resistance: 25.67 },
	{ value: "26", diameter: 0.0159, cma: 254.1, resistance: 40.81 },
	{ value: "28", diameter: 0.0126, cma: 159.8, resistance: 64.9 },
	{ value: "30", diameter: 0.01, cma: 100.5, resistance: 103.2 },
	{ value: "32", diameter: 0.008, cma: 63.21, resistance: 164.1 },
	{ value: "34", diameter: 0.0063, cma: 39.75, resistance: 261.3 },
	{ value: "36", diameter: 0.005, cma: 25.0, resistance: 414.8 },
	{ value: "38", diameter: 0.004, cma: 15.72, resistance: 659.6 },
	{ value: "40", diameter: 0.0031, cma: 9.888, resistance: 1049 },
	{ value: "42", diameter: 0.0025, cma: 6.219, resistance: 1668 },
	{ value: "44", diameter: 0.002, cma: 3.911, resistance: 2653 },
	{ value: "46", diameter: 0.0016, cma: 2.461, resistance: 4217 },
	{ value: "48", diameter: 0.0012, cma: 1.549, resistance: 6700 },
	{ value: "50", diameter: 0.001, cma: 0.9753, resistance: 10650 },
];

/**
 * Insulation type definitions
 */
export const insulationTypes: InsulationTypeInfo[] = [
	{
		value: "ETFE",
		label: "ETFE",
		description: "Ethylene Tetrafluoroethylene",
		minThickness: 0.0015,
		ulApproved: true,
	},
	{
		value: "FEP",
		label: "FEP",
		description: "Fluorinated Ethylene Propylene",
		minThickness: 0.002,
		ulApproved: true,
	},
	{
		value: "PFA",
		label: "PFA",
		description: "Perfluoroalkoxy",
		minThickness: 0.0015,
		ulApproved: true,
	},
	{
		value: "TCA1",
		label: "TCA-1",
		description: "Single Build Heavy",
		minThickness: 0.002,
		ulApproved: false,
	},
	{
		value: "TCA2",
		label: "TCA-2",
		description: "Double Build Heavy",
		minThickness: 0.003,
		ulApproved: false,
	},
	{
		value: "TCA3",
		label: "TCA-3",
		description: "Triple Build Heavy",
		minThickness: 0.004,
		ulApproved: false,
	},
];

/**
 * Magnet wire grade definitions
 */
export const magnetWireGrades: MagnetWireGradeInfo[] = [
	{ value: "MW80C", label: "MW 80°C", tempRating: 80, code: "80" },
	{ value: "MW105C", label: "MW 105°C", tempRating: 105, code: "105" },
	{ value: "MW130C", label: "MW 130°C", tempRating: 130, code: "130" },
	{ value: "MW155C", label: "MW 155°C", tempRating: 155, code: "155" },
	{ value: "MW180C", label: "MW 180°C", tempRating: 180, code: "180" },
	{ value: "MW200C", label: "MW 200°C", tempRating: 200, code: "200" },
	{ value: "MW220C", label: "MW 220°C", tempRating: 220, code: "220" },
];

/**
 * Calculator information and descriptions
 */
export const calculatorInfo = {
	description:
		"Design and analyze litz wire constructions with automatic calculation of strand counts, insulation dimensions, and part numbers. Based on Rubadue Wire engineering specifications.",
	constructionNote:
		"Litz construction is determined by strand count and AWG size. Type 1 constructions use standard operations, while Type 2 allows more complex bundling.",
	insulationNote:
		"Insulation wall thickness is automatically calculated based on conductor diameter and material type, ensuring UL compliance where applicable.",
	partNumberNote:
		"Part numbers follow Rubadue Wire format: RL-[strands]-[AWG][type][grade]-[suffix]",
};

/**
 * Constants from the Excel formulas
 */
export const constants = {
	COPPER_RESISTIVITY: 1.72e-8, // Ω·m at 20°C
	COPPER_TEMP_COEFFICIENT: 0.00393, // per °C
	PERMEABILITY_FREE_SPACE: Math.PI * 4e-7, // H/m
	CMA_TO_SQUARE_MM: 0.000506707, // conversion factor
	INCHES_TO_MM: 25.4,
	MAX_UL_DIAMETER: 0.2, // inches
} as const;

/**
 * Lookup tables for construction validation (from actual Excel formulas B32-M32)
 */
export const constructionLimits = {
	TYPE1_MAX_OPERATIONS: 3,
	TYPE2_MAX_OPERATIONS: 5,
	MIN_STRANDS_LARGE_AWG: 10, // Excel: OR(B31<10,B31>20) for AWG >= 49
	MAX_STRANDS_LARGE_AWG: 20, // Excel: OR(B31<10,B31>20) for AWG >= 49
	MAX_STRANDS_MEDIUM_AWG: 67, // Excel: IF($D4<47,IF(B31<67,TRUE,FALSE)
	MAX_STRANDS_SMALL_AWG: 25, // Excel: IF($D4<49,IF(B31<25,TRUE,FALSE)
} as const;

/**
 * Temperature coefficient data from actual Excel N1 Max Calculator
 * Based on N1 Max Calculator.csv values: N6=0.00393, O6=20°C, P6=180°C
 */
export const temperatureCoefficients = {
	/** Reference temperature (°C) - O6 in Excel N1 Max Calculator */
	referenceTemp: 20,
	/** Operating temperature (°C) - P6 in Excel N1 Max Calculator */
	operatingTemp: 180,
	/** Temperature coefficient - N6 in Excel N1 Max Calculator */
	copperTempCoeff: 0.00393, // per °C
	/** Copper resistivity at reference temperature - 1.72e-8 from Excel */
	copperResistivityRef: 1.72e-8, // Ω·m at 20°C
} as const;

// Type 1 Construction Table (from Excel TYPE1 lookup) - Cover Sheet.csv data
export const type1ConstructionTable: ConstructionEntry[] = [
	{ operations: 1, packingFactor1: 1.155, packingFactor2: 1.01 }, // n/## from Cover Sheet
	{ operations: 2, packingFactor1: 1.155, packingFactor2: 1.01 }, // n/n/## from Cover Sheet
	{ operations: 3, packingFactor1: 1.155, packingFactor2: 1.01 }, // n/n/n/## from Cover Sheet
] as const;

// Type 2 Construction Table (from Excel TYPE2 lookup) - Cover Sheet.csv data
export const type2ConstructionTable: ConstructionEntry[] = [
	{ operations: 2, packingFactor1: 1.236, packingFactor2: 1.03 }, // 5xn/## or 3xn/##
	{ operations: 3, packingFactor1: 1.236, packingFactor2: 1.03 }, // 5xn/n/## or 3xn/n/##
	{ operations: 4, packingFactor1: 1.271, packingFactor2: 1.051 }, // 5x5xn/## for 50-44 AWG
	{ operations: 4, packingFactor1: 1.363, packingFactor2: 1.051 }, // 5x5xn/## for 43-33 AWG (special case)
	{ operations: 5, packingFactor1: 1.271, packingFactor2: 1.082 }, // 5x5x5xn/## for 50-44 AWG
	{ operations: 5, packingFactor1: 1.363, packingFactor2: 1.082 }, // 5x5x5xn/## for 43-33 AWG
] as const;

// Insulation data from actual Excel Magnet Wire table
export interface InsulationDataEntry {
	awg: number;
	min: number; // inches
	nom: number; // inches
	max: number; // inches
}

// Single insulation data (from Magnet Wire.csv SINGLE columns)
export const singleInsulationData: InsulationDataEntry[] = [
	{ awg: 12, min: 0.0814, nom: 0.0827, max: 0.084 },
	{ awg: 13, min: 0.0727, nom: 0.0739, max: 0.075 },
	{ awg: 14, min: 0.0651, nom: 0.0658, max: 0.0666 },
	{ awg: 15, min: 0.058, nom: 0.0587, max: 0.0594 },
	{ awg: 16, min: 0.0517, nom: 0.0524, max: 0.0531 },
	{ awg: 17, min: 0.0462, nom: 0.0468, max: 0.0475 },
	{ awg: 18, min: 0.0412, nom: 0.0418, max: 0.0424 },
	{ awg: 19, min: 0.0367, nom: 0.0373, max: 0.0379 },
	{ awg: 20, min: 0.0329, nom: 0.0334, max: 0.0339 },
	{ awg: 21, min: 0.0293, nom: 0.0298, max: 0.0303 },
	{ awg: 22, min: 0.0261, nom: 0.0266, max: 0.027 },
	{ awg: 23, min: 0.0234, nom: 0.0238, max: 0.0243 },
	{ awg: 24, min: 0.0209, nom: 0.0213, max: 0.0217 },
	{ awg: 25, min: 0.0186, nom: 0.019, max: 0.0194 },
	{ awg: 26, min: 0.0166, nom: 0.017, max: 0.0173 },
	{ awg: 27, min: 0.0149, nom: 0.0153, max: 0.0156 },
	{ awg: 28, min: 0.0133, nom: 0.0137, max: 0.014 },
	{ awg: 29, min: 0.0119, nom: 0.0123, max: 0.0126 },
	{ awg: 30, min: 0.0106, nom: 0.0109, max: 0.0112 },
	{ awg: 31, min: 0.0094, nom: 0.0097, max: 0.01 },
	{ awg: 32, min: 0.0085, nom: 0.0088, max: 0.0091 },
	{ awg: 33, min: 0.0075, nom: 0.0078, max: 0.0081 },
	{ awg: 34, min: 0.0067, nom: 0.007, max: 0.0072 },
	{ awg: 35, min: 0.0059, nom: 0.0062, max: 0.0064 },
	{ awg: 36, min: 0.0053, nom: 0.0056, max: 0.0058 },
	{ awg: 37, min: 0.0047, nom: 0.005, max: 0.0052 },
	{ awg: 38, min: 0.0042, nom: 0.0045, max: 0.0047 },
	{ awg: 39, min: 0.0036, nom: 0.0039, max: 0.0041 },
	{ awg: 40, min: 0.0032, nom: 0.0035, max: 0.0037 },
	{ awg: 41, min: 0.0029, nom: 0.0031, max: 0.0033 },
	{ awg: 42, min: 0.0026, nom: 0.0028, max: 0.003 },
	{ awg: 43, min: 0.0023, nom: 0.0025, max: 0.0026 },
	{ awg: 44, min: 0.0021, nom: 0.0023, max: 0.0024 },
	{ awg: 45, min: 0.00179, nom: 0.00192, max: 0.00205 },
	{ awg: 46, min: 0.00161, nom: 0.00173, max: 0.00185 },
	{ awg: 47, min: 0.00145, nom: 0.00157, max: 0.0017 },
	{ awg: 48, min: 0.00129, nom: 0.0014, max: 0.0015 },
	{ awg: 49, min: 0.00117, nom: 0.00124, max: 0.0013 },
	{ awg: 50, min: 0.00105, nom: 0.00113, max: 0.0012 },
] as const;

// Heavy insulation data (from Magnet Wire.csv HEAVY columns)
export const heavyInsulationData: InsulationDataEntry[] = [
	{ awg: 12, min: 0.0829, nom: 0.0837, max: 0.0847 },
	{ awg: 13, min: 0.0741, nom: 0.0749, max: 0.0757 },
	{ awg: 14, min: 0.0667, nom: 0.0675, max: 0.0682 },
	{ awg: 15, min: 0.0595, nom: 0.0602, max: 0.0609 },
	{ awg: 16, min: 0.0532, nom: 0.0539, max: 0.0545 },
	{ awg: 17, min: 0.0476, nom: 0.0482, max: 0.0488 },
	{ awg: 18, min: 0.0425, nom: 0.0431, max: 0.0437 },
	{ awg: 19, min: 0.038, nom: 0.0386, max: 0.0391 },
	{ awg: 20, min: 0.034, nom: 0.0346, max: 0.0351 },
	{ awg: 21, min: 0.0304, nom: 0.0309, max: 0.0314 },
	{ awg: 22, min: 0.0271, nom: 0.0276, max: 0.0281 },
	{ awg: 23, min: 0.0244, nom: 0.0249, max: 0.0253 },
	{ awg: 24, min: 0.0218, nom: 0.0223, max: 0.0227 },
	{ awg: 25, min: 0.0195, nom: 0.0199, max: 0.0203 },
	{ awg: 26, min: 0.0174, nom: 0.0178, max: 0.0182 },
	{ awg: 27, min: 0.0157, nom: 0.0161, max: 0.0164 },
	{ awg: 28, min: 0.0141, nom: 0.0144, max: 0.0147 },
	{ awg: 29, min: 0.0127, nom: 0.013, max: 0.0133 },
	{ awg: 30, min: 0.0113, nom: 0.0116, max: 0.0119 },
	{ awg: 31, min: 0.0101, nom: 0.0105, max: 0.0108 },
	{ awg: 32, min: 0.0091, nom: 0.0095, max: 0.0098 },
	{ awg: 33, min: 0.0081, nom: 0.0085, max: 0.0088 },
	{ awg: 34, min: 0.0072, nom: 0.0075, max: 0.0078 },
	{ awg: 35, min: 0.0064, nom: 0.0067, max: 0.007 },
	{ awg: 36, min: 0.0057, nom: 0.006, max: 0.0063 },
	{ awg: 37, min: 0.0052, nom: 0.0055, max: 0.0057 },
	{ awg: 38, min: 0.0046, nom: 0.0049, max: 0.0051 },
	{ awg: 39, min: 0.004, nom: 0.0043, max: 0.0045 },
	{ awg: 40, min: 0.0036, nom: 0.0038, max: 0.004 },
	{ awg: 41, min: 0.0032, nom: 0.0034, max: 0.0036 },
	{ awg: 42, min: 0.0028, nom: 0.003, max: 0.0032 },
	{ awg: 43, min: 0.0025, nom: 0.0027, max: 0.0029 },
	{ awg: 44, min: 0.0023, nom: 0.0025, max: 0.0027 },
	{ awg: 45, min: 0.00199, nom: 0.00215, max: 0.0023 },
	{ awg: 46, min: 0.00181, nom: 0.00196, max: 0.0021 },
	{ awg: 47, min: 0.00165, nom: 0.00178, max: 0.0019 },
	{ awg: 48, min: 0.00139, nom: 0.00155, max: 0.0017 },
	{ awg: 49, min: 0.00127, nom: 0.00139, max: 0.0015 },
	{ awg: 50, min: 0.00115, nom: 0.00128, max: 0.0014 },
] as const;

// Triple insulation data (from Magnet Wire.csv TRIPLE columns)
export const tripleInsulationData: InsulationDataEntry[] = [
	{ awg: 14, min: 0.0683, nom: 0.0692, max: 0.07 },
	{ awg: 15, min: 0.061, nom: 0.0619, max: 0.0627 },
	{ awg: 16, min: 0.0546, nom: 0.0554, max: 0.0562 },
	{ awg: 17, min: 0.0489, nom: 0.0497, max: 0.0504 },
	{ awg: 18, min: 0.0438, nom: 0.0445, max: 0.0452 },
	{ awg: 19, min: 0.0392, nom: 0.0399, max: 0.0406 },
	{ awg: 20, min: 0.0352, nom: 0.0358, max: 0.0364 },
	{ awg: 21, min: 0.0315, nom: 0.0321, max: 0.0326 },
	{ awg: 22, min: 0.0282, nom: 0.0288, max: 0.0293 },
	{ awg: 23, min: 0.0254, nom: 0.0259, max: 0.0264 },
	{ awg: 24, min: 0.0228, nom: 0.0233, max: 0.0238 },
	{ awg: 25, min: 0.0204, nom: 0.0209, max: 0.0214 },
	{ awg: 26, min: 0.0183, nom: 0.0188, max: 0.0193 },
	{ awg: 27, min: 0.0165, nom: 0.0169, max: 0.0173 },
	{ awg: 28, min: 0.0148, nom: 0.0152, max: 0.0156 },
	{ awg: 29, min: 0.0134, nom: 0.0138, max: 0.0142 },
	{ awg: 30, min: 0.012, nom: 0.0124, max: 0.0128 },
	{ awg: 31, min: 0.0105, nom: 0.011, max: 0.0114 },
	{ awg: 32, min: 0.0095, nom: 0.0099, max: 0.0103 },
	{ awg: 33, min: 0.0084, nom: 0.0088, max: 0.0092 },
	{ awg: 34, min: 0.0075, nom: 0.0079, max: 0.0082 },
	{ awg: 35, min: 0.0067, nom: 0.0071, max: 0.0074 },
	{ awg: 36, min: 0.006, nom: 0.0064, max: 0.0067 },
	{ awg: 37, min: 0.0054, nom: 0.0057, max: 0.006 },
	{ awg: 38, min: 0.0048, nom: 0.0051, max: 0.0054 },
	{ awg: 39, min: 0.0042, nom: 0.0045, max: 0.0048 },
	{ awg: 40, min: 0.0038, nom: 0.0041, max: 0.0043 },
	{ awg: 41, min: 0.0034, nom: 0.0037, max: 0.0039 },
	{ awg: 42, min: 0.0031, nom: 0.0033, max: 0.0035 },
	{ awg: 43, min: 0.0027, nom: 0.003, max: 0.0032 },
	{ awg: 44, min: 0.0025, nom: 0.0027, max: 0.0029 },
] as const;

// Quad insulation data (from Magnet Wire.csv QUAD columns)
export const quadInsulationData: InsulationDataEntry[] = [
	{ awg: 14, min: 0.0684, nom: 0.07, max: 0.0715 },
	{ awg: 15, min: 0.0613, nom: 0.0628, max: 0.0644 },
	{ awg: 16, min: 0.0549, nom: 0.0563, max: 0.0577 },
	{ awg: 17, min: 0.0493, nom: 0.0506, max: 0.052 },
	{ awg: 18, min: 0.0443, nom: 0.0456, max: 0.0468 },
	{ awg: 19, min: 0.0397, nom: 0.041, max: 0.0422 },
	{ awg: 20, min: 0.0357, nom: 0.0368, max: 0.0379 },
	{ awg: 21, min: 0.0321, nom: 0.0332, max: 0.0342 },
	{ awg: 22, min: 0.0287, nom: 0.0298, max: 0.0308 },
	{ awg: 23, min: 0.026, nom: 0.027, max: 0.0279 },
	{ awg: 24, min: 0.0234, nom: 0.0243, max: 0.0252 },
	{ awg: 25, min: 0.0211, nom: 0.022, max: 0.0228 },
	{ awg: 26, min: 0.0189, nom: 0.0198, max: 0.0206 },
	{ awg: 27, min: 0.0171, nom: 0.0178, max: 0.0185 },
	{ awg: 28, min: 0.0154, nom: 0.016, max: 0.0166 },
	{ awg: 29, min: 0.014, nom: 0.0146, max: 0.0152 },
	{ awg: 30, min: 0.0126, nom: 0.0132, max: 0.0137 },
	{ awg: 31, min: 0.0114, nom: 0.0118, max: 0.0121 },
	{ awg: 32, min: 0.0103, nom: 0.0107, max: 0.011 },
	{ awg: 33, min: 0.0092, nom: 0.0096, max: 0.0099 },
	{ awg: 34, min: 0.0082, nom: 0.0085, max: 0.0088 },
	{ awg: 35, min: 0.0073, nom: 0.0076, max: 0.0079 },
	{ awg: 36, min: 0.0065, nom: 0.0068, max: 0.0071 },
	{ awg: 37, min: 0.006, nom: 0.0063, max: 0.0065 },
	{ awg: 38, min: 0.0053, nom: 0.0056, max: 0.0058 },
	{ awg: 39, min: 0.0046, nom: 0.0049, max: 0.0051 },
	{ awg: 40, min: 0.0042, nom: 0.0044, max: 0.0046 },
	{ awg: 41, min: 0.0037, nom: 0.0039, max: 0.0041 },
	{ awg: 42, min: 0.0032, nom: 0.0034, max: 0.0036 },
	{ awg: 43, min: 0.0029, nom: 0.0031, max: 0.0033 },
	{ awg: 44, min: 0.0027, nom: 0.0029, max: 0.0031 },
] as const;

// Construction lookup table entry (matches Excel TYPE1/TYPE2 tables)
export interface ConstructionEntry {
	operations: number;
	packingFactor1: number;
	packingFactor2: number;
}

// AWG data table entry (from Excel AWG Reference)
export interface AWGDataEntry {
	awg: number;
	nomDiameter: number; // inches
	nomCMA: number;
	resistance: number; // ohms per 1000 feet at 20°C
}

// MAXENDS table entry (from Excel Max Ends Single Op)
export interface MaxEndsEntry {
	awg: number;
	maxStrands: number;
}

// AWG data from actual Excel AWG Reference table
export const awgData: AWGDataEntry[] = [
	{ awg: 10, nomDiameter: 0.1019, nomCMA: 10380, resistance: 1.0 },
	{ awg: 11, nomDiameter: 0.0907, nomCMA: 8230, resistance: 1.3 },
	{ awg: 12, nomDiameter: 0.0808, nomCMA: 6530, resistance: 1.62 },
	{ awg: 13, nomDiameter: 0.072, nomCMA: 5180, resistance: 2.04 },
	{ awg: 14, nomDiameter: 0.0641, nomCMA: 4110, resistance: 2.57 },
	{ awg: 15, nomDiameter: 0.0571, nomCMA: 3260, resistance: 3.25 },
	{ awg: 16, nomDiameter: 0.0508, nomCMA: 2580, resistance: 4.1 },
	{ awg: 17, nomDiameter: 0.0453, nomCMA: 2050, resistance: 5.17 },
	{ awg: 18, nomDiameter: 0.0403, nomCMA: 1620, resistance: 6.51 },
	{ awg: 19, nomDiameter: 0.0359, nomCMA: 1290, resistance: 8.23 },
	{ awg: 20, nomDiameter: 0.032, nomCMA: 1020, resistance: 10.32 },
	{ awg: 21, nomDiameter: 0.0285, nomCMA: 812, resistance: 13.04 },
	{ awg: 22, nomDiameter: 0.0253, nomCMA: 640, resistance: 16.59 },
	{ awg: 23, nomDiameter: 0.0226, nomCMA: 511, resistance: 20.67 },
	{ awg: 24, nomDiameter: 0.0201, nomCMA: 404, resistance: 26.19 },
	{ awg: 25, nomDiameter: 0.0179, nomCMA: 320, resistance: 33.1 },
	{ awg: 26, nomDiameter: 0.0159, nomCMA: 253, resistance: 42.07 },
	{ awg: 27, nomDiameter: 0.0142, nomCMA: 202, resistance: 52.17 },
	{ awg: 28, nomDiameter: 0.0126, nomCMA: 159, resistance: 66.37 },
	{ awg: 29, nomDiameter: 0.0113, nomCMA: 128, resistance: 82.68 },
	{ awg: 30, nomDiameter: 0.01, nomCMA: 100, resistance: 105.82 },
	{ awg: 31, nomDiameter: 0.0089, nomCMA: 79.2, resistance: 133.92 },
	{ awg: 32, nomDiameter: 0.008, nomCMA: 64.0, resistance: 166.18 },
	{ awg: 33, nomDiameter: 0.0071, nomCMA: 50.4, resistance: 211.65 },
	{ awg: 34, nomDiameter: 0.0063, nomCMA: 39.7, resistance: 269.8 },
	{ awg: 35, nomDiameter: 0.0056, nomCMA: 31.4, resistance: 342.84 },
	{ awg: 36, nomDiameter: 0.005, nomCMA: 25.0, resistance: 431.95 },
	{ awg: 37, nomDiameter: 0.0045, nomCMA: 20.2, resistance: 535.69 },
	{ awg: 38, nomDiameter: 0.004, nomCMA: 16.0, resistance: 681.85 },
	{ awg: 39, nomDiameter: 0.0035, nomCMA: 12.25, resistance: 897.15 },
	{ awg: 40, nomDiameter: 0.0031, nomCMA: 9.61, resistance: 1152.33 },
	{ awg: 41, nomDiameter: 0.0028, nomCMA: 7.84, resistance: 1422.63 },
	{ awg: 42, nomDiameter: 0.0025, nomCMA: 6.25, resistance: 1800.52 },
	{ awg: 43, nomDiameter: 0.0022, nomCMA: 4.84, resistance: 2351.7 },
	{ awg: 44, nomDiameter: 0.002, nomCMA: 4.0, resistance: 2872.85 },
	{ awg: 45, nomDiameter: 0.00176, nomCMA: 3.1, resistance: 3616.0 },
	{ awg: 46, nomDiameter: 0.00157, nomCMA: 2.46, resistance: 4544.0 },
	{ awg: 47, nomDiameter: 0.0014, nomCMA: 1.96, resistance: 5714.0 },
	{ awg: 48, nomDiameter: 0.00124, nomCMA: 1.54, resistance: 7285.0 },
	{ awg: 49, nomDiameter: 0.00111, nomCMA: 1.23, resistance: 9090.0 },
	{ awg: 50, nomDiameter: 0.00099, nomCMA: 0.98, resistance: 11430.0 },
] as const;

// MAXENDS table from actual Excel (Max Ends Single Op.csv)
export const maxEndsTable: MaxEndsEntry[] = [
	{ awg: 10, maxStrands: 0 },
	{ awg: 11, maxStrands: 0 },
	{ awg: 12, maxStrands: 0 },
	{ awg: 13, maxStrands: 0 },
	{ awg: 14, maxStrands: 1 },
	{ awg: 15, maxStrands: 1 },
	{ awg: 16, maxStrands: 1 },
	{ awg: 17, maxStrands: 2 },
	{ awg: 18, maxStrands: 2 },
	{ awg: 19, maxStrands: 3 },
	{ awg: 20, maxStrands: 4 },
	{ awg: 21, maxStrands: 5 },
	{ awg: 22, maxStrands: 7 },
	{ awg: 23, maxStrands: 9 },
	{ awg: 24, maxStrands: 11 },
	{ awg: 25, maxStrands: 15 },
	{ awg: 26, maxStrands: 19 },
	{ awg: 27, maxStrands: 23 },
	{ awg: 28, maxStrands: 29 },
	{ awg: 29, maxStrands: 37 },
	{ awg: 30, maxStrands: 47 },
	{ awg: 31, maxStrands: 60 },
	{ awg: 32, maxStrands: 66 },
	{ awg: 33, maxStrands: 66 },
	{ awg: 34, maxStrands: 66 },
	{ awg: 35, maxStrands: 66 },
	{ awg: 36, maxStrands: 66 },
	{ awg: 37, maxStrands: 66 },
	{ awg: 38, maxStrands: 66 },
	{ awg: 39, maxStrands: 66 },
	{ awg: 40, maxStrands: 66 },
	{ awg: 41, maxStrands: 66 },
	{ awg: 42, maxStrands: 66 },
	{ awg: 43, maxStrands: 66 },
	{ awg: 44, maxStrands: 66 },
	{ awg: 45, maxStrands: 66 },
	{ awg: 46, maxStrands: 66 },
	{ awg: 47, maxStrands: 21 },
	{ awg: 48, maxStrands: 21 },
	{ awg: 49, maxStrands: 21 },
	{ awg: 50, maxStrands: 21 },
] as const;
