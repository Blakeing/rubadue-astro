import { COUNTRIES, JOB_FUNCTIONS } from "@/types/forms";
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

// Create literal types for the enums
const countryValues = COUNTRIES.map((c) => c.value);
const jobFunctionValues = JOB_FUNCTIONS.map((j) => j.value);

/**
 * Schema for the quote request form
 */
export const formSchema = z.object({
	// Personal Information
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	phone: z.string().optional(),
	companyName: z.string().min(1, "Company name is required"),

	// Company Address
	streetAddress: z.string().optional(),
	addressLine2: z.string().optional(),
	city: z.string().optional(),
	stateProvince: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.enum(countryValues as [string, ...string[]]).optional(),

	// Job Information
	jobFunction: z.enum(jobFunctionValues as [string, ...string[]], {
		required_error: "Job function is required",
		invalid_type_error: "Please select a valid job function",
	}),
	wireTypes: z
		.object({
			litzWire: z.boolean().default(false),
			windingWire: z.boolean().default(false),
			customCable: z.boolean().default(false),
		})
		.refine((data) => data.litzWire || data.windingWire || data.customCable, {
			message: "Please select at least one wire type",
			path: ["root"],
		}),
	message: z.string().optional(),
	
	// Part Number (optional, pre-populated from part number builder)
	partNumber: z.string().optional(),
});

/**
 * Type for form values
 */
export type FormValues = z.infer<typeof formSchema>;

/**
 * Type for wire types
 */
type WireTypes = z.infer<typeof wireTypesSchema>;

/**
 * Props for the quote request form
 */
export interface QuoteRequestFormProps {
	/** Initial form values */
	initialValues?: Partial<FormValues>;
	/** Callback when form is submitted successfully */
	onSuccess?: (data: FormValues) => void;
	/** Callback when form submission fails */
	onError?: (error: Error | string) => void;
	/** Additional class name for the form */
	className?: string;
}

/**
 * Available countries for the form select
 */
export const countries = COUNTRIES;

/**
 * Available job functions for the form select
 */
export const jobFunctions = JOB_FUNCTIONS;

/**
 * Available wire types
 */
export const wireTypeOptions = [
	{ id: "litzWire", label: "Litz Wire" },
	{ id: "windingWire", label: "Insulated Winding Wire" },
	{ id: "customCable", label: "Custom Cable" },
] as const;
