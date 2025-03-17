import { z } from "zod";

export const CONDUCTOR_MATERIALS = [
	{ value: "C", label: "Copper" },
	{ value: "T", label: "Tinned Copper" },
	{ value: "S", label: "Silver" },
] as const;

export const INSULATION_TYPES = [
	{ value: "H", label: "Heavy" },
	{ value: "S", label: "Single" },
	{ value: "D", label: "Double" },
	{ value: "T", label: "Triple" },
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
	{ value: "1", label: "Grade 1" },
	{ value: "2", label: "Grade 2" },
	{ value: "3", label: "Grade 3" },
] as const;

export const formSchema = z.object({
	conductor: z.string().min(1, "Conductor material is required"),
	magnetWireSize: z
		.string()
		.min(1, "Magnet wire size is required")
		.refine(
			(value) => {
				const size = Number(value);
				return !Number.isNaN(size) && size >= 12 && size <= 50;
			},
			{ message: "Magnet wire size must be between 12 and 50" },
		),
	strands: z
		.string()
		.min(1, "Number of strands is required")
		.refine(
			(value) => {
				const num = Number(value);
				return !Number.isNaN(num) && num > 0;
			},
			{ message: "Number of strands must be greater than 0" },
		),
	insulation: z.string().min(1, "Insulation type is required"),
	color: z.string().min(1, "Color code is required"),
	magnetWireGrade: z.string().min(1, "Magnet wire grade is required"),
});

export type FormValues = z.infer<typeof formSchema>;

export interface LitzWireFormProps {
	onSuccess?: (partNumber: string) => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<FormValues>;
}
