export function formatCountry(country: string): string {
	// Convert country code to full name
	const countryMap: Record<string, string> = {
		US: "United States",
		CA: "Canada",
		MX: "Mexico",
		// Add more country mappings as needed
	};

	return countryMap[country.toUpperCase()] || country;
}

export function formatJobFunction(jobFunction: string): string {
	// Convert job function code to full name
	const jobFunctionMap: Record<string, string> = {
		ENGINEER: "Engineer",
		PURCHASING: "Purchasing",
		SALES: "Sales",
		OTHER: "Other",
		// Add more job function mappings as needed
	};

	return jobFunctionMap[jobFunction.toUpperCase()] || jobFunction;
}
