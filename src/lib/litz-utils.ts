// AWG Wire Specifications - Real data from Excel
export interface AWGSpec {
  awg: number;
  maxDCR: number; // Ω/1000ft
  bareOD: number; // inches
  cmaSolid: number;
  minLitzCMA: number;
}

export const awgSpecs: AWGSpec[] = [
  { awg: 12, maxDCR: 1.62, bareOD: 0.0808, cmaSolid: 6529, minLitzCMA: 6399 },
  { awg: 13, maxDCR: 2.04, bareOD: 0.0720, cmaSolid: 5184, minLitzCMA: 5076 },
  { awg: 14, maxDCR: 2.57, bareOD: 0.0641, cmaSolid: 4109, minLitzCMA: 4028 },
  { awg: 15, maxDCR: 3.25, bareOD: 0.0571, cmaSolid: 3260, minLitzCMA: 3195 },
  { awg: 16, maxDCR: 4.10, bareOD: 0.0508, cmaSolid: 2581, minLitzCMA: 2528 },
  { awg: 17, maxDCR: 5.17, bareOD: 0.0453, cmaSolid: 2052, minLitzCMA: 2009 },
  { awg: 18, maxDCR: 6.51, bareOD: 0.0403, cmaSolid: 1624, minLitzCMA: 1588 },
  { awg: 19, maxDCR: 8.23, bareOD: 0.0359, cmaSolid: 1289, minLitzCMA: 1264 },
  { awg: 20, maxDCR: 10.32, bareOD: 0.0320, cmaSolid: 1024, minLitzCMA: 1000 },
  { awg: 21, maxDCR: 13.04, bareOD: 0.0285, cmaSolid: 812, minLitzCMA: 796 },
  { awg: 22, maxDCR: 16.59, bareOD: 0.0253, cmaSolid: 640, minLitzCMA: 627 },
  { awg: 23, maxDCR: 20.67, bareOD: 0.0226, cmaSolid: 511, minLitzCMA: 501 },
  { awg: 24, maxDCR: 26.19, bareOD: 0.0201, cmaSolid: 404, minLitzCMA: 396 },
  { awg: 25, maxDCR: 33.10, bareOD: 0.0179, cmaSolid: 320, minLitzCMA: 314 },
  { awg: 26, maxDCR: 42.07, bareOD: 0.0159, cmaSolid: 253, minLitzCMA: 248 },
  { awg: 27, maxDCR: 52.17, bareOD: 0.0142, cmaSolid: 202, minLitzCMA: 198 },
  { awg: 28, maxDCR: 66.37, bareOD: 0.0126, cmaSolid: 159, minLitzCMA: 156 },
  { awg: 29, maxDCR: 82.68, bareOD: 0.0113, cmaSolid: 128, minLitzCMA: 125 },
  { awg: 30, maxDCR: 105.82, bareOD: 0.0100, cmaSolid: 100, minLitzCMA: 98 },
  { awg: 31, maxDCR: 133.92, bareOD: 0.0089, cmaSolid: 79.2, minLitzCMA: 77.6 },
  { awg: 32, maxDCR: 166.18, bareOD: 0.0080, cmaSolid: 64.0, minLitzCMA: 62.7 },
  { awg: 33, maxDCR: 211.65, bareOD: 0.0071, cmaSolid: 50.4, minLitzCMA: 49.4 },
  { awg: 34, maxDCR: 269.80, bareOD: 0.0063, cmaSolid: 39.7, minLitzCMA: 38.9 },
  { awg: 35, maxDCR: 342.84, bareOD: 0.0056, cmaSolid: 31.4, minLitzCMA: 30.8 },
  { awg: 36, maxDCR: 431.95, bareOD: 0.0050, cmaSolid: 25.0, minLitzCMA: 24.5 },
  { awg: 37, maxDCR: 535.69, bareOD: 0.0045, cmaSolid: 20.3, minLitzCMA: 19.8 },
  { awg: 38, maxDCR: 681.85, bareOD: 0.0040, cmaSolid: 16.0, minLitzCMA: 15.7 },
  { awg: 39, maxDCR: 897.15, bareOD: 0.0035, cmaSolid: 12.25, minLitzCMA: 11.9 },
  { awg: 40, maxDCR: 1152.33, bareOD: 0.0031, cmaSolid: 9.61, minLitzCMA: 9.42 },
  { awg: 41, maxDCR: 1422.63, bareOD: 0.0028, cmaSolid: 7.84, minLitzCMA: 7.68 },
  { awg: 42, maxDCR: 1800.52, bareOD: 0.0025, cmaSolid: 6.25, minLitzCMA: 6.13 },
  { awg: 43, maxDCR: 2351.70, bareOD: 0.0022, cmaSolid: 4.84, minLitzCMA: 4.74 },
  { awg: 44, maxDCR: 2872.85, bareOD: 0.0020, cmaSolid: 4.00, minLitzCMA: 3.92 },
  { awg: 45, maxDCR: 3616.00, bareOD: 0.00176, cmaSolid: 3.10, minLitzCMA: 3.04 },
  { awg: 46, maxDCR: 4544.00, bareOD: 0.00157, cmaSolid: 2.46, minLitzCMA: 2.41 },
  { awg: 47, maxDCR: 5714.00, bareOD: 0.0014, cmaSolid: 1.96, minLitzCMA: 1.92 },
  { awg: 48, maxDCR: 7285.00, bareOD: 0.00124, cmaSolid: 1.54, minLitzCMA: 1.51 },
  { awg: 49, maxDCR: 9090.00, bareOD: 0.00111, cmaSolid: 1.23, minLitzCMA: 1.21 },
  { awg: 50, maxDCR: 11430.00, bareOD: 0.00099, cmaSolid: 0.980, minLitzCMA: 0.96 },
];

