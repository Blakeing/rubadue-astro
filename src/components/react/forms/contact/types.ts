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
	phone: z
		.string()
		.min(1, "Phone number is required")
		.regex(
			phoneRegex,
			"Please enter a valid phone number (e.g. +1 (555) 000-0000)",
		)
		.transform((val) => {
			// Extract digits and format consistently
			const digits = val.replace(/\D/g, "");
			return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
		}),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.max(1000, "Message must be less than 1000 characters"),
});

export type FormValues = z.infer<typeof formSchema>;

export interface ContactFormProps {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	initialValues?: Partial<FormValues>;
}
