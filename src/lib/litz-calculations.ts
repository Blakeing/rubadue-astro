import Decimal from "decimal.js";

/**
 * Litz Wire Calculation Engine
 *
 * This module implements the mathematical formulas and validation rules for Litz wire design
 * based on Rubadue's manufacturing specifications and UL approval requirements.
 *
 * Key Calculation Areas:
 * - Strand count validation and hierarchical breakdown
 * - Copper area calculations (CMA and mm²)
 * - Packing factors and take-up factors for different Litz types
 * - Bare wire diameter calculations with film thickness
 * - Insulated wire diameter calculations with wall thickness
 * - UL approval validation for different insulation types
 *
 * All calculations are derived from Excel formulas in Rubadue's design tools.
 *
 * @fileoverview Comprehensive Litz wire calculation engine with UL validation
 * @author Rubadue Engineering
 * @version 1.0.0
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Complete Litz wire construction calculation result
 */
export interface LitzConstruction {
	/** Total number of strands in the construction */
	totalStrands: number;
	/** AWG size of individual strands */
	wireAWG: number;
	/** Type 1 (uniform) or Type 2 (varying) Litz construction */
	litzType: "Type 1" | "Type 2";
	/** Number of manufacturing operations required */
	numberOfOperations: number;
	/** Packing factor for diameter calculations */
	packingFactor: number;
	/** Take-up factor for manufacturing elongation/compression */
	takeUpFactor: number;
	/** Total copper area in circular mils */
	totalCopperAreaCMA: number;
	/** Total copper area in square millimeters */
	totalCopperAreaMM2: number;
	/** Equivalent AWG size as string (e.g., "14 AWG") */
	equivalentAWG: string;
	/** Whether the construction is manufacturable */
	isValid: boolean;
	/** Validation message explaining manufacturability */
	validationMessage: string;
}

/**
 * Result of strand count validation
 */
export interface StrandValidationResult {
	/** Whether the strand count is manufacturable */
	isValid: boolean;
	/** Hierarchical breakdown of strand counts per operation */
	breakdown: number[];
	/** Nearby valid strand counts for alternative suggestions */
	nearbyValid: number[];
	/** Human-readable validation message */
	message: string;
}

/**
 * Diameter calculation result with tolerances
 */
export interface DiameterResult {
	/** Minimum diameter in inches */
	min: number;
	/** Nominal diameter in inches */
	nom: number;
	/** Maximum diameter in inches */
	max: number;
	/** Generated part number */
	partNumber: string;
	/** Wall thickness in inches (for insulated wire) */
	wallThicknessInches: number | null;
	/** Wall thickness in millimeters (for insulated wire) */
	wallThicknessMm: number | null;
}

// =============================================================================
// REFERENCE DATA CONSTANTS
// =============================================================================

/**
 * AWG Reference Data
 *
 * Contains diameter, circular mil area (CMA), and stranded CMA values for each AWG size.
 * Stranded CMA accounts for the space between individual strands in a conductor.
 *
 * Source: AWG Reference_values.csv from Rubadue's design tools
 */
export const AWG_REFERENCE: Record<
	number,
	{ diameter: number; cma: number; strandedCMA: number }
> = {
	1: { diameter: 0.2893, cma: 83690, strandedCMA: 82016 },
	2: { diameter: 0.2576, cma: 66390, strandedCMA: 65033 },
	3: { diameter: 0.2294, cma: 52620, strandedCMA: 51568 },
	4: { diameter: 0.2043, cma: 41740, strandedCMA: 40905 },
	5: { diameter: 0.1819, cma: 33090, strandedCMA: 32428 },
	6: { diameter: 0.162, cma: 26240, strandedCMA: 25715 },
	7: { diameter: 0.1443, cma: 20820, strandedCMA: 20404 },
	8: { diameter: 0.1285, cma: 16510, strandedCMA: 16180 },
	9: { diameter: 0.1144, cma: 13090, strandedCMA: 12828 },
	10: { diameter: 0.1019, cma: 10380, strandedCMA: 10172 },
	11: { diameter: 0.0907, cma: 8230, strandedCMA: 8065 },
	12: { diameter: 0.0808, cma: 6530, strandedCMA: 6399 },
	13: { diameter: 0.072, cma: 5184, strandedCMA: 5076 },
	14: { diameter: 0.0641, cma: 4110, strandedCMA: 4028 },
	15: { diameter: 0.0571, cma: 3260, strandedCMA: 3195 },
	16: { diameter: 0.0508, cma: 2580, strandedCMA: 2528 },
	17: { diameter: 0.0453, cma: 2050, strandedCMA: 2009 },
	18: { diameter: 0.0403, cma: 1620, strandedCMA: 1588 },
	19: { diameter: 0.0359, cma: 1290, strandedCMA: 1264 },
	20: { diameter: 0.032, cma: 1024, strandedCMA: 1000 },
	21: { diameter: 0.0285, cma: 812, strandedCMA: 796 },
	22: { diameter: 0.0253, cma: 640, strandedCMA: 627 },
	23: { diameter: 0.0226, cma: 511, strandedCMA: 501 },
	24: { diameter: 0.0201, cma: 404, strandedCMA: 396 },
	25: { diameter: 0.0179, cma: 320, strandedCMA: 314 },
	26: { diameter: 0.0159, cma: 253, strandedCMA: 248 },
	27: { diameter: 0.0142, cma: 202, strandedCMA: 198 },
	28: { diameter: 0.0126, cma: 159, strandedCMA: 156 },
	29: { diameter: 0.0113, cma: 128, strandedCMA: 125 },
	30: { diameter: 0.01, cma: 100, strandedCMA: 98 },
	31: { diameter: 0.0089, cma: 79.2, strandedCMA: 77.6 },
	32: { diameter: 0.008, cma: 64, strandedCMA: 62.7 },
	33: { diameter: 0.0071, cma: 50.4, strandedCMA: 49.4 },
	34: { diameter: 0.0063, cma: 39.7, strandedCMA: 38.9 },
	35: { diameter: 0.0056, cma: 31.4, strandedCMA: 30.8 },
	36: { diameter: 0.005, cma: 25, strandedCMA: 24.5 },
	37: { diameter: 0.0045, cma: 20.2, strandedCMA: 19.8 },
	38: { diameter: 0.004, cma: 16, strandedCMA: 15.7 },
	39: { diameter: 0.0035, cma: 12.2, strandedCMA: 11.9 },
	40: { diameter: 0.0031, cma: 9.61, strandedCMA: 9.42 },
	41: { diameter: 0.0028, cma: 7.84, strandedCMA: 7.68 },
	42: { diameter: 0.0025, cma: 6.25, strandedCMA: 6.13 },
	43: { diameter: 0.0022, cma: 4.84, strandedCMA: 4.74 },
	44: { diameter: 0.002, cma: 4, strandedCMA: 3.92 },
	45: { diameter: 0.00176, cma: 3.1, strandedCMA: 3.04 },
	46: { diameter: 0.00157, cma: 2.46, strandedCMA: 2.41 },
	47: { diameter: 0.0014, cma: 1.96, strandedCMA: 1.92 },
	48: { diameter: 0.00124, cma: 1.54, strandedCMA: 1.51 },
	49: { diameter: 0.00111, cma: 1.23, strandedCMA: 1.21 },
	50: { diameter: 0.00099, cma: 0.98, strandedCMA: 0.96 },
};

/**
 * Manufacturing Constraints: Maximum Strands Per Single Operation
 *
 * Defines the maximum number of strands that can be processed in a single manufacturing operation
 * for each AWG size. These limits are based on Rubadue's manufacturing capabilities.
 *
 * Source: Max Ends Single Op_values.csv from Rubadue's design tools
 */
const MAX_STRANDS_SINGLE_OP: Record<number, number> = {
	10: 0,
	11: 0,
	12: 0,
	13: 0,
	14: 1,
	15: 1,
	16: 1,
	17: 2,
	18: 2,
	19: 3,
	20: 4,
	21: 5,
	22: 7,
	23: 9,
	24: 11,
	25: 15,
	26: 19,
	27: 23,
	28: 29,
	29: 37,
	30: 47,
	31: 60,
	32: 66,
	33: 66,
	34: 66,
	35: 66,
	36: 66,
	37: 66,
	38: 66,
	39: 66,
	40: 66,
	41: 66,
	42: 66,
	43: 66,
	44: 66,
	45: 66,
	46: 66,
	47: 21,
	48: 21,
	49: 21,
	50: 21,
};

/**
 * Magnet Wire Film Thicknesses
 *
 * Defines the minimum, nominal, and maximum film thicknesses for different magnet wire grades
 * (Single, Heavy, Triple, Quadruple) across all AWG sizes. These values are used to calculate
 * the overall diameter of Litz wire constructions.
 *
 * Source: Magnet Wire_values.csv from Rubadue's design tools
 */
export const MAGNET_WIRE_FILM_THICKNESSES: Record<
	number,
	{
		single: { min: number; nom: number; max: number };
		heavy: { min: number; nom: number; max: number };
		triple: { min: number; nom: number; max: number };
		quadruple: { min: number; nom: number; max: number };
	}