// Film dimension data - Real data from Excel
export interface FilmDimensions {
  awg: number;
  single: { min: number; nom: number; max: number } | null;
  heavy: { min: number; nom: number; max: number } | null;
  triple: { min: number; nom: number; max: number } | null;
  quad: { min: number; nom: number; max: number } | null;
}

export const filmDimensions: FilmDimensions[] = [
  // 12 AWG
  { awg: 12, single: { min: 0.0814, nom: 0.0827, max: 0.0840 }, heavy: { min: 0.0829, nom: 0.0837, max: 0.0847 }, triple: null, quad: null },
  // 13 AWG  
  { awg: 13, single: { min: 0.0727, nom: 0.0739, max: 0.0750 }, heavy: { min: 0.0741, nom: 0.0749, max: 0.0757 }, triple: null, quad: null },
  // 14 AWG
  { awg: 14, single: { min: 0.0651, nom: 0.0658, max: 0.0666 }, heavy: { min: 0.0667, nom: 0.0675, max: 0.0682 }, triple: { min: 0.0683, nom: 0.0692, max: 0.0700 }, quad: { min: 0.0684, nom: 0.0700, max: 0.0715 } },
  // 15 AWG
  { awg: 15, single: { min: 0.0580, nom: 0.0587, max: 0.0594 }, heavy: { min: 0.0595, nom: 0.0602, max: 0.0609 }, triple: { min: 0.0610, nom: 0.0619, max: 0.0627 }, quad: { min: 0.0613, nom: 0.0628, max: 0.0644 } },
  // 16 AWG
  { awg: 16, single: { min: 0.0517, nom: 0.0524, max: 0.0531 }, heavy: { min: 0.0532, nom: 0.0539, max: 0.0545 }, triple: { min: 0.0546, nom: 0.0554, max: 0.0562 }, quad: { min: 0.0549, nom: 0.0563, max: 0.0577 } },
  // 17 AWG
  { awg: 17, single: { min: 0.0462, nom: 0.0468, max: 0.0475 }, heavy: { min: 0.0476, nom: 0.0482, max: 0.0488 }, triple: { min: 0.0489, nom: 0.0497, max: 0.0504 }, quad: { min: 0.0493, nom: 0.0506, max: 0.0520 } },
  // 18 AWG
  { awg: 18, single: { min: 0.0412, nom: 0.0418, max: 0.0424 }, heavy: { min: 0.0425, nom: 0.0431, max: 0.0437 }, triple: { min: 0.0438, nom: 0.0445, max: 0.0452 }, quad: { min: 0.0443, nom: 0.0456, max: 0.0468 } },
  // 19 AWG
  { awg: 19, single: { min: 0.0367, nom: 0.0373, max: 0.0379 }, heavy: { min: 0.0380, nom: 0.0386, max: 0.0391 }, triple: { min: 0.0392, nom: 0.0399, max: 0.0406 }, quad: { min: 0.0397, nom: 0.0410, max: 0.0422 } },
  // 20 AWG
  { awg: 20, single: { min: 0.0329, nom: 0.0334, max: 0.0339 }, heavy: { min: 0.0340, nom: 0.0346, max: 0.0351 }, triple: { min: 0.0352, nom: 0.0358, max: 0.0364 }, quad: { min: 0.0357, nom: 0.0368, max: 0.0379 } },
  // 21 AWG
  { awg: 21, single: { min: 0.0293, nom: 0.0298, max: 0.0303 }, heavy: { min: 0.0304, nom: 0.0309, max: 0.0314 }, triple: { min: 0.0315, nom: 0.0321, max: 0.0326 }, quad: { min: 0.0321, nom: 0.0332, max: 0.0342 } },
  // 22 AWG
  { awg: 22, single: { min: 0.0261, nom: 0.0266, max: 0.0270 }, heavy: { min: 0.0271, nom: 0.0276, max: 0.0281 }, triple: { min: 0.0282, nom: 0.0288, max: 0.0293 }, quad: { min: 0.0287, nom: 0.0298, max: 0.0308 } },
  // 23 AWG
  { awg: 23, single: { min: 0.0234, nom: 0.0238, max: 0.0243 }, heavy: { min: 0.0244, nom: 0.0249, max: 0.0253 }, triple: { min: 0.0254, nom: 0.0259, max: 0.0264 }, quad: { min: 0.0260, nom: 0.0270, max: 0.0279 } },
  // 24 AWG
  { awg: 24, single: { min: 0.0209, nom: 0.0213, max: 0.0217 }, heavy: { min: 0.0218, nom: 0.0223, max: 0.0227 }, triple: { min: 0.0228, nom: 0.0233, max: 0.0238 }, quad: { min: 0.0234, nom: 0.0243, max: 0.0252 } },
  // 25 AWG
  { awg: 25, single: { min: 0.0186, nom: 0.0190, max: 0.0194 }, heavy: { min: 0.0195, nom: 0.0199, max: 0.0203 }, triple: { min: 0.0204, nom: 0.0209, max: 0.0214 }, quad: { min: 0.0211, nom: 0.0220, max: 0.0228 } },
  // 26 AWG
  { awg: 26, single: { min: 0.0166, nom: 0.0170, max: 0.0173 }, heavy: { min: 0.0174, nom: 0.0178, max: 0.0182 }, triple: { min: 0.0183, nom: 0.0188, max: 0.0193 }, quad: { min: 0.0189, nom: 0.0198, max: 0.0206 } },
  // 27 AWG
  { awg: 27, single: { min: 0.0149, nom: 0.0153, max: 0.0156 }, heavy: { min: 0.0157, nom: 0.0161, max: 0.0164 }, triple: { min: 0.0165, nom: 0.0169, max: 0.0173 }, quad: { min: 0.0171, nom: 0.0178, max: 0.0185 } },
  // 28 AWG
  { awg: 28, single: { min: 0.0133, nom: 0.0137, max: 0.0140 }, heavy: { min: 0.0141, nom: 0.0144, max: 0.0147 }, triple: { min: 0.0148, nom: 0.0152, max: 0.0156 }, quad: { min: 0.0154, nom: 0.0160, max: 0.0166 } },
  // 29 AWG
  { awg: 29, single: { min: 0.0119, nom: 0.0123, max: 0.0126 }, heavy: { min: 0.0127, nom: 0.0130, max: 0.0133 }, triple: { min: 0.0134, nom: 0.0138, max: 0.0142 }, quad: { min: 0.0140, nom: 0.0146, max: 0.0152 } },
  // 30 AWG
  { awg: 30, single: { min: 0.0106, nom: 0.0109, max: 0.0112 }, heavy: { min: 0.0113, nom: 0.0116, max: 0.0119 }, triple: { min: 0.0120, nom: 0.0124, max: 0.0128 }, quad: { min: 0.0126, nom: 0.0132, max: 0.0137 } },
  // 31 AWG
  { awg: 31, single: { min: 0.0094, nom: 0.0097, max: 0.0100 }, heavy: { min: 0.0101, nom: 0.0105, max: 0.0108 }, triple: { min: 0.0105, nom: 0.0110, max: 0.0114 }, quad: { min: 0.0114, nom: 0.0118, max: 0.0121 } },
  // 32 AWG
  { awg: 32, single: { min: 0.0085, nom: 0.0088, max: 0.0091 }, heavy: { min: 0.0091, nom: 0.0095, max: 0.0098 }, triple: { min: 0.0095, nom: 0.0099, max: 0.0103 }, quad: { min: 0.0103, nom: 0.0107, max: 0.0110 } },
  // 33 AWG
  { awg: 33, single: { min: 0.0075, nom: 0.0078, max: 0.0081 }, heavy: { min: 0.0081, nom: 0.0085, max: 0.0088 }, triple: { min: 0.0084, nom: 0.0088, max: 0.0092 }, quad: { min: 0.0092, nom: 0.0096, max: 0.0099 } },
  // 34 AWG
  { awg: 34, single: { min: 0.0067, nom: 0.0070, max: 0.0072 }, heavy: { min: 0.0072, nom: 0.0075, max: 0.0078 }, triple: { min: 0.0075, nom: 0.0079, max: 0.0082 }, quad: { min: 0.0082, nom: 0.0085, max: 0.0088 } },
  // 35 AWG
  { awg: 35, single: { min: 0.0059, nom: 0.0062, max: 0.0064 }, heavy: { min: 0.0064, nom: 0.0067, max: 0.0070 }, triple: { min: 0.0067, nom: 0.0071, max: 0.0074 }, quad: { min: 0.0073, nom: 0.0076, max: 0.0079 } },
  // 36 AWG
  { awg: 36, single: { min: 0.0053, nom: 0.0056, max: 0.0058 }, heavy: { min: 0.0057, nom: 0.0060, max: 0.0063 }, triple: { min: 0.0060, nom: 0.0064, max: 0.0067 }, quad: { min: 0.0065, nom: 0.0068, max: 0.0071 } },
  // 37 AWG
  { awg: 37, single: { min: 0.0047, nom: 0.0050, max: 0.0052 }, heavy: { min: 0.0052, nom: 0.0055, max: 0.0057 }, triple: { min: 0.0054, nom: 0.0057, max: 0.0060 }, quad: { min: 0.0060, nom: 0.0063, max: 0.0065 } },
  // 38 AWG
  { awg: 38, single: { min: 0.0042, nom: 0.0045, max: 0.0047 }, heavy: { min: 0.0046, nom: 0.0049, max: 0.0051 }, triple: { min: 0.0048, nom: 0.0051, max: 0.0054 }, quad: { min: 0.0053, nom: 0.0056, max: 0.0058 } },
  // 39 AWG
  { awg: 39, single: { min: 0.0036, nom: 0.0039, max: 0.0041 }, heavy: { min: 0.0040, nom: 0.0043, max: 0.0045 }, triple: { min: 0.0042, nom: 0.0045, max: 0.0048 }, quad: { min: 0.0046, nom: 0.0049, max: 0.0051 } },
  // 40 AWG
  { awg: 40, single: { min: 0.0032, nom: 0.0035, max: 0.0037 }, heavy: { min: 0.0036, nom: 0.0038, max: 0.0040 }, triple: { min: 0.0038, nom: 0.0041, max: 0.0043 }, quad: { min: 0.0042, nom: 0.0044, max: 0.0046 } },
  // 41 AWG
  { awg: 41, single: { min: 0.0029, nom: 0.0031, max: 0.0033 }, heavy: { min: 0.0032, nom: 0.0034, max: 0.0036 }, triple: { min: 0.0034, nom: 0.0037, max: 0.0039 }, quad: { min: 0.0037, nom: 0.0039, max: 0.0041 } },
  // 42 AWG
  { awg: 42, single: { min: 0.0026, nom: 0.0028, max: 0.0030 }, heavy: { min: 0.0028, nom: 0.0030, max: 0.0032 }, triple: { min: 0.0031, nom: 0.0033, max: 0.0035 }, quad: { min: 0.0032, nom: 0.0034, max: 0.0036 } },
  // 43 AWG
  { awg: 43, single: { min: 0.0023, nom: 0.0025, max: 0.0026 }, heavy: { min: 0.0025, nom: 0.0027, max: 0.0029 }, triple: { min: 0.0027, nom: 0.0030, max: 0.0032 }, quad: { min: 0.0029, nom: 0.0031, max: 0.0033 } },
  // 44 AWG
  { awg: 44, single: { min: 0.0021, nom: 0.0023, max: 0.0024 }, heavy: { min: 0.0023, nom: 0.0025, max: 0.0027 }, triple: { min: 0.0025, nom: 0.0027, max: 0.0029 }, quad: { min: 0.0027, nom: 0.0029, max: 0.0031 } },
  // 45-50 AWG have limited film options
  { awg: 45, single: { min: 0.00179, nom: 0.00192, max: 0.00205 }, heavy: { min: 0.00199, nom: 0.00215, max: 0.0023 }, triple: null, quad: null },
  { awg: 46, single: { min: 0.00161, nom: 0.00173, max: 0.00185 }, heavy: { min: 0.00181, nom: 0.00196, max: 0.0021 }, triple: null, quad: null },
  { awg: 47, single: { min: 0.00145, nom: 0.00157, max: 0.0017 }, heavy: { min: 0.00165, nom: 0.00178, max: 0.0019 }, triple: null, quad: null },
  { awg: 48, single: { min: 0.00129, nom: 0.0014, max: 0.0015 }, heavy: { min: 0.00139, nom: 0.00155, max: 0.0017 }, triple: null, quad: null },
  { awg: 49, single: { min: 0.00117, nom: 0.00124, max: 0.0013 }, heavy: { min: 0.00127, nom: 0.00139, max: 0.0015 }, triple: null, quad: null },
  { awg: 50, single: { min: 0.00105, nom: 0.00113, max: 0.0012 }, heavy: { min: 0.00115, nom: 0.00128, max: 0.0014 }, triple: null, quad: null },
];

