import Decimal from "decimal.js";
// Litz Wire Calculation Utilities
// Extracted from Excel formulas in Cover Sheet_formulas.csv and related files

export interface LitzConstruction {
	totalStrands: number;
	wireAWG: number;
	litzType: "Type 1" | "Type 2";
	numberOfOperations: number;
	packingFactor: number;
	takeUpFactor: number;
	totalCopperAreaCMA: number;
	totalCopperAreaMM2: number;
	equivalentAWG: string;
	isValid: boolean;
	validationMessage: string;
}

export interface StrandValidationResult {
	isValid: boolean;
	breakdown: number[];
	nearbyValid: number[];
	message: string;
}

export interface DiameterResult {
	min: number;
	nom: number;
	max: number;
	partNumber: string;
	wallThicknessInches: number | null;
	wallThicknessMm: number | null;
}

// AWG Reference Data (from AWG Reference_values.csv)
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
	13: { diameter: 0.072, cma: 5180, strandedCMA: 5076 },
	14: { diameter: 0.0641, cma: 4110, strandedCMA: 4028 },
	15: { diameter: 0.0571, cma: 3260, strandedCMA: 3195 },
	16: { diameter: 0.0508, cma: 2580, strandedCMA: 2528 },
	17: { diameter: 0.0453, cma: 2050, strandedCMA: 2009 },
	18: { diameter: 0.0403, cma: 1620, strandedCMA: 1588 },
	19: { diameter: 0.0359, cma: 1290, strandedCMA: 1264 },
	20: { diameter: 0.032, cma: 1020, strandedCMA: 1000 },
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

// Max strands per single operation (from Max Ends Single Op_values.csv)
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

// Magnet Wire Film Thicknesses (from Magnet Wire_values.csv)
const MAGNET_WIRE_FILM_THICKNESSES: Record<
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

// Packing factors by Litz type and operations
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
		3: 1.271,
		4: 1.271,
		5: 1.271,
	},
};

// Take up factors by operations
const TAKE_UP_FACTORS: Record<number, number> = {
	1: 1.01,
	2: 1.01,
	3: 1.03,
	4: 1.051,
	5: 1.051,
};

/**
 * Calculate required wall thickness based on insulation type and copper area
 * Based on Excel formula: =IF(OR(D68="ETFE",D68="PFA"),IF(H73<0.0015,0.0015,H73),IF(AND(D68="FEP",D9<1939,H73<0.002),0.002,IF(AND(D68="FEP",D9>1938,D9<12405,H73<0.003),0.003,IF(AND(D68="FEP",D9>12404,D9<24978,H73<0.01),0.01,IF(AND(D68="FEP",D9>24977,H73<0.012),0.012,H73)))))
 */
