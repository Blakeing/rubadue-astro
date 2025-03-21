import { z } from "zod";

// Phone number regex for North American format
const phoneRegex =
	/^\+?1?\s*\(?([0-9]{3})\)?[-.\s]*([0-9]{3})[-.\s]*([0-9]{4})\s*$/;

export const formSchema = z.object({
	firstName: z
		.string()
		.min(1, "First name is required")
		.max(50, "First name must be less than 50 characters"),
	lastName: z
		.string()
		.min(1, "Last name is required")
		.max(50, "Last name must be less than 50 characters"),
	email: z
		.string()
		.email("Invalid email address")
		.min(1, "Email is required")
		.max(100, "Email must be less than 100 characters"),
	phone: z.string().optional(),
	message: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export interface ContactFormProps {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<FormValues>;
}