// Maximum strands for single operation - Real data from Excel
export const maxStrandsData: Record<number, number> = {
  10: 0, 11: 0, 12: 0, 13: 0, 14: 1, 15: 1, 16: 1, 17: 2, 18: 2, 19: 3,
  20: 4, 21: 5, 22: 7, 23: 9, 24: 11, 25: 15, 26: 19, 27: 23, 28: 29, 29: 37,
  30: 47, 31: 60, 32: 66, 33: 66, 34: 66, 35: 66, 36: 66, 37: 66, 38: 66, 39: 66,
  40: 66, 41: 66, 42: 66, 43: 66, 44: 66, 45: 66, 46: 66, 47: 21, 48: 21, 49: 21, 50: 21
};

// Real construction tables from Excel - Type 1 (only 1-3 operations)
export const type1ConstructionTable = [
  { operations: 1, construction: 'n/##', sizeRange: '50 - 20 AWG', packingFactor: 1.155, takeUpFactor: 1.01 },
  { operations: 2, construction: 'n/n/##', sizeRange: '50 - 33 AWG', packingFactor: 1.155, takeUpFactor: 1.01 },
  { operations: 3, construction: 'n/n/n/##', sizeRange: '50 - 33 AWG', packingFactor: 1.155, takeUpFactor: 1.01 },
];

