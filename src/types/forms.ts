/**
 * Job function options
 */
export const JOB_FUNCTIONS = {
	ENGINEERING: "engineering",
	PURCHASING: "purchasing",
	MANAGEMENT: "management",
	OTHER: "other",
} as const;

export type JobFunction = (typeof JOB_FUNCTIONS)[keyof typeof JOB_FUNCTIONS];

/**
 * Country options
 */
export const COUNTRIES = {
	US: "US",
	CA: "CA",
	MX: "MX",
	OTHER: "other",
} as const;

export type Country = (typeof COUNTRIES)[keyof typeof COUNTRIES];

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
	phone: string;
	message: string;
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
	streetAddress: string;
	addressLine2?: string;
	city: string;
	stateProvince: string;
	zipCode: string;
	country: Country;
	jobFunction: JobFunction;
	wireTypes: Record<WireType, boolean>;
}
