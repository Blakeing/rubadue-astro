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

// Export SITE_TITLE and SITE_DESCRIPTION for backward compatibility
export const SITE_TITLE = SITE.TITLE;
export const SITE_DESCRIPTION = SITE.DESCRIPTION;

/**
 * Social media links
 */
export const SOCIAL = {
	LINKEDIN: "https://www.linkedin.com/company/rubadue-wire",
	FACEBOOK: "https://www.facebook.com/RubadueWire",
	TWITTER: "https://twitter.com/RubadueWire",
} as const;

/**
 * Contact information
 */
export const CONTACT = {
	EMAIL: "info@rubadue.com",
	PHONE: "+1 (555) 555-5555", // Replace with actual phone number
	ADDRESS: {
		STREET: "123 Main St", // Replace with actual address
		CITY: "Anytown",
		STATE: "ST",
		ZIP: "12345",
		COUNTRY: "United States",
	},
} as const;

/**
 * Navigation links
 */
export const NAV = {
	HOME: "/",
	PRODUCTS: "/products",
	ABOUT: "/about",
	CONTACT: "/contact",
	QUOTE: "/quote",
	KNOWLEDGE_BASE: "/knowledge-base",
} as const;

/**
 * Product categories
 */
export const PRODUCT_CATEGORIES = {
	LITZ_WIRE: "litz-wire",
	WINDING_WIRE: "winding-wire",
	CUSTOM_CABLE: "custom-cable",
} as const;