export function calculateRequiredWallThickness(
	insulationType: string,
	copperAreaCMA: number,
	inputWallThickness: number,
	layers: 1 | 2 | 3, // Add layers parameter to distinguish between E73, E81, E89 logic
): number {
	// E73 (Single Insulation) logic
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

	// E81 (Double Insulation) logic
	if (layers === 2) {
		if (insulationType === "ETFE") {
			return Math.max(0.001, inputWallThickness);
		}
		if (insulationType === "PFA") {
			return Math.max(0.0015, inputWallThickness);
		}
		if (insulationType === "FEP") {
			if (copperAreaCMA < 12405 && inputWallThickness < 0.002) {
				return 0.002;
			}
			if (
				copperAreaCMA >= 12405 &&
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

	// E89 (Triple Insulation) logic
	if (layers === 3) {
		if (insulationType === "ETFE") {
			return Math.max(0.001, inputWallThickness);
		}
		if (insulationType === "PFA") {
			return Math.max(0.0015, inputWallThickness);
		}
		if (insulationType === "FEP") {
			if (copperAreaCMA < 12405 && inputWallThickness < 0.002) {
				return 0.002;
			}
			if (inputWallThickness < 0.004) {
				return 0.004;
			}
			return inputWallThickness;
		}
	}

	// Default: return input value
	return inputWallThickness;
}

// Part number prefixes
const PART_NUMBER_PREFIXES: Record<string, string> = {
	"MW 79-C": "L79",
	"MW 80-C": "L80",
	"MW 77-C": "L77",
	"MW 35-C": "L35",
	"MW 16-C": "L16",
};

// AWG to diameter lookup (simplified - you may want to expand this)
export const AWG_TO_DIAMETER: Record<
	number,
	{ min: number; nom: number; max: number }
> = {
	36: { min: 0.005, nom: 0.005, max: 0.0056 },
	35: { min: 0.0056, nom: 0.0056, max: 0.0063 },
	34: { min: 0.0063, nom: 0.0063, max: 0.0071 },
	33: { min: 0.0071, nom: 0.0071, max: 0.008 },
	32: { min: 0.008, nom: 0.008, max: 0.009 },
	31: { min: 0.009, nom: 0.009, max: 0.01 },
	30: { min: 0.01, nom: 0.01, max: 0.0113 },
	29: { min: 0.0113, nom: 0.0113, max: 0.0126 },
	28: { min: 0.0126, nom: 0.0126, max: 0.0142 },
	27: { min: 0.0142, nom: 0.0142, max: 0.0159 },
	26: { min: 0.0159, nom: 0.0159, max: 0.0179 },
	25: { min: 0.0179, nom: 0.0179, max: 0.0201 },
	24: { min: 0.0201, nom: 0.0201, max: 0.0226 },
	23: { min: 0.0226, nom: 0.0226, max: 0.0254 },
	22: { min: 0.0254, nom: 0.0254, max: 0.0285 },
	21: { min: 0.0285, nom: 0.0285, max: 0.032 },
	20: { min: 0.032, nom: 0.032, max: 0.036 },
	19: { min: 0.036, nom: 0.036, max: 0.0403 },
	18: { min: 0.0403, nom: 0.0403, max: 0.0453 },
	17: { min: 0.0453, nom: 0.0453, max: 0.0508 },
	16: { min: 0.0508, nom: 0.0508, max: 0.0571 },
	15: { min: 0.0571, nom: 0.0571, max: 0.0641 },
	14: { min: 0.0641, nom: 0.0641, max: 0.072 },
	13: { min: 0.072, nom: 0.072, max: 0.0808 },
	12: { min: 0.0808, nom: 0.0808, max: 0.0907 },
	11: { min: 0.0907, nom: 0.0907, max: 0.1019 },
	10: { min: 0.1019, nom: 0.1019, max: 0.1144 },
	9: { min: 0.1144, nom: 0.1144, max: 0.1285 },
	8: { min: 0.1285, nom: 0.1285, max: 0.1443 },
};

// AWG to CMA lookup
const AWG_TO_CMA: Record<number, number> = {
	36: 25.0,
	35: 31.2,
	34: 39.7,
	33: 50.4,
	32: 64.0,
	31: 79.6,
	30: 100.5,
	29: 127.0,
	28: 159.8,
	27: 201.5,
	26: 254.1,
	25: 320.4,
	24: 404.0,
	23: 509.5,
	22: 642.4,
	21: 810.1,
	20: 1022.0,
	19: 1288.0,
	18: 1624.0,
	17: 2048.0,
	16: 2583.0,
	15: 3257.0,
	14: 4107.0,
	13: 5178.0,
	12: 6530.0,
	11: 8234.0,
	10: 10383.0,
	9: 13087.0,
	8: 16509.0,
};

/**
 * Validates strand count by recursively dividing by 5, 3, or 4
 * Based on Excel formula: IF($D4<49,IF(B14>NOOFENDSMAX,IF(B15=TRUE,B14/5,IF(B16=TRUE,B14/3,IF(B17=TRUE,B14/4,"N/A"))),""N/A""),...)
 */
export function validateStrandCount(
	strandCount: number,
	wireAWG: number,
): StrandValidationResult {
	const breakdown: number[] = [];
	let currentCount = strandCount;

	// Special rule: For AWG 12-22, 8 or fewer strands are always valid
	if (wireAWG >= 12 && wireAWG <= 22 && strandCount <= 8) {
		return {
			isValid: true,
			breakdown: [strandCount],
			nearbyValid: [strandCount],
			message: `Valid: ${strandCount} strands for AWG ${wireAWG} (special rule for 8 or fewer strands)`,
		};
	}

	// Get max strands for this AWG
	const maxStrands = getMaxStrandsForAWG(wireAWG);

	while (currentCount > maxStrands) {
		let divided = false;

		// Try dividing by 5, 3, or 4 in that order
		if (currentCount % 5 === 0) {
			currentCount = currentCount / 5;
			breakdown.push(5);
			divided = true;
		} else if (currentCount % 3 === 0) {
			currentCount = currentCount / 3;
			breakdown.push(3);
			divided = true;
		} else if (currentCount % 4 === 0) {
			currentCount = currentCount / 4;
			breakdown.push(4);
			divided = true;
		}

		if (!divided) {
			break;
		}
	}

	const isValid = currentCount <= maxStrands;
	const nearbyValid = findNearbyValidCounts(strandCount, wireAWG);
	return {
		isValid,
		breakdown: [strandCount, ...breakdown],
		nearbyValid,
		message: isValid
			? `${strandCount} strands breaks down to ${currentCount} strands in first operation`
			: `${strandCount} strands cannot be reduced to ${maxStrands} or fewer strands`,
	};
}

/**
 * Get maximum strands allowed for a given AWG
 * Based on Excel validation logic
 */
function getMaxStrandsForAWG(awg: number): number {
	// Use exact data from Max Ends Single Op_values.csv
	return MAX_STRANDS_SINGLE_OP[awg] || 0;
}

/**
 * Find nearby valid strand counts
 */
function findNearbyValidCounts(target: number, awg: number): number[] {
	const valid: number[] = [];
	const maxStrands = getMaxStrandsForAWG(awg);

	// Check counts around the target
	for (let i = Math.max(1, target - 10); i <= target + 10; i++) {
		// Use simplified validation to avoid recursion
		const isValid = validateStrandCountSimple(i, awg, maxStrands);
		if (isValid) {
			valid.push(i);
		}
	}

	return valid.slice(0, 5); // Return up to 5 nearby valid counts
}

/**
 * Simplified strand validation without recursion
 */
function validateStrandCountSimple(
	strandCount: number,
	wireAWG: number,
	maxStrands: number,
): boolean {
	// Special rule: For AWG 12-22, 8 or fewer strands are always valid
	if (wireAWG >= 12 && wireAWG <= 22 && strandCount <= 8) {
		return true;
	}

	let currentCount = strandCount;

	while (currentCount > maxStrands) {
		let divided = false;

		// Try dividing by 5, 3, or 4 in that order
		if (currentCount % 5 === 0) {
			currentCount = currentCount / 5;
			divided = true;
		} else if (currentCount % 3 === 0) {
			currentCount = currentCount / 3;
			divided = true;
		} else if (currentCount % 4 === 0) {
			currentCount = currentCount / 4;
			divided = true;
		}

		if (!divided) {
			break;
		}
	}

	return currentCount <= maxStrands;
}

/**
 * Calculate packing factor based on Litz type and operations
 * Based on Excel formula: IF(D6="Type 1",VLOOKUP(D5,TYPE1,4,0),VLOOKUP(D5,TYPE2,4,0))
 */
export function calculatePackingFactor(
	litzType: "Type 1" | "Type 2",
	operations: number,
): number {
	if (operations > 5) {
		throw new Error("Maximum 5 operations supported");
	}

	return PACKING_FACTORS[litzType][operations] || 1.155;
}

/**
 * Calculate take up factor based on operations
 * Based on Excel formula: IF(D3<26,K3,IF(D5=1,K4,IF(D5=2,K5,K6)))
 */
export function calculateTakeUpFactor(operations: number): number {
	return TAKE_UP_FACTORS[operations] || 1.01;
}

/**
 * Calculate total copper area in CMA
 * Based on Excel formula: INDEX('Magnet Wire'!$A$3:$E$41,MATCH(D4,'Magnet Wire'!$A$3:$A$41,0),MATCH("CMA SOLID",'Magnet Wire'!$A$2:$E$2,0))*$D$3
 */
export function calculateTotalCopperAreaCMA(
	strandCount: number,
	wireAWG: number,
): number {
	const awgData = AWG_REFERENCE[wireAWG];
	if (!awgData) {
		throw new Error(`No CMA data available for AWG ${wireAWG}`);
	}

	return strandCount * awgData.cma;
}

/**
 * Calculate total copper area in mm²
 * Based on Excel formula: $D$9*0.000506707
 */
export function calculateTotalCopperAreaMM2(cma: number): number {
	return cma * 0.000506707;
}

/**
 * Calculate equivalent AWG from total copper area
 * Based on Excel formula: IFERROR(IF((INDEX('AWG Reference'!$F$5:$H$64,MATCH(D9,'AWG Reference'!$H$5:$H$64,-1),1)+1)>50,"",(INDEX('AWG Reference'!$F$5:$H$64,MATCH(D9,'AWG Reference'!$H$5:$H$64,-1),1)+1)&" AWG"),"")
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

/**
 * Calculate bare Litz diameters
 * Based on Excel formula: ROUND(SQRT($D$3)*E39*$D$7,3)
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

function round3(val: number): number {
	return Math.round(val * 1000) / 1000;
}

// Excel MROUND equivalent - rounds to nearest multiple
function mround(val: number, multiple: number): number {
	return Math.round(val / multiple) * multiple;
}

// Excel wall thickness logic for single insulation (G73)
function calculateWallThicknessSingle(rawWall: number): number {
	const rounded3 = Math.round(rawWall * 1000) / 1000;
	if (rounded3 < rawWall) {
		return rounded3 + 0.0005;
	}
	return mround(rawWall, 0.0005);
}

// Excel wall thickness logic for double insulation (G81)
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

// Excel wall thickness logic for triple insulation (G89)
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

export function calculateInsulatedLitzDiameters(
	bareDiameter: number, // ignored for min/nom/max
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
	const copperAreaCMA = calculateTotalCopperAreaCMA(strandCount ?? 1, wireAWG);

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
		// Excel logic for triple insulation - uses triple film nominal OD for delta (C54)
		const tripleFilmForDelta = calculateBareLitzDiameters(
			strandCount ?? 1,
			wireAWG,
			1.155, // Use standard packing factor for delta determination
			magnetWireGrade,
			"Triple",
		);
		const tripleFilmNom = new Decimal(tripleFilmForDelta.nom);
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
	const gradeCode = PART_NUMBER_PREFIXES[magnetWireGrade] || "XX";
	const prefix = layers === 1 ? "SXXL" : layers === 2 ? "DXXL" : "TXXL";
	const insulationCode =
		insulationType === "ETFE" ? "E" : insulationType === "FEP" ? "F" : "P";
	const xSuffix = layers === 1 ? "X" : layers === 2 ? "XX" : "XXX";
	const wallThicknessMils = Math.round(requiredWallThickness * 1000);
	const partNumber = `${prefix}${Math.round(bareOD_nom_raw.toNumber() * 1000)}/${wireAWG}${insulationCode}${xSuffix}-${wallThicknessMils}(MW${gradeCode})`;

	return {
		min: minDiameter,
		nom: nominalDiameter,
		max: maxDiameter,
		partNumber,
		wallThicknessInches,
		wallThicknessMm,
	};
}

/**
 * Validation rule interface for wall thickness checks
 */
interface WallThicknessRule {
	insulationType: string;
	copperAreaMin?: number;
	copperAreaMax?: number;
	minWallThickness: number;
	messageKey: string; // Use message key instead of full message
}

/**
 * Validation rule interface for copper area checks
 */
interface CopperAreaRule {
	insulationType: string;
	copperAreaMin?: number;
	copperAreaMax?: number;
	messageKey: string; // Use message key instead of full message
}

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
 * Wall thickness validation rules based on Excel formulas
 * Organized by insulation type and layer count
 */
const WALL_THICKNESS_RULES: Record<1 | 2 | 3, WallThicknessRule[]> = {
	1: [
		// Single insulation (E73 logic)
		{
			insulationType: "FEP",
			copperAreaMax: 1938,
			minWallThickness: 0.002,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 1939,
			copperAreaMax: 12404,
			minWallThickness: 0.003,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 12405,
			copperAreaMax: 24977,
			minWallThickness: 0.01,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 24978,
			copperAreaMax: 39999,
			minWallThickness: 0.012,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			minWallThickness: 0.002,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "ETFE",
			minWallThickness: 0.0015,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "PFA",
			copperAreaMax: 186,
			minWallThickness: 0.0015,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "PFA",
			copperAreaMin: 187,
			copperAreaMax: 769,
			minWallThickness: 0.002,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
	],
	2: [
		// Double insulation (E81 logic)
		{
			insulationType: "ETFE",
			copperAreaMax: 121,
			minWallThickness: 0.001,
			messageKey: "NO_UL_APPROVAL_ETFE_FEP",
		},
		{
			insulationType: "ETFE",
			copperAreaMin: 122,
			copperAreaMax: 2885,
			minWallThickness: 0.0015,
			messageKey: "NO_UL_APPROVAL_ETFE_FEP",
		},
		{
			insulationType: "ETFE",
			copperAreaMin: 2886,
			copperAreaMax: 12404,
			minWallThickness: 0.003,
			messageKey: "NO_UL_APPROVAL_ETFE_FEP",
		},
		{
			insulationType: "FEP",
			copperAreaMax: 12404,
			minWallThickness: 0.002,
			messageKey: "INCREASE_WALL_THICKNESS_DOUBLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 12405,
			copperAreaMax: 24977,
			minWallThickness: 0.005,
			messageKey: "INCREASE_WALL_THICKNESS_DOUBLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 24978,
			copperAreaMax: 39999,
			minWallThickness: 0.006,
			messageKey: "INCREASE_WALL_THICKNESS_DOUBLE",
		},
	],
	3: [
		// Triple insulation (E89 logic) - same as single for now
		{
			insulationType: "FEP",
			copperAreaMax: 1938,
			minWallThickness: 0.002,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 1939,
			copperAreaMax: 12404,
			minWallThickness: 0.003,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 12405,
			copperAreaMax: 24977,
			minWallThickness: 0.01,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			copperAreaMin: 24978,
			copperAreaMax: 39999,
			minWallThickness: 0.012,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "FEP",
			minWallThickness: 0.002,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "ETFE",
			minWallThickness: 0.0015,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "PFA",
			copperAreaMax: 186,
			minWallThickness: 0.0015,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
		{
			insulationType: "PFA",
			copperAreaMin: 187,
			copperAreaMax: 769,
			minWallThickness: 0.002,
			messageKey: "INCREASE_WALL_THICKNESS_SINGLE",
		},
	],
};

/**
 * Copper area validation rules
 */
const COPPER_AREA_RULES: CopperAreaRule[] = [
	{
		insulationType: "ETFE",
		copperAreaMin: 12405,
		messageKey: "NO_UL_APPROVAL_ETFE",
	},
	{
		insulationType: "PFA",
		copperAreaMin: 1939,
		messageKey: "NO_UL_APPROVAL_PFA_FEP",
	},
	{
		insulationType: "ETFE",
		copperAreaMin: 770,
		messageKey: "NO_UL_APPROVAL_ETFE_PFA_SUPPLEMENTAL",
	},
	{
		insulationType: "PFA",
		copperAreaMin: 770,
		messageKey: "NO_UL_APPROVAL_ETFE_PFA_SUPPLEMENTAL",
	},
	{
		insulationType: "PFA",
		copperAreaMin: 12405,
		messageKey: "SELECT_FEP_FOR_UL",
	},
];

/**
 * Check if a value falls within a range
 */
function isInRange(value: number, min?: number, max?: number): boolean {
	if (min !== undefined && value < min) return false;
	if (max !== undefined && value > max) return false;
	return true;
}

/**
 * Check wall thickness validation rules for specific insulation type
 */
function checkWallThicknessRules(
	insulationType: string,
	copperArea: number,
	wallThickness: number,
	layers: 1 | 2 | 3,
): string[] {
	const warnings: string[] = [];
	const rules = WALL_THICKNESS_RULES[layers];

	// Only check rules for the current insulation type
	const relevantRules = rules.filter(
		(rule) => rule.insulationType === insulationType,
	);

	for (const rule of relevantRules) {
		if (isInRange(copperArea, rule.copperAreaMin, rule.copperAreaMax)) {
			if (wallThickness < rule.minWallThickness) {
				warnings.push(
					VALIDATION_MESSAGES[
						rule.messageKey as keyof typeof VALIDATION_MESSAGES
					],
				);
				break; // Only show first matching rule
			}
		}
	}

	return warnings;
}

/**
 * Check copper area validation rules for specific insulation type
 */
function checkCopperAreaRules(
	insulationType: string,
	copperArea: number,
): string[] {
	const warnings: string[] = [];

	// Only check rules for the current insulation type
	const relevantRules = COPPER_AREA_RULES.filter(
		(rule) => rule.insulationType === insulationType,
	);

	for (const rule of relevantRules) {
		if (isInRange(copperArea, rule.copperAreaMin)) {
			warnings.push(
				VALIDATION_MESSAGES[
					rule.messageKey as keyof typeof VALIDATION_MESSAGES
				],
			);
		}
	}

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
	if (conductorDiameter > 0.2) {
		warnings.push(VALIDATION_MESSAGES.CONDUCTOR_DIAMETER_EXCEEDS);
	}

	// Check very small copper area (D9 < 9.61)
	if (copperArea < 9.61) {
		warnings.push(VALIDATION_MESSAGES.CONSULT_PLANT_MANUFACTURING);
		return warnings; // Return early as this is a critical manufacturing issue
	}

	// Check wall thickness scenarios if wall thickness is provided
	if (wallThickness !== undefined) {
		warnings.push(
			...checkWallThicknessRules(
				insulationType,
				copperArea,
				wallThickness,
				layers,
			),
		);
	}

	// Check copper area rules
	warnings.push(...checkCopperAreaRules(insulationType, copperArea));

	return warnings;
}

/**
 * Check manufacturing capability warnings
 * Based on Excel validation formulas for manufacturing constraints
 */
export function checkManufacturingCapability(
	copperArea: number,
	insulationType: string,
	wallThickness?: number,
	layers: 1 | 2 | 3 = 1,
): string[] {
	const warnings: string[] = [];

	// Check very small copper area (D9 < 9.61)
	if (copperArea < 9.61) {
		warnings.push(VALIDATION_MESSAGES.CONSULT_PLANT_MANUFACTURING);
	}

	// Check wall thickness scenarios if wall thickness is provided
	if (wallThickness !== undefined) {
		warnings.push(
			...checkWallThicknessRules(
				insulationType,
				copperArea,
				wallThickness,
				layers,
			),
		);
	}

	return warnings;
}

/**
 * Main function to calculate complete Litz construction
 */
export function calculateLitzConstruction(
	totalStrands: number,
	wireAWG: number,
	litzType: "Type 1" | "Type 2",
	magnetWireGrade = "MW 79-C",
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

	// Excel logic: number of operations = number of steps in breakdown
	const numberOfOperations = validation.breakdown.length;

	// Calculate packing factor
	const packingFactor = calculatePackingFactor(litzType, numberOfOperations);

	// Calculate take up factor
	const takeUpFactor = calculateTakeUpFactor(numberOfOperations);

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