// Real construction tables from Excel - Type 2 (1-5 operations)
export const type2ConstructionTable = [
  { operations: 1, construction: 'n/##', sizeRange: '50 - 20 AWG', packingFactor: 1.155, takeUpFactor: 1.01 },
  { operations: 2, construction: '5xn/## or 3xn/##', sizeRange: '50 - 20 AWG', packingFactor: 1.236, takeUpFactor: 1.03 },
  { operations: 3, construction: '5xn/n/## or 3xn/n/##', sizeRange: '50 - 33 AWG', packingFactor: 1.236, takeUpFactor: 1.03 },
  { operations: 4, construction: '5x5xn/n/## or 5x3xn/n/##', sizeRange: '50 - 44 AWG', packingFactor: 1.271, takeUpFactor: 1.051 },
  { operations: 4, construction: 'Special case', sizeRange: '43 - 33 AWG', packingFactor: 1.363, takeUpFactor: 1.051 },
  { operations: 5, construction: '5x5x5xn/n/## or 5x5x3xn/n/##', sizeRange: '50 - 33 AWG', packingFactor: 1.363, takeUpFactor: 1.082 },
];

// Magnet wire grades - Real data from Excel
export const magnetWireGrades = [
  { grade: 'MW 79-C', code: '79' },
  { grade: 'MW 80-C', code: '80' },
  { grade: 'MW 77-C', code: '77' },
  { grade: 'MW 35-C', code: '35' },
  { grade: 'MW 16-C', code: '16' },
  { grade: 'MW 82-C', code: '82' },
  { grade: 'MW 83-C', code: '83' },
  { grade: 'Other', code: '##' },
];

