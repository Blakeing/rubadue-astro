/**
 * Job function options
 */
export const JOB_FUNCTIONS = [
	{ value: "engineering", label: "Engineering" },
	{ value: "purchasing", label: "Purchasing" },
	{ value: "management", label: "Management" },
	{ value: "other", label: "Other" },
] as const;

export type JobFunction = (typeof JOB_FUNCTIONS)[number]["value"];

/**
 * Country options
 */
export const COUNTRIES = [
	{ value: "US", label: "United States" },
	{ value: "CA", label: "Canada" },
	{ value: "MX", label: "Mexico" },
	{ value: "UK", label: "United Kingdom" },
	{ value: "DE", label: "Germany" },
	{ value: "FR", label: "France" },
	{ value: "IT", label: "Italy" },
	{ value: "ES", label: "Spain" },
	{ value: "AU", label: "Australia" },
	{ value: "NZ", label: "New Zealand" },
	{ value: "JP", label: "Japan" },
	{ value: "KR", label: "South Korea" },
	{ value: "CN", label: "China" },
	{ value: "other", label: "Other" },
] as const;

export type Country = (typeof COUNTRIES)[number]["value"];

/**
 * Wire type options
 */
export const WIRE_TYPES = {
	LITZ_WIRE: "litzWire",
	WINDING_WIRE: "windingWire",
	CUSTOM_CABLE: "customCable",
} as const;

export type WireType = (typeof WIRE_TYPES)[keyof typeof WIRE_TYPES];

/**
 * Wire type display names
 */
export const WIRE_TYPE_NAMES: Record<WireType, string> = {
	[WIRE_TYPES.LITZ_WIRE]: "Litz Wire",
	[WIRE_TYPES.WINDING_WIRE]: "Winding Wire",
	[WIRE_TYPES.CUSTOM_CABLE]: "Custom Cable",
} as const;

/**
 * Base form data interface
 */
export interface BaseFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	message?: string;
}

/**
 * Contact form data interface
 */
export type ContactFormData = BaseFormData;

/**
 * Quote request form data interface
 */
export interface QuoteRequestData extends BaseFormData {
	companyName: string;
	streetAddress?: string;
	addressLine2?: string;
	city?: string;
	stateProvince?: string;
	zipCode?: string;
	country?: Country;
	jobFunction: JobFunction;
	wireTypes: Record<WireType, boolean>;
}

// Type definition for the PCIM Follow-up Form
export interface PcimFollowupFormData {
	firstName: string;
	lastName: string;
	email: string;
	company: string;
	message?: string; // Message is optional
}
