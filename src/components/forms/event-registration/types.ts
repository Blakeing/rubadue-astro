import { z } from "zod";

export const pcimFormSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	company: z.string().min(1, "Company name is required"),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.max(500, "Message must be less than 500 characters")
		.optional()
		.or(z.literal("")), // Allow empty string or optional
});

export type PcimFormValues = z.infer<typeof pcimFormSchema>;

export interface PcimFormProps {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<PcimFormValues>;
}