// Helper functions with real data
export function getAWGSpec(awg: number): AWGSpec | undefined {
  return awgSpecs.find(spec => spec.awg === awg);
}

export function getFilmDimensions(awg: number): FilmDimensions | undefined {
  return filmDimensions.find(film => film.awg === awg);
}

export function getMaxStrands(awg: number): number {
  return maxStrandsData[awg] || 0;
}

// Excel formula: =IF(D5="","",IF(D3<26,K3,IF(D5=1,K4,IF(D5=2,K5,K6))))
// Constants: K3=1.02, K4=1.051, K5=1.071, K6=1.092
export function getTakeUpFactor(numStrands: number, operations: number): number {
  if (numStrands < 26) {
    return 1.02;
  }
  
  switch (operations) {
    case 1: return 1.051;
    case 2: return 1.071;
    default: return 1.092; // 3+ operations
  }
}

// Excel lookup using TYPE1 and TYPE2 tables with exact formulas
export function getPackingFactor(litzType: string, operations: number, awg: number): number {
  if (litzType === 'Type 1') {
    const entry = type1ConstructionTable.find(t => t.operations === operations);
    return entry?.packingFactor || 1.155; // fallback
  } else if (litzType === 'Type 2') {
    // Special case from Excel: IF(AND(D5=4,D6="TYPE 2",D4<44),1.363,VLOOKUP(...))
    if (operations === 4 && awg < 44) {
      return 1.363;
    }
    const entry = type2ConstructionTable.find(t => t.operations === operations);
    return entry?.packingFactor || 1.155; // fallback
  }
  
  return 1.155; // default fallback
}

