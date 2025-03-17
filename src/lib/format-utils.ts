import type { Country, JobFunction } from "@/types/forms";

/**
 * Job function display names
 */
const JOB_FUNCTION_NAMES: Record<JobFunction, string> = {
	engineering: "Engineering",
	purchasing: "Purchasing",
	management: "Management",
	other: "Other",
} as const;

/**
 * Country display names
 */
const COUNTRY_NAMES: Record<Country, string> = {
	US: "United States",
	CA: "Canada",
	MX: "Mexico",
	other: "Other",
} as const;

/**
 * Format job function for display
 * @param jobFunction - Job function to format
 * @returns Formatted job function name
 */
export function formatJobFunction(jobFunction: JobFunction): string {
	return JOB_FUNCTION_NAMES[jobFunction] ?? jobFunction;
}

/**
 * Format country for display
 * @param country - Country to format
 * @returns Formatted country name
 */
export function formatCountry(country: Country): string {
	return COUNTRY_NAMES[country] ?? country;
}
