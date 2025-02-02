import { defineCollection, z } from "astro:content";

const products = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.string().optional(),
      specifications: z
        .object({
          conductor: z.string().optional(),
          insulation: z.string().optional(),
          temperature: z.string().optional(),
          voltage: z.string().optional(),
          tensileStrength: z.string().optional(),
        })
        .optional(),
      compliances: z.array(z.string()).optional(),
      systemApprovals: z.array(z.string()).optional(),
      category: z.string(),
      tableType: z.enum(["litzWire", "magnet", "custom"]).optional(),
      reviews: z
        .object({
          average: z.number(),
          featured: z.array(
            z.object({
              id: z.number(),
              rating: z.number(),
              content: z.string(),
              date: z.string(),
              datetime: z.string(),
              author: z.string(),
              avatarSrc: z.string(),
            })
          ),
        })
        .optional(),
      faqs: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          })
        )
        .optional(),
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
