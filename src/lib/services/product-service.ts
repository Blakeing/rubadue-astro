import type { CollectionEntry } from "astro:content";
import type { Product, ProductData, ProductDetailData, ProductFilterContext } from "@/types/products";
import { getProductCategory } from "@/utils/category";
import { getResolvedImageSource } from "@/utils/images";

/**
 * Maps a content collection product to the standardized Product interface
 */
export async function mapCollectionProduct(
  product: CollectionEntry<"products">
): Promise<Product> {
  // Resolve the image path server-side
  const resolvedImageSrc = await getResolvedImageSource(product.data.heroImage);

  const productData: ProductData = {
    title: product.data.title,
    description: product.data.description,
    heroImage: resolvedImageSrc,
    category: getProductCategory(product.data),
    pubDate: product.data.pubDate.toISOString(),
    tableType: product.data.tableType,
    construction: product.data.construction
      ? {
          sizeRange: Array.isArray(product.data.construction.sizeRange)
            ? product.data.construction.sizeRange.join(", ")
            : product.data.construction.sizeRange,
          conductor: product.data.construction.conductor,
          insulation: product.data.construction.insulation,
          rating: product.data.construction.rating,
        }
      : undefined,
    applications: product.data.applications,
    compliances: product.data.compliances,
    systemApprovals: product.data.systemApprovals,
    tensileStrength: product.data.tensileStrength,
    breakdown: product.data.breakdown,
    overview: product.data.overview,
    tags: product.data.tags || {},
  };

  return {
    id: product.id,
    slug: product.slug,
    collection: "products" as const,
    data: productData,
  };
}

/**
 * Maps a content collection product to the ProductDetailData interface
 */
export async function mapProductForDetail(
  product: CollectionEntry<"products">
): Promise<ProductDetailData> {
  const resolvedImageSrc = await getResolvedImageSource(product.data.heroImage);

  return {
    name: product.data.title,
    description: product.data.description,
    imageSrc: resolvedImageSrc,
    imageAlt: product.data.title,
    category: getProductCategory(product.data),
    overview: product.data.overview,
    applications: product.data.applications,
    construction: product.data.construction,
    compliances: product.data.compliances,
    systemApprovals: product.data.systemApprovals,
    tensileStrength: product.data.tensileStrength,
    breakdown: product.data.breakdown,
    tags: product.data.tags,
  };
}

/**
 * Sorts products by publication date (newest first)
 */
export function sortProductsByDate(products: Product[]): Product[] {
  return products.sort(
    (a, b) =>
      new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
  );
}

/**
 * Extracts unique categories from a list of products
 */
export function extractCategories(products: Product[]): string[] {
  return [...new Set(products.map((product) => getProductCategory(product.data)))];
}

/**
 * Parses URL search parameters into a filter context
 */
export function parseFilterContext(searchParams: URLSearchParams): ProductFilterContext {
  return {
    type: searchParams.getAll("type"),
    material: searchParams.getAll("material"),
    search: searchParams.get("q") || "",
  };
}