export function getTakeUpFactorWeight(litzType: string, operations: number): number {
  if (litzType === 'Type 1') {
    const entry = type1ConstructionTable.find(t => t.operations === operations);
    return entry?.takeUpFactor || 1.01;
  } else if (litzType === 'Type 2') {
    const entry = type2ConstructionTable.find(t => t.operations === operations);
    return entry?.takeUpFactor || 1.01;
  }
  
  return 1.01; // default
}

// Calculate number of operations based on Excel formula
// =IF(H32=FALSE,"",IF(H30="N/A",IF(H26="N/A",IF(H22="N/A",IF(H18="N/A",1,2),3),4),5))
// Constants: K3=1.02, K4=1.051, K5=1.071, K6=1.092
export function calculateLitzConstruction(totalStrands: number, awg: number) {
  // Simplified version - would need full Excel logic for complete accuracy
  if (totalStrands <= getMaxStrands(awg)) {
    return { operations: 1, valid: true };
  }
  
  // For now, return a basic estimate based on strand count
  if (totalStrands <= 100) return { operations: 2, valid: true };
  if (totalStrands <= 500) return { operations: 3, valid: true };
  if (totalStrands <= 1000) return { operations: 4, valid: true };
  return { operations: 5, valid: true };
}

// Validation based on Excel constraints
export function validateConstructionLimits(
  totalStrands: number, 
  awg: number, 
  litzType: string, 
  operations: number
): { valid: boolean; message?: string } {
  // Excel formula validation logic
  const maxEnds = getMaxStrands(awg);
  
  if (awg < 32) {
    if (totalStrands > maxEnds) {
      return { valid: false, message: 'Exceeds maximum strands for AWG size' };
    }
  } else if (awg < 47) {
    if (totalStrands > 66) {
      return { valid: false, message: 'Exceeds maximum of 66 strands for AWG 32-46' };
    }
  } else if (awg < 49) {
    if (totalStrands > 24) {
      return { valid: false, message: 'Exceeds maximum of 24 strands for AWG 47-48' };
    }
  } else {
    if (totalStrands < 10 || totalStrands > 20) {
      return { valid: false, message: 'Must be between 10-20 strands for AWG 49-50' };
    }
  }
  
  // Type 1 operations limit (Excel constraint)
  if (litzType === 'Type 1' && operations > 3) {
    return { 
      valid: false, 
      message: 'CONSULT RUBADUE ENGINEERING FOR TYPE 1 LITZ CONSTRUCTIONS REQUIRING 4+ OPERATIONS.' 
    };
  }
  
  return { valid: true };
}

