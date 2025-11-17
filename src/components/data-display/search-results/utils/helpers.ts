/**
 * Format a date using a consistent format
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
	try {
		const d = new Date(date);
		if (Number.isNaN(d.getTime())) {
			return "Invalid date";
		}
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return "Invalid date";
	}
}

/**
 * CSS to remove the search clear button from search inputs
 */
export const searchInputStyles = `
	[type="search"]::-webkit-search-cancel-button {
		-webkit-appearance: none;
		appearance: none;
	}
`;

