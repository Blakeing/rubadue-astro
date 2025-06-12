import { defineCollection, z } from "astro:content";

const knowledgeBase = defineCollection({
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

const products = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		category: z.string().optional(),
		overview: z.string().optional(),
		applications: z.array(z.string()).optional(),
		construction: z
			.object({
				numberWires: z.string().optional(),
				coatings: z.array(z.string()).optional(),
				sizeRange: z.union([z.string(), z.array(z.string())]).optional(),
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
		compliances: z.array(z.string()).optional(),
		systemApprovals: z.array(z.string()).optional(),
		tensileStrength: z.string().optional(),
		breakdown: z.string().optional(),
		tableType: z
			.enum(["litzWire", "magnet", "doubleInsulated", "custom"])
			.optional(),
		tags: z
			.object({
				type: z.array(z.string()).optional(),
				material: z.array(z.string()).optional(),
			})
			.optional(),
	}),
});

// Export a single `collections` object to register your collections
export const collections = {
	knowledgeBase,
	products,
};
