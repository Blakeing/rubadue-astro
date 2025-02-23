import { defineCollection, z } from "astro:content";

const products = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			seoTitle: z.string().optional(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.string().optional(),

			// Categories and Tags
			categories: z.array(z.string()).optional(),
			category: z.string(), // Legacy
			tags: z
				.object({
					type: z.array(z.string()).optional(), // e.g., ["Litz Wire", "Triple Insulated"]
					material: z.array(z.string()).optional(), // e.g., ["ETFE", "Copper"]
					specs: z.array(z.string()).optional(), // e.g., ["155°C", "1000V"]
					applications: z.array(z.string()).optional(), // e.g., ["Transformers", "Medical"]
					certifications: z.array(z.string()).optional(), // e.g., ["UL", "VDE"]
				})
				.optional(),
			tableType: z
				.enum(["litzWire", "magnet", "doubleInsulated", "custom"])
				.optional(),

			// Product Construction
			construction: z
				.object({
					numberWires: z.string().optional(),
					coatings: z.array(z.string()).optional(),
					sizeRange: z.string().optional(),
					conductor: z.string().optional(),
					insulation: z.string().optional(),
					rating: z
						.object({
							temperature: z.string().optional(),
							voltage: z.array(z.string()).optional(),
						})
						.optional(),
				})
				.optional(),

			// Technical Specifications
			specifications: z
				.object({
					temperature: z.string().optional(),
					voltage: z.string().optional(),
				})
				.optional(),

			// Applications and Overview
			overview: z.string().optional(),
			applications: z.array(z.string()).optional(),

			// Compliance and Certifications
			compliances: z.array(z.string()).optional(),
			systemApprovals: z.array(z.string()).optional(),
			tensileStrength: z.string().optional(),

			// Optional Documentation
			license: z
				.object({
					href: z.string(),
					summary: z.string(),
					content: z.string(),
				})
				.optional(),
		}),
});

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

// Export a single `collections` object to register your collections
export { products, blog };
export const collections = {
	products,
	blog,
};
