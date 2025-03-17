import { z } from "zod";

/**
 * Schema for wire types
 */
export const wireTypesSchema = z
	.object({
		litzWire: z.boolean().default(false),
		windingWire: z.boolean().default(false),
		customCable: z.boolean().default(false),
	})
	.refine((data) => data.litzWire || data.windingWire || data.customCable, {
		message: "Please select at least one wire type",
	});

/**
 * Schema for the quote request form
 */
export const formSchema = z.object({
	// Personal Information
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	companyName: z.string().min(1, "Company name is required"),

	// Company Address
	streetAddress: z.string().min(1, "Street address is required"),
	addressLine2: z.string().optional(),
	city: z.string().min(1, "City is required"),
	stateProvince: z.string().min(1, "State/Province is required"),
	zipCode: z.string().min(1, "Postal code is required"),
	country: z.string().min(1, "Country is required"),

	// Job Information
	jobFunction: z.string().min(1, "Job function is required"),
	wireTypes: wireTypesSchema,
	message: z.string().min(1, "Message is required"),
});

/**
 * Type for form values
 */
export type FormValues = z.infer<typeof formSchema>;

/**
 * Type for wire types
 */
export type WireTypes = z.infer<typeof wireTypesSchema>;

/**
 * Props for the quote request form
 */
export interface QuoteRequestFormProps {
	/** Initial form values */
	initialValues?: Partial<FormValues>;
	/** Callback when form is submitted successfully */
	onSuccess?: (data: FormValues) => void;
	/** Callback when form submission fails */
	onError?: (error: unknown) => void;
	/** Additional class name for the form */
	className?: string;
}

/**
 * Available countries
 */
export const countries = [
	{ value: "us", label: "United States" },
	{ value: "ca", label: "Canada" },
	{ value: "mx", label: "Mexico" },
	{ value: "uk", label: "United Kingdom" },
	{ value: "de", label: "Germany" },
	{ value: "fr", label: "France" },
	{ value: "it", label: "Italy" },
	{ value: "es", label: "Spain" },
	{ value: "au", label: "Australia" },
	{ value: "nz", label: "New Zealand" },
	{ value: "jp", label: "Japan" },
	{ value: "kr", label: "South Korea" },
	{ value: "cn", label: "China" },
	{ value: "other", label: "Other" },
] as const;

/**
 * Available job functions
 */
export const jobFunctions = [
	{ value: "engineering", label: "Engineering" },
	{ value: "purchasing", label: "Purchasing" },
	{ value: "management", label: "Management" },
	{ value: "other", label: "Other" },
] as const;

/**
 * Available wire types
 */
export const wireTypeOptions = [
	{ id: "litzWire", label: "Litz Wire" },
	{ id: "windingWire", label: "Winding Wire" },
	{ id: "customCable", label: "Custom Cable" },
] as const;
