import { z } from "zod";

export const SERVE_LAYERS = [
	{ value: "SN", label: "Single Nylon serve" },
	{ value: "DN", label: "Double Nylon serve" },
] as const;

export const ENAMEL_BUILDS = [
	{ value: "S", label: "Single" },
	{ value: "H", label: "Heavy" },
	{ value: "T", label: "Triple" },
	{ value: "Q", label: "Quad" },
] as const;

export const COLOR_CODES = [
	{ value: "N", label: "Natural" },
	{ value: "B", label: "Black" },
	{ value: "R", label: "Red" },
	{ value: "G", label: "Green" },
	{ value: "Y", label: "Yellow" },
	{ value: "W", label: "White" },
] as const;

export const MAGNET_WIRE_GRADES = [
	{ value: "MW79", label: "MW79-C" },
	{ value: "MW80", label: "MW80-C" },
	{ value: "MW77", label: "MW77-C" },
	{ value: "MW35", label: "MW35-C" },
	{ value: "MW16", label: "MW16-C" },
	{ value: "MW82", label: "MW82-C" },
	{ value: "MW83", label: "MW83-C" },
] as const;

export interface LitzWireFormProps {
	onSuccess?: (partNumber: string) => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<FormValues>;
}

export interface FormValues {
	numberOfStrands: string;
	strandSize: string;
	insulation: string;
	magnetWireGrade: string;
	serveLayers?: string;
	uniqueIdentifier?: string;
}

export const formSchema = z.object({
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
