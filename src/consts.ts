// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

/**
 * Site metadata
 */
export const SITE = {
	TITLE: "Rubadue Wire",
	DESCRIPTION: "Top Custom Electrical Wire and Cables",
	DOMAIN: "rubadue.com",
	URL: "https://rubadue.com",
	LOGO_URL: "https://rubadue.com/static/text-logo.svg",
	LOGO_ALT: "Rubadue Wire Logo",
} as const;

// Export SITE_TITLE for backward compatibility
export const SITE_TITLE = SITE.TITLE;

/**
 * Contact information
 */
export const CONTACT = {
	EMAIL: "info@rubadue.com",
	PHONE: "+1 (555) 555-5555", // TODO: Replace with actual phone number
	ADDRESS: {
		STREET: "123 Main St", // TODO: Replace with actual address
		CITY: "Anytown",
		STATE: "ST",
		ZIP: "12345",
		COUNTRY: "United States",
	},
} as const;

