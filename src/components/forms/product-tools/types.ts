import { z } from "zod";

// === INSULATED WINDING WIRE CONSTANTS ===

export const LAYERS_OPTIONS = [
	{ value: "S", label: "Single" },
	{ value: "D", label: "Double" },
	{ value: "T", label: "Triple" },
] as const;

export const CONDUCTOR_MATERIALS = [
	{ value: "A", label: "TPC (Tin Plated Copper)" },
	{ value: "B", label: "SPC (Silver Plated Copper)" },
	{ value: "C", label: "BS (Bare Copper)" },
	{ value: "D", label: "SPA 135" },
	{ value: "E", label: "Enamel" },
	{ value: "H", label: "Heavy Enamel" },
	{ value: "L", label: "Litz Wire" },
	{ value: "N", label: "NPC (Nickel Plated Copper)" },
	{ value: "Q", label: "QPN" },
	{ value: "S", label: "Stainless Steel" },
	{ value: "custom", label: "Contact Customer Service" },
	{ value: "other", label: "Others Available" },
] as const;

export const STRANDS_OPTIONS = [
	{ value: "01", label: "Solid" },
	{ value: "07", label: "7 Strands" },
	{ value: "19", label: "19 Strands" },
	{ value: "37", label: "37 Strands" },
	{ value: "65", label: "65 Strands" },
	{ value: "custom", label: "Custom (Enter number)" },
] as const;

export const INSULATION_TYPES = [
	{ value: "F", label: "FEP" },
	{ value: "P", label: "PFA" },
	{ value: "T", label: "ETFE" },
] as const;

export const COLOR_CODES = [
	{ value: "0", label: "Black" },
	{ value: "1", label: "Brown" },
	{ value: "2", label: "Red" },
	{ value: "3", label: "Orange" },
	{ value: "4", label: "Yellow" },
	{ value: "5", label: "Green" },
	{ value: "6", label: "Blue" },
	{ value: "7", label: "Violet" },
	{ value: "8", label: "Gray" },
	{ value: "9", label: "White" },
	{ value: "C", label: "Clear" },
] as const;

export const THICKNESS_OPTIONS = [
	{ value: "-1", label: '.001"/layer' },
	{ value: "-1.5", label: '.0015"/layer' },
	{ value: "-2", label: '.002"/layer' },
	{ value: "-3", label: '.003"/layer' },
	{ value: "-5", label: '.005"/layer' },
	{ value: "other", label: "Other" },
] as const;

export const MAGNET_WIRE_GRADES = [
	{ value: "MW79", label: "MW79" },
	{ value: "MW80", label: "MW80" },
	{ value: "MW77", label: "MW77" },
	{ value: "MW82", label: "MW82" },
	{ value: "MW83", label: "MW83" },
	{ value: "MW35", label: "MW35" },
	{ value: "MW16", label: "MW16" },
] as const;

// === LITZ WIRE CONSTANTS ===

export const SERVE_LAYERS = [
	{ value: "none", label: "None" },
	{ value: "SN", label: "Single Nylon serve" },
	{ value: "DN", label: "Double Nylon serve" },
] as const;

export const ENAMEL_BUILDS = [
	{ value: "S", label: "Single" },
	{ value: "H", label: "Heavy" },
	{ value: "T", label: "Triple" },
	{ value: "Q", label: "Quad" },
] as const;

// === N1 MAX CALCULATOR CONSTANTS ===

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
type MaterialPreset = (typeof materialPresets)[MaterialKey];

// Temperature and length unit types
export type TemperatureUnit = "F" | "C";
type LengthUnit = "m" | "ft";

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

// === TYPE INTERFACES ===

export interface InsulatedWindingWirePartNumberBuilderProps {
	onSuccess?: (partNumber: string) => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<InsulatedWireFormValues>;
}

export interface LitzWireFormProps {
	onSuccess?: (partNumber: string) => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<LitzWireFormValues>;
}

// === FORM VALUES INTERFACES ===

export interface InsulatedWireFormValues {
	layers: string;
	conductor: string;
	awgSize: string;
	strands: string;
	magnetWireSize?: string;
	insulation: string;
	color: string;
	thickness: string;
	magnetWireGrade?: string;
}

export interface LitzWireFormValues {
	numberOfStrands: string;
	strandSize: string;
	insulation: string;
	magnetWireGrade: string;
	serveLayers?: string;
	uniqueIdentifier?: string;
}