// Calculate dimensions using Excel formulas
export function calculateLitzDimensions(
  totalStrands: number,
  awg: number,
  packingFactor: number,
  filmType: 'single' | 'heavy' | 'triple' | 'quad'
): { min: number; nom: number; max: number } | null {
  const filmDim = getFilmDimensions(awg);
  if (!filmDim || !filmDim[filmType]) return null;
  
  const strandDims = filmDim[filmType]!;
  
  // Excel formula: =ROUND(SQRT($D$3)*E39*$D$7,3)
  // Where $D$3 = totalStrands, E39 = nominal strand OD, $D$7 = packingFactor
  const min = Math.round(Math.sqrt(totalStrands) * strandDims.min * packingFactor * 1000) / 1000;
  const nom = Math.round(Math.sqrt(totalStrands) * strandDims.nom * packingFactor * 1000) / 1000;
  const max = Math.round(Math.sqrt(totalStrands) * strandDims.max * packingFactor * 1000) / 1000;
  
  return { min, nom, max };
}

// Calculate served dimensions (nylon serve)
export function calculateServedDimensions(
  bareDimensions: { min: number; nom: number; max: number },
  serveType: 'single' | 'double'
): { min: number; nom: number; max: number } {
  const addThickness = serveType === 'single' ? 0.002 : 0.004;
  const addThicknessMax = serveType === 'single' ? 0.003 : 0.006;
  
  return {
    min: Math.round((bareDimensions.min + addThickness) * 1000) / 1000,
    nom: Math.round((bareDimensions.nom + addThickness) * 1000) / 1000,
    max: Math.round((bareDimensions.max + addThicknessMax) * 1000) / 1000,
  };
}

