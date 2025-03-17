import { z } from "zod";

// Constants
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

// Type helpers
type ExtractValue<T extends readonly { value: string }[]> = T[number]["value"];

// Schema
export const formSchema = z
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
					val === "" || val === "XX" || (Number(val) >= 4 && Number(val) <= 40),
				{
					message: "AWG size must be 'XX' or a number between 4 and 40",
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
			if (val.startsWith("-")) {
				const num = Number(val.substring(1));
				return !Number.isNaN(num) && num >= 0.001 && num <= 0.25;
			}
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

export type FormValues = z.infer<typeof formSchema>;

export interface ExamplePartNumber {
	id: string;
	number: string;
	description: string;
}

export interface InsulatedWindingWirePartNumberBuilderProps {
	onSuccess?: (partNumber: string) => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<FormValues>;
}
