/**
 * Derives the display category from product tags
 * Uses the first element in tags.type as the primary category
 */
export function getCategoryFromTags(tags?: {
	type?: string[];
	material?: string[];
}): string {
	if (!tags?.type || tags.type.length === 0) {
		return "Uncategorized";
	}

	// Simply use the first tag as the primary category
	return tags.type[0];
}

/**
 * Gets the category for a product, either from the category field or derived from tags
 */
export function getProductCategory(product: {
	category?: string;
	tags?: { type?: string[]; material?: string[] };
}): string {
	// Use explicit category if provided, otherwise derive from tags
	return product.category || getCategoryFromTags(product.tags);
}