// Generate Rubadue part numbers using Excel formulas
export function generatePartNumber(
  totalStrands: number,
  awg: number,
  filmType: 'single' | 'heavy' | 'triple' | 'quad',
  magnetWireGrade: string,
  serveType?: 'single' | 'double'
): string {
  const filmCode = {
    single: 'S',
    heavy: 'H', 
    triple: 'T',
    quad: 'Q'
  }[filmType];
  
  const gradeCode = magnetWireGrades.find(g => g.grade === magnetWireGrade)?.code || '##';
  
  let partNumber = `RL-${totalStrands}-${awg}${filmCode}${gradeCode}`;
  
  if (serveType) {
    partNumber += serveType === 'single' ? '-SN' : '-DN';
  }
  
  partNumber += '-XX';
  
  return partNumber;
}

// Calculate DC resistance using IEC method (Excel formulas)
export function calculateDCResistance(
  totalStrands: number,
  awg: number,
  takeUpFactor: number
): { ohmsPerFt: number; ohmsPerMeter: number } {
  const awgSpec = getAWGSpec(awg);
  if (!awgSpec) return { ohmsPerFt: 0, ohmsPerMeter: 0 };
  
  // Excel formula: =((H4/D3)*H3)/1000
  // Where H4 = wire max DCR, D3 = total strands, H3 = take up factor
  const ohmsPerFt = ((awgSpec.maxDCR / totalStrands) * takeUpFactor) / 1000;
  
  // Excel formula: =H5/0.3048 (convert ft to meters)
  const ohmsPerMeter = ohmsPerFt / 0.3048;
  
  return { 
    ohmsPerFt: Math.round(ohmsPerFt * 1000000) / 1000000, // 6 decimal places
    ohmsPerMeter: Math.round(ohmsPerMeter * 1000000) / 1000000
  };
}

// Calculate total CMA and equivalent AWG
export function calculateElectricalProperties(totalStrands: number, awg: number) {
  const awgSpec = getAWGSpec(awg);
  if (!awgSpec) return { totalCMA: 0, equivalentAWG: '' };
  
  const totalCMA = awgSpec.cmaSolid * totalStrands;
  
  // Find equivalent AWG from reference table
  const awgReference = [
    { awg: 4/0, cma: 211600 }, { awg: 3/0, cma: 167800 }, { awg: 2/0, cma: 133100 }, 
    { awg: 1/0, cma: 105600 }, { awg: 1, cma: 83690 }, { awg: 2, cma: 66390 }, 
    { awg: 3, cma: 52620 }, { awg: 4, cma: 41740 }, { awg: 5, cma: 33090 }, 
    { awg: 6, cma: 26240 }, { awg: 7, cma: 20820 }, { awg: 8, cma: 16510 }, 
    { awg: 9, cma: 13090 }, { awg: 10, cma: 10380 }, { awg: 11, cma: 8230 }, 
    { awg: 12, cma: 6530 }, { awg: 13, cma: 5180 }, { awg: 14, cma: 4110 }
  ];
  
  let equivalentAWG = '';
  for (const ref of awgReference) {
    if (totalCMA >= ref.cma) {
      equivalentAWG = ref.awg.toString();
      if (ref.awg >= 1) {
        equivalentAWG += ' AWG';
      }
      break;
    }
  }
  
  return { totalCMA, equivalentAWG };
}

export function calculateLitzType(totalStrands: number, awg: number): string {
  // Simplified logic based on Excel constraints
  // Real Excel logic would need full implementation
  if (awg >= 32 && totalStrands > getMaxStrands(awg)) {
    return 'Type 2';
  }
  return 'Type 1';
}