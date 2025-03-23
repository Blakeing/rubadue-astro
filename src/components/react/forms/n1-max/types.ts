import { z } from "zod";

// AWG data type definitions
export const awgData = {
	"12": 2.05232,
	"14": 1.62814,
	"16": 1.29032,
	"18": 1.02362,
	"20": 0.8128,
	"22": 0.64384,
	"24": 0.51054,
	"26": 0.40386,
	"28": 0.32004,
	"30": 0.254,
} as const;

export type AWGKey = keyof typeof awgData;
export type AWGValue = (typeof awgData)[AWGKey];

// Material data type definitions
export const materialPresets = {
	copper: {
		name: "Copper",
		permeability: 1.256665e-6,
		baseResistivity: 1.72e-8, // resistivity at room temperature (20°C)
		tempCoeff: 0.00393, // temperature coefficient of resistance for copper
	},
	aluminum: {
		name: "Aluminum",
		permeability: 1.256665e-6,
		baseResistivity: 2.82e-8,
		tempCoeff: 0.00429,
	},
	silver: {
		name: "Silver",
		permeability: 1.256665e-6,
		baseResistivity: 1.59e-8,
		tempCoeff: 0.0038,
	},
	gold: {
		name: "Gold",
		permeability: 1.256665e-6,
		baseResistivity: 2.44e-8,
		tempCoeff: 0.0034,
	},
} as const;

export type MaterialKey = keyof typeof materialPresets;
export type MaterialPreset = (typeof materialPresets)[MaterialKey];

// Temperature and length unit types
export type TemperatureUnit = "F" | "C";
export type LengthUnit = "m" | "ft";

// Form schema
export const formSchema = z.object({
	frequency: z.preprocess(
		(val) => Number(val),
		z.number().min(1, "Frequency must be greater than 0"),
	),
	permeability: z.preprocess(
		(val) => Number(val),
		z.number().min(0, "Permeability cannot be negative"),
	),
	temperature: z.preprocess(
		(val) => {
			// Handle both string and number inputs
			const num =
				typeof val === "string"
					? Number(val.split(".")[0])
					: Math.trunc(Number(val));
			return Number.isNaN(num) ? 0 : num;
		},
		z.number().int().min(-459.67, "Temperature cannot be below absolute zero"),
	),
	awg: z.string().refine((val): val is AWGKey => val in awgData),
});

export type FormValues = z.infer<typeof formSchema>;

// Results type
export interface CalculationResults {
	skinDepth: number;
	doubleSkinDepth: number;
	n1Max: number;
	resistivity: number;
}

// Calculator description
export const calculatorDescription = {
	title: "Litz Wire N1 Max Calculator",
	description: `This calculator helps determine the maximum number of strands (N1) in a bundle 
    for Litz wire construction based on skin depth. It's particularly useful for high-frequency 
    applications where skin effect becomes significant, such as in switching power supplies, 
    RF transformers, and inductive charging systems.`,
	frequencyNote: `Operating frequency of your application. Higher frequencies lead to smaller 
    skin depth and fewer allowable strands.`,
	n1MaxNote: `N1 Max represents the maximum number of strands that can be effectively utilized 
    before additional strands become ineffective due to skin effect. This is calculated as 
    (2 × skin depth) ÷ strand diameter.`,
	skinDepthNote: `Skin depth (δ) is a measure of how deeply electrical current penetrates into a conductor at high frequencies. 
    At the skin depth distance, current density decreases to 1/e (about 37%) of its surface value. 
    
    At high frequencies, current tends to flow mainly near the conductor's surface (skin effect), 
    effectively reducing the usable cross-section. This increases AC resistance compared to DC.
    
    Skin depth depends on:
    • Frequency (f): Higher frequency = smaller skin depth
    • Material properties (μ, σ): Permeability and conductivity
    
    Formula: δ = 1/√(π×f×μ×σ)`,
} as const;