> = {
	12: {
		single: { min: 0.0814, nom: 0.0827, max: 0.084 },
		heavy: { min: 0.0829, nom: 0.0837, max: 0.0847 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
	13: {
		single: { min: 0.0727, nom: 0.0739, max: 0.075 },
		heavy: { min: 0.0741, nom: 0.0749, max: 0.0757 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
	14: {
		single: { min: 0.0651, nom: 0.0658, max: 0.0666 },
		heavy: { min: 0.0667, nom: 0.0675, max: 0.0682 },
		triple: { min: 0.0683, nom: 0.0692, max: 0.07 },
		quadruple: { min: 0.0684, nom: 0.07, max: 0.0715 },
	},
	15: {
		single: { min: 0.058, nom: 0.0587, max: 0.0594 },
		heavy: { min: 0.0595, nom: 0.0602, max: 0.0609 },
		triple: { min: 0.061, nom: 0.0619, max: 0.0627 },
		quadruple: { min: 0.0613, nom: 0.0628, max: 0.0644 },
	},
	16: {
		single: { min: 0.0517, nom: 0.0524, max: 0.0531 },
		heavy: { min: 0.0532, nom: 0.0539, max: 0.0545 },
		triple: { min: 0.0546, nom: 0.0554, max: 0.0562 },
		quadruple: { min: 0.0549, nom: 0.0563, max: 0.0577 },
	},
	17: {
		single: { min: 0.0462, nom: 0.0468, max: 0.0475 },
		heavy: { min: 0.0476, nom: 0.0482, max: 0.0488 },
		triple: { min: 0.0489, nom: 0.0497, max: 0.0504 },
		quadruple: { min: 0.0493, nom: 0.0506, max: 0.052 },
	},
	18: {
		single: { min: 0.0412, nom: 0.0418, max: 0.0424 },
		heavy: { min: 0.0425, nom: 0.0431, max: 0.0437 },
		triple: { min: 0.0438, nom: 0.0445, max: 0.0452 },
		quadruple: { min: 0.0443, nom: 0.0456, max: 0.0468 },
	},
	19: {
		single: { min: 0.0367, nom: 0.0373, max: 0.0379 },
		heavy: { min: 0.038, nom: 0.0386, max: 0.0391 },
		triple: { min: 0.0392, nom: 0.0399, max: 0.0406 },
		quadruple: { min: 0.0397, nom: 0.041, max: 0.0422 },
	},
	20: {
		single: { min: 0.0329, nom: 0.0334, max: 0.0339 },
		heavy: { min: 0.034, nom: 0.0346, max: 0.0351 },
		triple: { min: 0.0352, nom: 0.0358, max: 0.0364 },
		quadruple: { min: 0.0357, nom: 0.0368, max: 0.0379 },
	},
	21: {
		single: { min: 0.0293, nom: 0.0298, max: 0.0303 },
		heavy: { min: 0.0304, nom: 0.0309, max: 0.0314 },
		triple: { min: 0.0315, nom: 0.0321, max: 0.0326 },
		quadruple: { min: 0.0321, nom: 0.0332, max: 0.0342 },
	},
	22: {
		single: { min: 0.0261, nom: 0.0266, max: 0.027 },
		heavy: { min: 0.0271, nom: 0.0276, max: 0.0281 },
		triple: { min: 0.0282, nom: 0.0288, max: 0.0293 },
		quadruple: { min: 0.0287, nom: 0.0298, max: 0.0308 },
	},
	23: {
		single: { min: 0.0234, nom: 0.0238, max: 0.0243 },
		heavy: { min: 0.0244, nom: 0.0249, max: 0.0253 },
		triple: { min: 0.0254, nom: 0.0259, max: 0.0264 },
		quadruple: { min: 0.026, nom: 0.027, max: 0.0279 },
	},
	24: {
		single: { min: 0.0209, nom: 0.0213, max: 0.0217 },
		heavy: { min: 0.0218, nom: 0.0223, max: 0.0227 },
		triple: { min: 0.0228, nom: 0.0233, max: 0.0238 },
		quadruple: { min: 0.0234, nom: 0.0243, max: 0.0252 },
	},
	25: {
		single: { min: 0.0186, nom: 0.019, max: 0.0194 },
		heavy: { min: 0.0195, nom: 0.0199, max: 0.0203 },
		triple: { min: 0.0204, nom: 0.0209, max: 0.0214 },
		quadruple: { min: 0.0211, nom: 0.022, max: 0.0228 },
	},
	26: {
		single: { min: 0.0166, nom: 0.017, max: 0.0173 },
		heavy: { min: 0.0174, nom: 0.0178, max: 0.0182 },
		triple: { min: 0.0183, nom: 0.0188, max: 0.0193 },
		quadruple: { min: 0.0189, nom: 0.0198, max: 0.0206 },
	},
	27: {
		single: { min: 0.0149, nom: 0.0153, max: 0.0156 },
		heavy: { min: 0.0157, nom: 0.0161, max: 0.0164 },
		triple: { min: 0.0165, nom: 0.0169, max: 0.0173 },
		quadruple: { min: 0.0171, nom: 0.0178, max: 0.0185 },
	},
	28: {
		single: { min: 0.0133, nom: 0.0137, max: 0.014 },
		heavy: { min: 0.0141, nom: 0.0144, max: 0.0147 },
		triple: { min: 0.0148, nom: 0.0152, max: 0.0156 },
		quadruple: { min: 0.0154, nom: 0.016, max: 0.0166 },
	},
	29: {
		single: { min: 0.0119, nom: 0.0123, max: 0.0126 },
		heavy: { min: 0.0127, nom: 0.013, max: 0.0133 },
		triple: { min: 0.0134, nom: 0.0138, max: 0.0142 },
		quadruple: { min: 0.014, nom: 0.0146, max: 0.0152 },
	},
	30: {
		single: { min: 0.0106, nom: 0.0109, max: 0.0112 },
		heavy: { min: 0.0113, nom: 0.0116, max: 0.0119 },
		triple: { min: 0.012, nom: 0.0124, max: 0.0128 },
		quadruple: { min: 0.0126, nom: 0.0132, max: 0.0137 },
	},
	31: {
		single: { min: 0.0094, nom: 0.0097, max: 0.01 },
		heavy: { min: 0.0101, nom: 0.0105, max: 0.0108 },
		triple: { min: 0.0105, nom: 0.011, max: 0.0114 },
		quadruple: { min: 0.0114, nom: 0.0118, max: 0.0121 },
	},
	32: {
		single: { min: 0.0085, nom: 0.0088, max: 0.0091 },
		heavy: { min: 0.0091, nom: 0.0095, max: 0.0098 },
		triple: { min: 0.0095, nom: 0.0099, max: 0.0103 },
		quadruple: { min: 0.0103, nom: 0.0107, max: 0.011 },
	},
	33: {
		single: { min: 0.0075, nom: 0.0078, max: 0.0081 },
		heavy: { min: 0.0081, nom: 0.0085, max: 0.0088 },
		triple: { min: 0.0084, nom: 0.0088, max: 0.0092 },
		quadruple: { min: 0.0092, nom: 0.0096, max: 0.0099 },
	},
	34: {
		single: { min: 0.0067, nom: 0.007, max: 0.0072 },
		heavy: { min: 0.0072, nom: 0.0075, max: 0.0078 },
		triple: { min: 0.0075, nom: 0.0079, max: 0.0082 },
		quadruple: { min: 0.0082, nom: 0.0085, max: 0.0088 },
	},
	35: {
		single: { min: 0.0059, nom: 0.0062, max: 0.0064 },
		heavy: { min: 0.0064, nom: 0.0067, max: 0.007 },
		triple: { min: 0.0067, nom: 0.0071, max: 0.0074 },
		quadruple: { min: 0.0073, nom: 0.0076, max: 0.0079 },
	},
	36: {
		single: { min: 0.0053, nom: 0.0056, max: 0.0058 },
		heavy: { min: 0.0057, nom: 0.006, max: 0.0063 },
		triple: { min: 0.006, nom: 0.0064, max: 0.0067 },
		quadruple: { min: 0.0065, nom: 0.0068, max: 0.0071 },
	},
	37: {
		single: { min: 0.0047, nom: 0.005, max: 0.0052 },
		heavy: { min: 0.0052, nom: 0.0055, max: 0.0057 },
		triple: { min: 0.0054, nom: 0.0057, max: 0.006 },
		quadruple: { min: 0.006, nom: 0.0063, max: 0.0065 },
	},
	38: {
		single: { min: 0.0042, nom: 0.0045, max: 0.0047 },
		heavy: { min: 0.0046, nom: 0.0049, max: 0.0051 },
		triple: { min: 0.0048, nom: 0.0051, max: 0.0054 },
		quadruple: { min: 0.0053, nom: 0.0056, max: 0.0058 },
	},
	39: {
		single: { min: 0.0036, nom: 0.0039, max: 0.0041 },
		heavy: { min: 0.004, nom: 0.0043, max: 0.0045 },
		triple: { min: 0.0042, nom: 0.0045, max: 0.0048 },
		quadruple: { min: 0.0046, nom: 0.0049, max: 0.0051 },
	},
	40: {
		single: { min: 0.0032, nom: 0.0035, max: 0.0037 },
		heavy: { min: 0.0036, nom: 0.0038, max: 0.004 },
		triple: { min: 0.0038, nom: 0.0041, max: 0.0043 },
		quadruple: { min: 0.0042, nom: 0.0044, max: 0.0046 },
	},
	41: {
		single: { min: 0.0029, nom: 0.0031, max: 0.0033 },
		heavy: { min: 0.0032, nom: 0.0034, max: 0.0036 },
		triple: { min: 0.0034, nom: 0.0037, max: 0.0039 },
		quadruple: { min: 0.0037, nom: 0.0039, max: 0.0041 },
	},
	42: {
		single: { min: 0.0026, nom: 0.0028, max: 0.003 },
		heavy: { min: 0.0028, nom: 0.003, max: 0.0032 },
		triple: { min: 0.0031, nom: 0.0033, max: 0.0035 },
		quadruple: { min: 0.0032, nom: 0.0034, max: 0.0036 },
	},
	43: {
		single: { min: 0.0023, nom: 0.0025, max: 0.0026 },
		heavy: { min: 0.0025, nom: 0.0027, max: 0.0029 },
		triple: { min: 0.0027, nom: 0.003, max: 0.0032 },
		quadruple: { min: 0.0029, nom: 0.0031, max: 0.0033 },
	},
	44: {
		single: { min: 0.0021, nom: 0.0023, max: 0.0024 },
		heavy: { min: 0.0023, nom: 0.0025, max: 0.0027 },
		triple: { min: 0.0025, nom: 0.0027, max: 0.0029 },
		quadruple: { min: 0.0027, nom: 0.0029, max: 0.0031 },
	},
	45: {
		single: { min: 0.00179, nom: 0.00192, max: 0.00205 },
		heavy: { min: 0.00199, nom: 0.00215, max: 0.0023 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
	46: {
		single: { min: 0.00161, nom: 0.00173, max: 0.00185 },
		heavy: { min: 0.00181, nom: 0.00196, max: 0.0021 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
	47: {
		single: { min: 0.00145, nom: 0.00157, max: 0.0017 },
		heavy: { min: 0.00165, nom: 0.00178, max: 0.0019 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
	48: {
		single: { min: 0.00129, nom: 0.0014, max: 0.0015 },
		heavy: { min: 0.00139, nom: 0.00155, max: 0.0017 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
	49: {
		single: { min: 0.00117, nom: 0.00124, max: 0.0013 },
		heavy: { min: 0.00127, nom: 0.00139, max: 0.0015 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
	50: {
		single: { min: 0.00105, nom: 0.00113, max: 0.0012 },
		heavy: { min: 0.00115, nom: 0.00128, max: 0.0014 },
		triple: { min: 0, nom: 0, max: 0 },
		quadruple: { min: 0, nom: 0, max: 0 },
	},
};

/**
 * Packing Factors by Litz Type and Operations
 *
 * Packing factors account for the space efficiency of different Litz wire constructions.
 * Type 1 uses uniform packing across all operations, while Type 2 has varying factors
 * based on the number of manufacturing operations.
 *
 * Source: Excel formulas in Rubadue's design tools
 */
const PACKING_FACTORS: Record<"Type 1" | "Type 2", Record<number, number>> = {
	"Type 1": {
		1: 1.155,
		2: 1.155,
		3: 1.155,
		4: 1.155,
		5: 1.155,
	},
	"Type 2": {
		1: 1.155,
		2: 1.236,
		3: 1.236,
		4: 1.271,
		5: 1.363,
	},
};

/**
 * Take-Up Factors by Litz Type and Operations
 *
 * Take-up factors account for the elongation and compression that occurs during
 * the manufacturing process. These factors are applied to final diameter calculations.
 *
 * Source: Excel formulas in Rubadue's design tools
 */
const TAKE_UP_FACTORS: Record<"Type 1" | "Type 2", Record<number, number>> = {
	"Type 1": {
		1: 1.01,
		2: 1.01,
		3: 1.01,
		4: 1.051,
		5: 1.082,
	},
	"Type 2": {
		1: 1.01,
		2: 1.03,
		3: 1.03,
		4: 1.051,
		5: 1.082,
	},
};

/**
 * Magnet Wire Grade Mappings for Part Numbers
 *
 * Maps magnet wire grades to their corresponding codes used in part number generation.
 * Matches Excel VLOOKUP functionality.
 */
const MAGNET_WIRE_GRADE_MAPPING: Record<string, string> = {
	"MW 79-C": "79",
	"MW 80-C": "80",
	"MW 77-C": "77",
	"MW 35-C": "35",
	"MW 16-C": "16",
};

/**
 * Strand OD Reference Data
 *
 * Contains strand outer diameter reference values for insulated wire calculations.
 * Used for calculating bare Litz diameters before insulation is applied.
 */
export const STRAND_OD_REFERENCE: Record<
	number,
	{ min: number; nom: number; max: number }
> = {
	12: { min: 0.0814, nom: 0.0827, max: 0.084 },
	13: { min: 0.0727, nom: 0.0739, max: 0.075 },
	14: { min: 0.0651, nom: 0.0658, max: 0.0666 },
	15: { min: 0.058, nom: 0.0587, max: 0.0594 },
	16: { min: 0.0517, nom: 0.0524, max: 0.0531 },
	17: { min: 0.0462, nom: 0.0468, max: 0.0475 },
	18: { min: 0.0412, nom: 0.0418, max: 0.0424 },
	19: { min: 0.0367, nom: 0.0373, max: 0.0379 },
	20: { min: 0.0329, nom: 0.0334, max: 0.0339 },
	21: { min: 0.0293, nom: 0.0298, max: 0.0303 },
	22: { min: 0.0261, nom: 0.0266, max: 0.027 },
	23: { min: 0.0234, nom: 0.0238, max: 0.0243 },
	24: { min: 0.0209, nom: 0.0213, max: 0.0217 },
	25: { min: 0.0186, nom: 0.019, max: 0.0194 },
	26: { min: 0.0166, nom: 0.017, max: 0.0173 },
	27: { min: 0.0149, nom: 0.0153, max: 0.0156 },
	28: { min: 0.0133, nom: 0.0137, max: 0.014 },
	29: { min: 0.0119, nom: 0.0123, max: 0.0126 },
	30: { min: 0.0106, nom: 0.0109, max: 0.0112 },
	31: { min: 0.0094, nom: 0.0097, max: 0.01 },
	32: { min: 0.0085, nom: 0.0088, max: 0.0091 },
	33: { min: 0.0075, nom: 0.0078, max: 0.0081 },
	34: { min: 0.0067, nom: 0.007, max: 0.0072 },
	35: { min: 0.0059, nom: 0.0062, max: 0.0064 },
	36: { min: 0.0053, nom: 0.0056, max: 0.0058 },
	37: { min: 0.0047, nom: 0.005, max: 0.0052 },
	38: { min: 0.0042, nom: 0.0045, max: 0.0047 },
	39: { min: 0.0036, nom: 0.0039, max: 0.0041 },
	40: { min: 0.0032, nom: 0.0035, max: 0.0037 },
	41: { min: 0.0029, nom: 0.0031, max: 0.0033 },
	42: { min: 0.0026, nom: 0.0028, max: 0.003 },
	43: { min: 0.0023, nom: 0.0025, max: 0.0026 },
	44: { min: 0.0021, nom: 0.0023, max: 0.0024 },
	45: { min: 0.00179, nom: 0.00192, max: 0.00205 },
	46: { min: 0.00161, nom: 0.00173, max: 0.00185 },
	47: { min: 0.00145, nom: 0.00157, max: 0.0017 },
	48: { min: 0.00129, nom: 0.0014, max: 0.0015 },
	49: { min: 0.00117, nom: 0.00124, max: 0.0013 },
	50: { min: 0.00105, nom: 0.00113, max: 0.0012 },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Round to 3 Decimal Places
 *
 * Utility function to round numbers to 3 decimal places for diameter calculations.
 * This matches Excel's precision for diameter values.
 *
 * @param val - Value to round
 * @returns Rounded value to 3 decimal places
 */
function round3(val: number): number {
	return Math.round(val * 1000) / 1000;
}

/**
 * Excel MROUND Equivalent
 *
 * Rounds a value to the nearest multiple, equivalent to Excel's MROUND function.
 * Used for wall thickness calculations to match Excel precision.
 *
 * @param val - Value to round
 * @param multiple - Multiple to round to
 * @returns Rounded value to nearest multiple
 */
function mround(val: number, multiple: number): number {
	return Math.round(val / multiple) * multiple;
}

/**
 * Calculate Required Wall Thickness
 *
 * Determines the minimum required wall thickness for different insulation types based on
 * copper area and layer count. This implements UL approval requirements and manufacturing
 * constraints for each insulation material.
 *
 * Formula derived from Excel: =IF(OR(D68="ETFE",D68="PFA"),IF(H73<0.0015,0.0015,H73),...)
 *
 * @param insulationType - Type of insulation (ETFE, PFA, FEP)
 * @param copperAreaCMA - Total copper area in circular mils
 * @param inputWallThickness - Requested wall thickness in inches
 * @param layers - Number of insulation layers (1, 2, or 3)
 * @returns Minimum required wall thickness in inches
 */
export function calculateRequiredWallThickness(
	insulationType: string,
	copperAreaCMA: number,
	inputWallThickness: number,
	layers: 1 | 2 | 3,
): number {
	// Single insulation logic (E73)
	if (layers === 1) {
		if (insulationType === "ETFE" || insulationType === "PFA") {
			return Math.max(0.0015, inputWallThickness);
		}
		if (insulationType === "FEP") {
			if (copperAreaCMA < 1939 && inputWallThickness < 0.002) {
				return 0.002;
			}
			if (
				copperAreaCMA >= 1939 &&
				copperAreaCMA < 12405 &&
				inputWallThickness < 0.003
			) {
				return 0.003;
			}
			if (
				copperAreaCMA >= 12405 &&
				copperAreaCMA < 24978 &&
				inputWallThickness < 0.01
			) {
				return 0.01;
			}
			if (copperAreaCMA >= 24978 && inputWallThickness < 0.012) {
				return 0.012;
			}
			return inputWallThickness;
		}
	}

	// Double insulation logic (E81)
	if (layers === 2) {
		if (insulationType === "ETFE") {
			return Math.max(0.001, inputWallThickness);
		}
		if (insulationType === "PFA") {
			return Math.max(0.0015, inputWallThickness);
		}
		if (insulationType === "FEP") {
			if (copperAreaCMA < 12828 && inputWallThickness < 0.002) {
				return 0.002;
			}
			if (
				copperAreaCMA >= 12828 &&
				copperAreaCMA < 24978 &&
				inputWallThickness < 0.005
			) {
				return 0.005;
			}
			if (copperAreaCMA >= 24978 && inputWallThickness < 0.006) {
				return 0.006;
			}
			return inputWallThickness;
		}
	}

	// Triple insulation logic (E89)
	if (layers === 3) {
		if (insulationType === "ETFE") {
			return Math.max(0.001, inputWallThickness);
		}
		if (insulationType === "PFA") {
			return Math.max(0.0015, inputWallThickness);
		}
		if (insulationType === "FEP") {
			if (copperAreaCMA < 12828 && inputWallThickness < 0.002) {
				return 0.002;
			}
			if (copperAreaCMA >= 12828 && inputWallThickness < 0.004) {
				return 0.004;
			}
			return inputWallThickness;
		}
	}

	return inputWallThickness;
}

// =============================================================================
// STRAND VALIDATION AND MANUFACTURING CONSTRAINTS
// =============================================================================

/** Minimum strands required for Litz wire construction */
const MIN_STRANDS = 3;

/** Maximum strands for special rule (AWG 12-22) */
const MAX_STRANDS_SPECIAL_RULE = 8;

/** Maximum operations supported in manufacturing */
const MAX_OPERATIONS = 5;

/** Division factors for hierarchical breakdown (in order of preference) */
const DIVISION_FACTORS = [5, 3, 4] as const;

/** Search range multiplier for finding nearby valid counts */
const NEARBY_SEARCH_MULTIPLIER = 0.05;

/** Minimum search range for nearby valid counts */
const MIN_SEARCH_RANGE = 50;

/** Maximum nearby valid counts to return */
const MAX_NEARBY_COUNTS = 8;

/**
 * Validate Strand Count with Hierarchical Breakdown
 *
 * Validates whether a given strand count can be manufactured for a specific AWG size.
 * Uses Rubadue's hierarchical manufacturing process where large strand counts are
 * progressively divided into smaller groups for final assembly.
 *
 * The validation checks:
 * 1. Minimum strand count (3 strands)
 * 2. Special rules for AWG 12-22 with 3-8 strands
 * 3. Hierarchical divisibility by 5, 3, or 4
 * 4. Maximum strands per single operation for the AWG size
 *
 * @param strandCount - Total number of strands
 * @param wireAWG - AWG size of individual strands
 * @returns Validation result with breakdown and nearby valid counts
 */
export function validateStrandCount(
	strandCount: number,
	wireAWG: number,
): StrandValidationResult {
	// Early validation
	if (strandCount < MIN_STRANDS) {
		return {
			isValid: false,
			breakdown: [],
			nearbyValid: [],
			message: `Minimum ${MIN_STRANDS} strands required for Litz wire construction`,
		};
	}

	// Special rule: For AWG 12-22, 3-8 strands are always valid
	if (
		wireAWG >= 12 &&
		wireAWG <= 22 &&
		strandCount >= MIN_STRANDS &&
		strandCount <= MAX_STRANDS_SPECIAL_RULE
	) {
		return {
			isValid: true,
			breakdown: [strandCount],
			nearbyValid: [strandCount],
			message: `Valid: ${strandCount} strands for AWG ${wireAWG} (special rule for 3-8 strands)`,
		};
	}

	// Get max strands for this AWG
	const maxStrands = getMaxStrandsForAWG(wireAWG);
	const hierarchicalLevels: number[] = [];
	let currentCount = strandCount;

	// Build hierarchical breakdown (like Excel's Row 14 → Row 18 → Row 22 → Row 26 → Row 30)
	hierarchicalLevels.push(currentCount);

	while (currentCount > maxStrands) {
		let divided = false;

		// Try dividing by 5, 3, or 4 in that order
		for (const factor of DIVISION_FACTORS) {
			if (currentCount % factor === 0) {
				currentCount = currentCount / factor;
				divided = true;
				break;
			}
		}

		if (!divided) {
			// Cannot divide further - invalid
			const nearbyValid = findNearbyValidCounts(strandCount, wireAWG);
			return {
				isValid: false,
				breakdown: hierarchicalLevels,
				nearbyValid,
				message: `This strand count isn't manufacturable with AWG ${wireAWG} wire.`,
			};
		}

		hierarchicalLevels.push(currentCount);
	}

	// Calculate operations count using Excel's hierarchical method
	const operationsCount = calculateOperationsExcelWay(strandCount, wireAWG);

	// Build improved message
	const levelProgression = hierarchicalLevels.join("→");
	const finalStrands = hierarchicalLevels[hierarchicalLevels.length - 1];

	let message: string;
	if (operationsCount === 1) {
		message = `Valid: ${strandCount} strands (1 operation, ≤${maxStrands} strands allowed for AWG ${wireAWG})`;
	} else {
		message = `Valid: ${strandCount} strands requires ${operationsCount} operations: ${levelProgression} strands (final manufacturing operation uses ${finalStrands} strands)`;
	}

	// Get nearby valid counts
	const nearbyValid = findNearbyValidCounts(strandCount, wireAWG);

	return {
		isValid: true,
		breakdown: hierarchicalLevels,
		nearbyValid,
		message,
	};
}

/**
 * Get Maximum Strands Allowed for AWG Size
 *
 * Returns the maximum number of strands that can be processed in a single
 * manufacturing operation for a given AWG size.
 *
 * @param awg - AWG size
 * @returns Maximum strands per single operation
 */
function getMaxStrandsForAWG(awg: number): number {
	return MAX_STRANDS_SINGLE_OP[awg] || 0;
}

/**
 * Find Nearby Valid Strand Counts
 *
 * Searches for valid strand counts near the target value that can be manufactured
 * for the given AWG size. This helps users find alternative valid configurations.
 *
 * @param target - Target strand count
 * @param awg - AWG size
 * @returns Array of nearby valid strand counts
 */
function findNearbyValidCounts(target: number, awg: number): number[] {
	const valid: number[] = [];
	const maxStrands = getMaxStrandsForAWG(awg);

	// Expand search range significantly to catch values like 1980 and 2025 when target is 2000
	const searchRange = Math.max(
		MIN_SEARCH_RANGE,
		Math.floor(target * NEARBY_SEARCH_MULTIPLIER),
	);
	const minSearch = Math.max(MIN_STRANDS, target - searchRange);
	const maxSearch = target + searchRange;

	// First, check multiples of 5 around the target (since division starts with 5)
	// This helps find the systematic valid values that Excel shows
	for (let i = Math.floor(minSearch / 5) * 5; i <= maxSearch; i += 5) {
		if (i >= MIN_STRANDS) {
			// Ensure minimum of 3 strands
			const isValid = validateStrandCountSimple(i, awg, maxStrands);
			if (isValid) {
				valid.push(i);
			}
		}
	}

	// Then check other values to fill gaps, but with a smaller range
	const smallerRange = Math.min(25, searchRange);
	for (
		let i = Math.max(MIN_STRANDS, target - smallerRange);
		i <= target + smallerRange;
		i++
	) {
		if (i % 5 !== 0) {
			// Skip multiples of 5 as we already checked them
			const isValid = validateStrandCountSimple(i, awg, maxStrands);
			if (isValid && !valid.includes(i)) {
				valid.push(i);
			}
		}
	}

	// Sort by distance from target and return closest ones
	valid.sort((a, b) => Math.abs(a - target) - Math.abs(b - target));

	return valid.slice(0, MAX_NEARBY_COUNTS);
}

/**
 * Simplified Strand Validation Without Recursion
 *
 * Performs basic strand validation without building the full hierarchical breakdown.
 * Used for finding nearby valid counts efficiently.
 *
 * @param strandCount - Number of strands to validate
 * @param wireAWG - AWG size
 * @param maxStrands - Maximum strands allowed for this AWG
 * @returns Whether the strand count is valid
 */
function validateStrandCountSimple(
	strandCount: number,
	wireAWG: number,
	maxStrands: number,
): boolean {
	// Special rule: For AWG 12-22, 3-8 strands are always valid
	if (
		wireAWG >= 12 &&
		wireAWG <= 22 &&
		strandCount >= MIN_STRANDS &&
		strandCount <= MAX_STRANDS_SPECIAL_RULE
	) {
		return true;
	}

	let currentCount = strandCount;

	while (currentCount > maxStrands) {
		let divided = false;

		// Try dividing by 5, 3, or 4 in that order
		for (const factor of DIVISION_FACTORS) {
			if (currentCount % factor === 0) {
				currentCount = currentCount / factor;
				divided = true;
				break;
			}
		}

		if (!divided) {
			break;
		}
	}

	// Enforce both maximum and minimum requirements
	return currentCount <= maxStrands && currentCount >= MIN_STRANDS;
}

// =============================================================================
// PACKING FACTORS AND TAKE-UP FACTORS
// =============================================================================

/**
 * Calculate Packing Factor
 *
 * Determines the packing factor based on Litz type and number of operations.
 * Packing factors account for the space efficiency of different Litz wire constructions.
 *
 * Formula: IF(D6="Type 1",VLOOKUP(D5,TYPE1,4,0),VLOOKUP(D5,TYPE2,4,0))
 *
 * @param litzType - Type 1 or Type 2 Litz construction
 * @param operations - Number of manufacturing operations
 * @param wireAWG - AWG size (optional, used for special-case logic)
 * @returns Packing factor for diameter calculations
 */
export function calculatePackingFactor(
	litzType: "Type 1" | "Type 2",
	operations: number,
	wireAWG?: number,
): number {
	if (operations > MAX_OPERATIONS) {
		throw new Error(`Maximum ${MAX_OPERATIONS} operations supported`);
	}

	// Special-case override for Type 2, 4 operations, AWG < 44
	if (
		litzType === "Type 2" &&
		operations === 4 &&
		wireAWG !== undefined &&
		wireAWG < 44
	) {
		return 1.363;
	}

	return PACKING_FACTORS[litzType][operations] || 1.155;
}

/**
 * Calculate Take-Up Factor
 *
 * Determines the take-up factor based on Litz type and number of operations.
 * Take-up factors account for elongation and compression during manufacturing.
 *
 * Formula: IF(D6="Type 1",VLOOKUP(D5,TYPE1,5,0),VLOOKUP(D5,TYPE2,5,0))
 *
 * @param litzType - Type 1 or Type 2 Litz construction
 * @param operations - Number of manufacturing operations
 * @returns Take-up factor for diameter calculations
 */
export function calculateTakeUpFactor(
	litzType: "Type 1" | "Type 2",
	operations: number,
): number {
	return TAKE_UP_FACTORS[litzType][operations] || 1.01;
}

// =============================================================================
// COPPER AREA CALCULATIONS
// =============================================================================

/**
 * Calculate Total Copper Area in CMA
 *
 * Calculates the total circular mil area (CMA) for display purposes using the
 * diameter formula: (diameter × 1000)² × strand count.
 *
 * Formula: INDEX('Magnet Wire'!$A$3:$E$41,MATCH(D4,'Magnet Wire'!$A$3:$A$41,0),MATCH("CMA SOLID",'Magnet Wire'!$A$2:$E$2,0))*$D$3
 *
 * @param strandCount - Number of strands
 * @param wireAWG - AWG size of individual strands
 * @returns Total copper area in circular mils
 */
export function calculateTotalCopperAreaCMA(
	strandCount: number,
	wireAWG: number,
): number {
	const awgData = AWG_REFERENCE[wireAWG];
	if (!awgData) {
		throw new Error(`No CMA data available for AWG ${wireAWG}`);
	}

	// Calculate CMA using diameter formula like Excel: (diameter × 1000)²
	const calculatedCMA = (awgData.diameter * 1000) ** 2;
	return strandCount * calculatedCMA;
}

/**
 * Calculate Copper Area for Insulation Calculations
 *
 * Uses lookup table values (strandedCMA) for insulation rule calculations.
 * This accounts for the space between individual strands in the conductor.
 *
 * @param strandCount - Number of strands
 * @param wireAWG - AWG size of individual strands
 * @returns Copper area in circular mils for insulation calculations
 */
function calculateCopperAreaForInsulation(
	strandCount: number,
	wireAWG: number,
): number {
	const awgData = AWG_REFERENCE[wireAWG];
	if (!awgData) {
		throw new Error(`No CMA data available for AWG ${wireAWG}`);
	}

	// Use strandedCMA lookup table value for insulation calculations
	return strandCount * awgData.strandedCMA;
}

/**
 * Calculate Total Copper Area in mm²
 *
 * Converts circular mil area to square millimeters using the conversion factor.
 *
 * Formula: $D$9*0.000506707
 *
 * @param cma - Copper area in circular mils
 * @returns Copper area in square millimeters
 */
export function calculateTotalCopperAreaMM2(cma: number): number {
	return cma * 0.000506707;
}

/**
 * Calculate Equivalent AWG from Total Copper Area
 *
 * Determines the equivalent AWG size based on total copper area using lookup tables.
 * This provides a reference for comparing Litz wire to solid wire of equivalent capacity.
 *
 * Formula: IFERROR(IF((INDEX('AWG Reference'!$F$5:$H$64,MATCH(D9,'AWG Reference'!$H$5:$H$64,-1),1)+1)>50,"",(INDEX('AWG Reference'!$F$5:$H$64,MATCH(D9,'AWG Reference'!$H$5:$H$64,-1),1)+1)&" AWG"),"")
 *
 * @param cma - Total copper area in circular mils
 * @returns Equivalent AWG size as string (e.g., "14 AWG") or empty string if out of range
 */
export function calculateEquivalentAWG(cma: number): string {
	const awgEntries = Object.entries(AWG_REFERENCE)
		.map(([awg, data]) => ({ awg: Number(awg), cma: data.cma }))
		.sort((a, b) => b.cma - a.cma); // Descending order

	// If above largest, return ""
	if (cma > awgEntries[0].cma) return "";
	// If below smallest, return "50 AWG";
	if (cma < awgEntries[awgEntries.length - 1].cma) return "50 AWG";

	let foundIndex = -1;
	for (let i = 0; i < awgEntries.length; i++) {
		if (cma >= awgEntries[i].cma) {
			foundIndex = i;
			break;
		}
	}
	if (foundIndex === -1) return "";
	const foundAWG = awgEntries[foundIndex].awg;
	if (foundAWG > 50) return "";
	return `${foundAWG} AWG`;
}

// =============================================================================
// DIAMETER CALCULATIONS
// =============================================================================

/**
 * Calculate Bare Litz Wire Diameters
 *
 * Calculates the minimum, nominal, and maximum diameters for bare Litz wire
 * based on strand count, AWG size, packing factor, and magnet wire film type.
 *
 * Formula: ROUND(SQRT($D$3)*E39*$D$7,3)
 *
 * @param strandCount - Number of strands
 * @param wireAWG - AWG size of individual strands
 * @param packingFactor - Packing factor for the Litz construction
 * @param magnetWireGrade - Magnet wire grade (e.g., "MW 79-C")
 * @param filmType - Film thickness type (Single, Heavy, Triple, Quadruple)
 * @returns Diameter result with min/nom/max values and part number
 */
export function calculateBareLitzDiameters(
	strandCount: number,
	wireAWG: number,
	packingFactor: number,
	magnetWireGrade: string,
	filmType: "Single" | "Heavy" | "Triple" | "Quadruple",
): DiameterResult {
	const filmData = MAGNET_WIRE_FILM_THICKNESSES[wireAWG];
	if (!filmData) {
		throw new Error(`No film thickness data available for AWG ${wireAWG}`);
	}

	let filmThickness: { min: number; nom: number; max: number };
	switch (filmType) {
		case "Single":
			filmThickness = filmData.single;
			break;
		case "Heavy":
			filmThickness = filmData.heavy;
			break;
		case "Triple":
			filmThickness = filmData.triple;
			break;
		case "Quadruple":
			filmThickness = filmData.quadruple;
			break;
		default:
			throw new Error(`Unknown film type: ${filmType}`);
	}

	if (filmThickness.nom === 0) {
		throw new Error(`${filmType} film not available for AWG ${wireAWG}`);
	}

	const sqrtStrands = Math.sqrt(strandCount);
	const min = Number(
		(
			Math.round(sqrtStrands * filmThickness.min * packingFactor * 1000) / 1000
		).toFixed(3),
	);
	const nom = Number(
		(
			Math.round(sqrtStrands * filmThickness.nom * packingFactor * 1000) / 1000
		).toFixed(3),
	);
	const max = Number(
		(
			Math.round(sqrtStrands * filmThickness.max * packingFactor * 1000) / 1000
		).toFixed(3),
	);

	// Generate part number based on Excel formula: ="Rubadue Part Number:"&" RL-"&$D$3&"-"&$D$4&"Q"&VLOOKUP($D$36,MagGrade,2,0)&"-XX"
	const gradeCode = (magnetWireGrade.match(/\d+/) || ["XX"])[0];
	const filmCode =
		filmType === "Single"
			? "S"
			: filmType === "Heavy"
				? "H"
				: filmType === "Triple"
					? "T"
					: "Q";
	const partNumber = `RL-${strandCount}-${wireAWG}${filmCode}${gradeCode}-XX`;

	return {
		min,
		nom,
		max,
		partNumber,
		wallThicknessInches: null,
		wallThicknessMm: null,
	};
}

/**
 * Calculate Wall Thickness for Single Insulation
 *
 * Implements Excel's wall thickness logic for single insulation (G73).
 *
 * @param rawWall - Raw wall thickness value
 * @returns Calculated wall thickness
 */
function calculateWallThicknessSingle(rawWall: number): number {
	const rounded3 = Math.round(rawWall * 1000) / 1000;
	if (rounded3 < rawWall) {
		return rounded3 + 0.0005;
	}
	return mround(rawWall, 0.0005);
}

/**
 * Calculate Wall Thickness for Double Insulation
 *
 * Implements Excel's wall thickness logic for double insulation (G81).
 *
 * @param rawWall - Raw wall thickness value
 * @returns Calculated wall thickness
 */
function calculateWallThicknessDouble(rawWall: number): number {
	const halfWall = rawWall / 2;
	const rounded3 = Math.round(halfWall * 1000) / 1000;
	if (rounded3 < halfWall) {
		return rounded3 + 0.0005;
	}
	const mrounded = mround(halfWall, 0.0005);
	if (mrounded < halfWall) {
		return Math.round(halfWall * 1000) / 1000;
	}
	return mrounded;
}

/**
 * Calculate Wall Thickness for Triple Insulation
 *
 * Implements Excel's wall thickness logic for triple insulation (G89).
 *
 * @param rawWall - Raw wall thickness value
 * @returns Calculated wall thickness
 */
function calculateWallThicknessTriple(rawWall: number): number {
	const thirdWall = rawWall / 3;
	const rounded3 = Math.round(thirdWall * 1000) / 1000;
	if (rounded3 < thirdWall) {
		return rounded3 + 0.0005;
	}
	const mrounded = mround(thirdWall, 0.0005);
	if (mrounded < thirdWall) {
		return Math.round(thirdWall * 1000) / 1000;
	}
	return mrounded;
}

// =============================================================================
// WALL THICKNESS CALCULATIONS
// =============================================================================

export function calculateInsulatedLitzDiameters(
	wireAWG: number,
	insulationType: string,
	layers: 1 | 2 | 3,
	magnetWireGrade: string,
	strandCount?: number,
	packingFactor?: number,
): DiameterResult & {
	wallThicknessInches: number | null;
	wallThicknessMm: number | null;
} {
	// 1. Get strand OD reference (from Magnet Wire reference)
	const strandOD = STRAND_OD_REFERENCE[wireAWG];
	if (!strandOD) throw new Error(`No strand OD reference for AWG ${wireAWG}`);

	// 2. Use correct packing factor
	const pf = packingFactor ?? 1.155;

	const sqrtStrands = strandCount
		? new Decimal(strandCount).sqrt()
		: new Decimal(1);

	// 3. Calculate bare Litz ODs (NO rounding here, use Decimal)
	const bareOD_min_raw = sqrtStrands.mul(strandOD.min).mul(pf);
	const bareOD_nom_raw = sqrtStrands.mul(strandOD.nom).mul(pf);
	const bareOD_max_raw = sqrtStrands.mul(strandOD.max).mul(pf);

	// 4. Calculate wall thickness from nominal bare OD (always 6% like Excel)
	const rawWall = bareOD_nom_raw.mul(0.06);

	// 5. Apply Excel wall thickness logic (E73/E81/E89)
	const copperAreaCMA = calculateCopperAreaForInsulation(
		strandCount ?? 1,
		wireAWG,
	);

	// Calculate wall thickness using Excel logic
	let calculatedWall: number;
	if (layers === 1) {
		calculatedWall = calculateWallThicknessSingle(rawWall.toNumber());
	} else if (layers === 2) {
		calculatedWall = calculateWallThicknessDouble(rawWall.toNumber());
	} else {
		calculatedWall = calculateWallThicknessTriple(rawWall.toNumber());
	}

	const requiredWallThickness = calculateRequiredWallThickness(
		insulationType,
		copperAreaCMA,
		calculatedWall,
		layers,
	);
	const wallThicknessInches =
		requiredWallThickness >= 0.001 ? requiredWallThickness : null;
	const wallThicknessMm = wallThicknessInches
		? Math.round(wallThicknessInches * 25.4 * 1000) / 1000
		: null;

	// 6. Calculate min/nom/max OD using Excel logic with final rounding only
	let minDiameter: number;
	let nominalDiameter: number;
	let maxDiameter: number;

	if (layers === 3) {
		// Excel logic for triple insulation - uses triple film nominal OD for delta (C54) when available
		// Triple-insulated wires still use single-build enameled wires, but delta is based on triple film
		let tripleFilmNom: Decimal;

		try {
			// Try to use triple film for delta calculation (Excel C54 logic)
			const tripleFilmForDelta = calculateBareLitzDiameters(
				strandCount ?? 1,
				wireAWG,
				pf, // Use the actual packing factor, not hardcoded 1.155
				magnetWireGrade,
				"Triple", // Use Triple film for delta determination
			);
			tripleFilmNom = new Decimal(tripleFilmForDelta.nom);
		} catch (error) {
			// If triple film doesn't exist (e.g., AWG 45-50), use single film nominal instead
			// This aligns with email feedback: "Triple-insulated wires still use single-build enameled wires"
			tripleFilmNom = bareOD_nom_raw;
		}

		const delta = tripleFilmNom.gt(0.1) ? 0.002 : 0.001;
		const wall6 = new Decimal(2 * 3 * requiredWallThickness); // 6 * wall

		minDiameter = Number(
			bareOD_min_raw
				.plus(wall6)
				.minus(delta)
				.toDecimalPlaces(3, Decimal.ROUND_HALF_UP),
		);
		nominalDiameter = Number(
			bareOD_nom_raw.plus(wall6).toDecimalPlaces(3, Decimal.ROUND_HALF_UP),
		);
		maxDiameter = Number(
			bareOD_max_raw
				.plus(wall6)
				.plus(delta)
				.toDecimalPlaces(3, Decimal.ROUND_HALF_UP),
		);
	} else {
		// Single/double insulation logic - uses nominal bare OD for delta (Excel C40)
		const delta = bareOD_nom_raw.gt(0.1) ? 0.002 : 0.001;
		const wall = new Decimal(2 * layers * requiredWallThickness);
		minDiameter = Number(
			bareOD_min_raw
				.plus(wall)
				.minus(delta)
				.toDecimalPlaces(3, Decimal.ROUND_HALF_UP),
		);
		nominalDiameter = Number(
			bareOD_nom_raw.plus(wall).toDecimalPlaces(3, Decimal.ROUND_HALF_UP),
		);
		maxDiameter = Number(
			bareOD_max_raw
				.plus(wall)
				.plus(delta)
				.toDecimalPlaces(3, Decimal.ROUND_HALF_UP),
		);
	}

	// 7. Generate part number
	const gradeCode = MAGNET_WIRE_GRADE_MAPPING[magnetWireGrade] || "XX";
	const prefix = layers === 1 ? "SXXL" : layers === 2 ? "DXXL" : "TXXL";
	const insulationCode =
		insulationType === "ETFE" ? "T" : insulationType === "FEP" ? "F" : "P";
	const xSuffix = layers === 1 ? "X" : layers === 2 ? "XX" : "XXX";
	const wallThicknessMils = Math.round(requiredWallThickness * 1000);
	const partNumber = `${prefix}${strandCount || 1}/${wireAWG}${insulationCode}${xSuffix}-${wallThicknessMils}(MW${gradeCode})`;

	return {
		min: minDiameter,
		nom: nominalDiameter,
		max: maxDiameter,
		partNumber,
		wallThicknessInches,
		wallThicknessMm,
	};
}

// =============================================================================
// UL APPROVAL AND VALIDATION
// =============================================================================

/** Maximum conductor diameter for UL approval (inches) */
const MAX_CONDUCTOR_DIAMETER_INCHES = 0.2;

/** Minimum copper area for manufacturing capability checks */
const MIN_COPPER_AREA_CMA = 9.61;

/**
 * Message constants to eliminate repetition
 */
const VALIDATION_MESSAGES = {
	// Wall thickness messages
	INCREASE_WALL_THICKNESS_SINGLE:
		"INCREASE WALL THICKNESSES IF UL APPROVALS ARE REQUIRED. IF UL APPROVALS ARE NOT REQUIRED, CONSULT THE FACTORY TO CONFIRM MANUFACTURABILITY.",
	INCREASE_WALL_THICKNESS_DOUBLE:
		"INCREASE WALL THICKNESS IF UL APPROVAL IS REQUIRED.",

	// UL approval messages
	NO_UL_APPROVAL_ETFE_FEP:
		"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR REINFORCED INSULATION.",
	NO_UL_APPROVAL_ETFE:
		"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION.",
	NO_UL_APPROVAL_PFA_FEP:
		"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR REINFORCED INSULATION.",
	NO_UL_APPROVAL_ETFE_PFA_SUPPLEMENTAL:
		"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR SUPPLEMENTAL/REINFORCED INSULATION.",
	SELECT_FEP_FOR_UL:
		"SELECT FEP INSULATION IF UL APPROVALS ARE DESIRED/NECESSARY",

	// Manufacturing messages
	CONSULT_PLANT_MANUFACTURING:
		"CONSULT PLANT TO CONFIRM MANUFACTURING CAPABILITY. THIS PART WILL NOT CARRY UL APPROVALS.",
	CONDUCTOR_DIAMETER_EXCEEDS:
		"CONDUCTOR DIAMETER EXCEEDS UL MAXIMUM OF 0.200 inches / 5mm",
} as const;

/**
 * Check UL approval requirements for triple insulation (E89 logic)
 * Based on Excel formula: =IF(D9<9.61,"CONSULT PLANT TO CONFIRM MANUFACURING CAPABILITY. THIS PART WILL NOT CARRY UL APPROVALS.",IF(AND(D68="FEP",D9<12405,E89<0.002),"THIS PART WILL NOT CARRY UL APPROVALS. INCREASE INSULATION WALL THICKNESS TO AT LEAST 0.0020 INCHES.",IF(AND(D68="FEP",D9>12404,E89<0.004),"THIS PART WILL NOT CARRY UL APPROVALS. INCREASE INSULATION WALL THICKNESS TO AT LEAST 0.0040 INCHES.",IF(OR(AND(D68="ETFE",D9<1241,E89<0.0015),AND(D68="ETFE",D9>1240,D9<4900,E89<0.002),AND(D68="ETFE",D9>4899,D9<12405,E89<0.002),AND(OR(D68="PFA",D68="ETFE"),D9>12404)),"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION.",""))))
 */
function checkTripleInsulationULApproval(
	copperArea: number,
	insulationType: string,
	wallThickness: number,
): string[] {
	const warnings: string[] = [];

	// 1. Check very small copper area (D9 < 9.61)
	if (copperArea < 9.61) {
		warnings.push(
			"CONSULT PLANT TO CONFIRM MANUFACURING CAPABILITY. THIS PART WILL NOT CARRY UL APPROVALS.",
		);
		return warnings;
	}

	// 2. FEP with copper area < 12405 and wall thickness < 0.002
	if (insulationType === "FEP" && copperArea < 12405 && wallThickness < 0.002) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. INCREASE INSULATION WALL THICKNESS TO AT LEAST 0.0020 INCHES.",
		);
		return warnings;
	}

	// 3. FEP with copper area > 12404 and wall thickness < 0.004
	if (insulationType === "FEP" && copperArea > 12404 && wallThickness < 0.004) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. INCREASE INSULATION WALL THICKNESS TO AT LEAST 0.0040 INCHES.",
		);
		return warnings;
	}

	// 4. ETFE conditions that require FEP insulation
	const etfeConditions = [
		insulationType === "ETFE" && copperArea < 1241 && wallThickness < 0.001,
		insulationType === "ETFE" &&
			copperArea > 1240 &&
			copperArea < 4900 &&
			wallThickness < 0.0015,
		insulationType === "ETFE" &&
			copperArea > 4899 &&
			copperArea < 12405 &&
			wallThickness < 0.002,
		(insulationType === "PFA" || insulationType === "ETFE") &&
			copperArea > 12404,
	];

	if (etfeConditions.some((condition) => condition)) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION.",
		);
		return warnings;
	}

	// 5. If none of the above conditions are met, UL approval is granted (empty string)
	return warnings;
}

/**
 * Check UL approval requirements for double insulation (E81 logic)
 * Based on Excel formula: =IF(D9<9.61,"CONSULT PLANT TO CONFIRM MANUFACURING CAPABILITY. THIS PART WILL NOT CARRY UL APPROVALS.",IF(OR(AND(D68="ETFE",D9<122,E81<0.001),AND(D68="ETFE",D9>121,D9<2886,E81<0.0015),AND(D68="ETFE",D9>2885,D9<12405,E81<0.003)),"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR REINFORCED INSULATION.",IF(AND(D68="ETFE",D9>12404),"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION.",IF(AND(D68="PFA",D9>1938),"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR REINFORCED INSULATION.",IF(OR(AND(D68="FEP",D9<12405,E81<0.002),AND(D68="FEP",D9>12404,D9<24978,E81<0.005),AND(D68="FEP",D9>24977,D9<40000,E81<0.006)),"INCREASE WALL THICKNESS IF UL APPROVAL IS REQUIRED.","")))))
 */
function checkDoubleInsulationULApproval(
	copperArea: number,
	insulationType: string,
	wallThickness: number,
): string[] {
	const warnings: string[] = [];

	// 1. Check very small copper area (D9 < 9.61)
	if (copperArea < 9.61) {
		warnings.push(
			"CONSULT PLANT TO CONFIRM MANUFACURING CAPABILITY. THIS PART WILL NOT CARRY UL APPROVALS.",
		);
		return warnings;
	}

	// 2. ETFE conditions that require FEP insulation or reinforced insulation
	const etfeReinforcedConditions = [
		insulationType === "ETFE" && copperArea < 122 && wallThickness < 0.001,
		insulationType === "ETFE" &&
			copperArea > 121 &&
			copperArea < 2886 &&
			wallThickness < 0.0015,
		insulationType === "ETFE" &&
			copperArea > 2885 &&
			copperArea < 12405 &&
			wallThickness < 0.003,
	];

	if (etfeReinforcedConditions.some((condition) => condition)) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR REINFORCED INSULATION.",
		);
		return warnings;
	}

	// 3. ETFE with copper area > 12404
	if (insulationType === "ETFE" && copperArea > 12404) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION.",
		);
		return warnings;
	}

	// 4. PFA with copper area > 1938
	if (insulationType === "PFA" && copperArea > 1938) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR REINFORCED INSULATION.",
		);
		return warnings;
	}

	// 5. FEP wall thickness conditions
	const fepConditions = [
		insulationType === "FEP" && copperArea < 12405 && wallThickness < 0.002,
		insulationType === "FEP" &&
			copperArea > 12404 &&
			copperArea < 24978 &&
			wallThickness < 0.005,
		insulationType === "FEP" &&
			copperArea > 24977 &&
			copperArea < 40000 &&
			wallThickness < 0.006,
	];

	if (fepConditions.some((condition) => condition)) {
		warnings.push("INCREASE WALL THICKNESS IF UL APPROVAL IS REQUIRED.");
		return warnings;
	}

	// 6. If none of the above conditions are met, UL approval is granted (empty string)
	return warnings;
}

/**
 * Check UL approval requirements for single insulation (E73 logic)
 * Based on Excel formula: =IF(D9<9.61,"CONSULT PLANT TO CONFIRM MANUFACURING CAPABILITY. THIS PART WILL NOT CARRY UL APPROVALS.",IF(OR(AND(D68="FEP",D9<1939,E73<0.002),AND(D68="FEP",D9>1938,D9<12405,E73<0.003),AND(D68="FEP",D9>12404,D9<24978,E73<0.01),AND(D68="FEP",D9>24977,D9<40000,E73<0.012),AND(D68="ETFE",E73<0.0015),AND(D68="FEP",E73<0.002),AND(D68="PFA",OR(AND(D9<187,E73<0.0015),AND(D9>186,D9<770,E73<0.002)))),"INCREASE WALL THICKNESSES IF UL APPROVALS ARE REQUIRED. IF UL APPROVALS ARE NOT REQUIRED, CONSULT THE FACTORY TO CONFIRM MANUFACTURABILITY.",IF(AND(OR(D68="ETFE",D68="PFA"),D9>769),"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR SUPPLEMENTAL/REINFORCED INSULATION.","")))
 */
function checkSingleInsulationULApproval(
	copperArea: number,
	insulationType: string,
	wallThickness: number,
): string[] {
	const warnings: string[] = [];

	// 1. Check very small copper area (D9 < 9.61)
	if (copperArea < 9.61) {
		warnings.push(
			"CONSULT PLANT TO CONFIRM MANUFACURING CAPABILITY. THIS PART WILL NOT CARRY UL APPROVALS.",
		);
		return warnings;
	}

	// 2. Wall thickness conditions that require increase
	const wallThicknessConditions = [
		insulationType === "FEP" && copperArea < 1939 && wallThickness < 0.002,
		insulationType === "FEP" &&
			copperArea > 1938 &&
			copperArea < 12405 &&
			wallThickness < 0.003,
		insulationType === "FEP" &&
			copperArea > 12404 &&
			copperArea < 24978 &&
			wallThickness < 0.01,
		insulationType === "FEP" &&
			copperArea > 24977 &&
			copperArea < 40000 &&
			wallThickness < 0.012,
		insulationType === "ETFE" && wallThickness < 0.0015,
		insulationType === "FEP" && wallThickness < 0.002,
		insulationType === "PFA" && copperArea < 187 && wallThickness < 0.0015,
		insulationType === "PFA" &&
			copperArea > 186 &&
			copperArea < 770 &&
			wallThickness < 0.002,
	];

	if (wallThicknessConditions.some((condition) => condition)) {
		warnings.push(
			"INCREASE WALL THICKNESSES IF UL APPROVALS ARE REQUIRED. IF UL APPROVALS ARE NOT REQUIRED, CONSULT THE FACTORY TO CONFIRM MANUFACTURABILITY.",
		);
		return warnings;
	}

	// 3. ETFE or PFA with copper area > 769
	if (
		(insulationType === "ETFE" || insulationType === "PFA") &&
		copperArea > 769
	) {
		warnings.push(
			"THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR SUPPLEMENTAL/REINFORCED INSULATION.",
		);
		return warnings;
	}

	// 4. If none of the above conditions are met, UL approval is granted (empty string)
	return warnings;
}

/**
 * Check UL approval requirements and manufacturing capability
 * Based on Excel validation formulas for both single/double/triple insulation
 */
export function checkULApproval(
	conductorDiameter: number,
	insulationType: string,
	copperArea: number,
	wallThickness?: number,
	layers: 1 | 2 | 3 = 1,
): string[] {
	const warnings: string[] = [];

	// Check conductor diameter limit
	if (conductorDiameter > MAX_CONDUCTOR_DIAMETER_INCHES) {
		warnings.push(VALIDATION_MESSAGES.CONDUCTOR_DIAMETER_EXCEEDS);
	}

	// Use layer-specific logic if wall thickness is provided
	if (wallThickness !== undefined) {
		if (layers === 3) {
			warnings.push(
				...checkTripleInsulationULApproval(
					copperArea,
					insulationType,
					wallThickness,
				),
			);
		} else if (layers === 2) {
			warnings.push(
				...checkDoubleInsulationULApproval(
					copperArea,
					insulationType,
					wallThickness,
				),
			);
		} else {
			warnings.push(
				...checkSingleInsulationULApproval(
					copperArea,
					insulationType,
					wallThickness,
				),
			);
		}
		return warnings;
	}

	// Fallback logic if wall thickness is not provided (shouldn't happen for insulated wires)
	// Check very small copper area (D9 < 9.61)
	if (copperArea < MIN_COPPER_AREA_CMA) {
		warnings.push(VALIDATION_MESSAGES.CONSULT_PLANT_MANUFACTURING);
		return warnings; // Return early as this is a critical manufacturing issue
	}

	// For insulated wires without wall thickness, provide generic warning
	warnings.push("Wall thickness required for UL approval validation.");

	return warnings;
}

/**
 * Check manufacturing capability warnings
 * Based on Excel validation formulas for manufacturing constraints
 */
export function checkManufacturingCapability(
	copperArea: number,
	insulationType: string,
	requestedWallThickness?: number,
	layers: 1 | 2 | 3 = 1,
): string[] {
	const warnings: string[] = [];

	// Check very small copper area (D9 < 9.61)
	if (copperArea < MIN_COPPER_AREA_CMA) {
		warnings.push(
			"CONSULT RUBADUE ENGINEERING TO VERIFY MANUFACTURING CAPABILITY.",
		);
	}

	// Check wall thickness scenarios if wall thickness is provided
	if (requestedWallThickness !== undefined) {
		// Calculate the required wall thickness based on Excel logic
		const calculatedWallThickness = calculateRequiredWallThickness(
			insulationType,
			copperArea,
			requestedWallThickness,
			layers,
		);

		// Excel formula: IF(OR(D73<H73,D73<0.0015,),"CONSULT RUBADUE ENGINEERING...")
		// Check if calculated wall thickness > requested wall thickness (we had to increase it)
		if (calculatedWallThickness > requestedWallThickness) {
			warnings.push(
				"CONSULT RUBADUE ENGINEERING TO VERIFY MANUFACTURING CAPABILITY ON THIS WALL THICKNESS.",
			);
		}
		// For single insulation only: check if calculated wall thickness < 0.0015
		else if (layers === 1 && calculatedWallThickness < 0.0015) {
			warnings.push(
				"CONSULT RUBADUE ENGINEERING TO VERIFY MANUFACTURING CAPABILITY ON THIS WALL THICKNESS.",
			);
		}
	}

	return warnings;
}

/**
 * Calculate number of operations using Excel's hierarchical method
 * Based on Excel formula: IF(B30="N/A",IF(B26="N/A",IF(B22="N/A",IF(B18="N/A",1,2),3),4),5)
 */
function calculateOperationsExcelWay(
	strandCount: number,
	wireAWG: number,
): number {
	const maxStrands = getMaxStrandsForAWG(wireAWG);
	let currentCount = strandCount;

	// Level 1: Total strands (Row 14) - always exists
	if (currentCount <= maxStrands) {
		return 1; // Only one level needed
	}

	// Level 2: 2nd to last operation (Row 18)
	if (currentCount % 5 === 0) {
		currentCount = currentCount / 5;
	} else if (currentCount % 3 === 0) {
		currentCount = currentCount / 3;
	} else if (currentCount % 4 === 0) {
		currentCount = currentCount / 4;
	} else {
		return 1; // Cannot divide, stay at level 1
	}

	if (currentCount <= maxStrands) {
		return 2; // Level 2 is final
	}

	// Level 3: 3rd to last operation (Row 22)
	if (currentCount % 5 === 0) {
		currentCount = currentCount / 5;
	} else if (currentCount % 3 === 0) {
		currentCount = currentCount / 3;
	} else if (currentCount % 4 === 0) {
		currentCount = currentCount / 4;
	} else {
		return 2; // Cannot divide, stay at level 2
	}

	if (currentCount <= maxStrands) {
		return 3; // Level 3 is final
	}

	// Level 4: 4th to last operation (Row 26)
	if (currentCount % 5 === 0) {
		currentCount = currentCount / 5;
	} else if (currentCount % 3 === 0) {
		currentCount = currentCount / 3;
	} else if (currentCount % 4 === 0) {
		currentCount = currentCount / 4;
	} else {
		return 3; // Cannot divide, stay at level 3
	}

	if (currentCount <= maxStrands) {
		return 4; // Level 4 is final
	}

	// Level 5: 5th to last operation (Row 30)
	if (currentCount % 5 === 0) {
		currentCount = currentCount / 5;
	} else if (currentCount % 3 === 0) {
		currentCount = currentCount / 3;
	} else if (currentCount % 4 === 0) {
		currentCount = currentCount / 4;
	} else {
		return 4; // Cannot divide, stay at level 4
	}

	return 5; // Reached maximum level
}

// =============================================================================
// MAIN CALCULATION FUNCTIONS
// =============================================================================

/**
 * Main function to calculate complete Litz construction
 *
 * This is the primary entry point for Litz wire calculations. It validates the strand count,
 * calculates manufacturing parameters, and returns a complete construction specification.
 *
 * @param totalStrands - Total number of strands in the construction
 * @param wireAWG - AWG size of individual strands
 * @param litzType - Type 1 (uniform) or Type 2 (varying) Litz construction
 * @param magnetWireGrade - Magnet wire grade (default: "MW 79-C")
 * @returns Complete Litz construction calculation result
 */
export function calculateLitzConstruction(
	totalStrands: number,
	wireAWG: number,
	litzType: "Type 1" | "Type 2",
	_magnetWireGrade = "MW 79-C",
): LitzConstruction {
	// Validate strand count
	const validation = validateStrandCount(totalStrands, wireAWG);

	if (!validation.isValid) {
		return {
			totalStrands,
			wireAWG,
			litzType,
			numberOfOperations: 0,
			packingFactor: 0,
			takeUpFactor: 0,
			totalCopperAreaCMA: 0,
			totalCopperAreaMM2: 0,
			equivalentAWG: "",
			isValid: false,
			validationMessage: validation.message,
		};
	}

	// Calculate operations count using Excel's hierarchical method
	const numberOfOperations = calculateOperationsExcelWay(totalStrands, wireAWG);

	// Calculate packing factor (pass wireAWG for special-case logic)
	const packingFactor = calculatePackingFactor(
		litzType,
		numberOfOperations,
		wireAWG,
	);

	// Calculate take up factor
	const takeUpFactor = calculateTakeUpFactor(litzType, numberOfOperations);

	// Calculate copper areas
	const totalCopperAreaCMA = calculateTotalCopperAreaCMA(totalStrands, wireAWG);
	const totalCopperAreaMM2 = calculateTotalCopperAreaMM2(totalCopperAreaCMA);

	// Calculate equivalent AWG
	const equivalentAWG = calculateEquivalentAWG(totalCopperAreaCMA);

	return {
		totalStrands,
		wireAWG,
		litzType,
		numberOfOperations,
		packingFactor,
		takeUpFactor,
		totalCopperAreaCMA,
		totalCopperAreaMM2,
		equivalentAWG,
		isValid: true,
		validationMessage: validation.message,
	};
}

/**
 * Calculate Nylon Served Diameters
 *
 * Calculates the diameter increase for nylon-served Litz wire constructions.
 * Single serve adds 0.002-0.003 inches, double serve adds 0.004-0.006 inches.
 *
 * @param bareResult - Bare Litz wire diameter result
 * @param serveType - Type of nylon serve (Single or Double)
 * @returns Served diameter result with updated part number
 */
export function calculateNylonServedDiameters(
	bareResult: DiameterResult,
	serveType: "Single Nylon Serve" | "Double Nylon Serve",
): DiameterResult {
	// Calculate served diameters based on serve type
	if (serveType === "Single Nylon Serve") {
		return {
			min: round3(bareResult.min + 0.002),
			nom: round3(bareResult.nom + 0.002),
			max: round3(bareResult.max + 0.003),
			partNumber: bareResult.partNumber.replace(/-XX$/, "-SN-XX"),
			wallThicknessInches: null,
			wallThicknessMm: null,
		};
	}

	// Double Nylon Serve
	return {
		min: round3(bareResult.min + 0.004),
		nom: round3(bareResult.nom + 0.004),
		max: round3(bareResult.max + 0.006),
		partNumber: bareResult.partNumber.replace(/-XX$/, "-DN-XX"),
		wallThicknessInches: null,
		wallThicknessMm: null,
	};
}