// === FORM SCHEMAS ===

// Insulated Wire Form Schema
export const insulatedWireFormSchema = z
	.object({
		layers: z.enum(
			[...LAYERS_OPTIONS.map((o) => o.value)] as [string, ...string[]],
			{
				required_error: "Please select the number of layers",
			},
		),
		conductor: z.enum(
			[...CONDUCTOR_MATERIALS.map((o) => o.value)] as [string, ...string[]],
			{
				required_error: "Please select the conductor material",
			},
		),
		awgSize: z
			.string()
			.refine(
				(val) =>
					val === "" || val === "XX" || (Number(val) >= 4 && Number(val) <= 50),
				{
					message: "AWG size must be 'XX' or a number between 4 and 50",
				},
			),
		strands: z
			.string()
			.min(1, "Please select or enter the number of strands")
			.refine((val) => {
				if (STRANDS_OPTIONS.some((o) => o.value === val)) return true;
				const num = Number(val);
				return !Number.isNaN(num) && num > 0 && Number.isInteger(num);
			}, "Must be a valid strand option or a positive whole number"),
		magnetWireSize: z
			.string()
			.refine((val) => val === "" || (Number(val) >= 12 && Number(val) <= 50), {
				message: "Magnet wire size must be between 12 and 50 AWG",
			}),
		insulation: z.enum(
			[...INSULATION_TYPES.map((o) => o.value)] as [string, ...string[]],
			{
				required_error: "Please select the insulation type",
			},
		),
		color: z.enum(
			[...COLOR_CODES.map((o) => o.value)] as [string, ...string[]],
			{
				required_error: "Please select the color",
			},
		),
		thickness: z.string().refine((val) => {
			if (val === "") return true;
			if (THICKNESS_OPTIONS.some((o) => o.value === val)) return true;

			// Handle values with dash prefix (display values)
			if (val.startsWith("-")) {
				const num = Number(val.substring(1));
				if (!Number.isNaN(num) && num >= 1 && num <= 250) return true;
			}

			// Handle original input values (0.001-0.25)
			const num = Number(val);
			if (!Number.isNaN(num) && num >= 0.001 && num <= 0.25) return true;

			return false;
		}, "Thickness must be a valid option or between 0.001 and 0.250"),
		magnetWireGrade: z
			.enum([...MAGNET_WIRE_GRADES.map((o) => o.value)] as [
				string,
				...string[],
			])
			.optional(),
	})
	.refine(
		(data) => {
			// Validate AWG size for non-Litz wire
			if (data.conductor !== "L") {
				if (!data.awgSize || data.awgSize === "") return false;
				if (data.awgSize === "XX") return true;
				const num = Number(data.awgSize);
				return !Number.isNaN(num) && num >= 4 && num <= 40;
			}

			// Validate magnet wire size and grade for Litz wire
			if (data.conductor === "L") {
				if (!data.magnetWireSize || !data.magnetWireGrade) return false;
				const num = Number(data.magnetWireSize);
				return !Number.isNaN(num) && num >= 12 && num <= 50;
			}

			return true;
		},
		{
			message: "Please check all required fields",
			path: ["_errors"],
		},
	);

// Litz Wire Form Schema
export const litzWireFormSchema = z.object({
	numberOfStrands: z
		.string()
		.min(1, "Number of strands is required")
		.refine(
			(value) => {
				const num = Number(value);
				return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
			},
			{ message: "Number of strands must be a whole number greater than 0" },
		),
	strandSize: z
		.string()
		.min(1, "Strand size is required")
		.refine(
			(value) => {
				const size = Number(value);
				return (
					!Number.isNaN(size) &&
					Number.isInteger(size) &&
					size >= 12 &&
					size <= 50
				);
			},
			{ message: "Strand size must be a whole number between 12 and 50" },
		),
	insulation: z.string().min(1, "Enamel build is required"),
	magnetWireGrade: z.string().min(1, "Magnet wire grade is required"),
	serveLayers: z.string().optional(),
	uniqueIdentifier: z.string().optional(),
});

// Additional type exports for backwards compatibility
type InsulatedWireFormData = z.infer<typeof insulatedWireFormSchema>;
type LitzWireFormData = z.infer<typeof litzWireFormSchema>;
