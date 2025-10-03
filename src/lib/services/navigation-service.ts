import type { BreadcrumbSegment } from "@/types/navigation";
import { PAGE_NAME_MAP, KNOWN_MATERIALS } from "@/types/navigation";

/**
 * Generates breadcrumb segments from a pathname
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment: string, index: number, array: string[]) => {
      const href = `/${array.slice(0, index + 1).join("/")}`;
      // Use mapped name if available, otherwise convert kebab case to title case
      const name =
        PAGE_NAME_MAP[segment] ||
        segment
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      // Make "About" non-clickable since it's now a dropdown
      if (segment === "about") {
        return { name, href: "" };
      }

      return { name, href };
    });

  // Add home as first segment if not already present
  if (segments.length === 0 || segments[0].name !== "Home") {
    segments.unshift({ name: "Home", href: "/" });
  }

  return segments;
}

/**
 * Determines if breadcrumbs should be shown based on segment count
 */
export function shouldShowBreadcrumbs(segments: BreadcrumbSegment[]): boolean {
  return segments.length > 2;
}

/**
 * Builds a product filter URL from segments
 */
export function buildProductFilterUrl(segments: string[]): string {
  const params = new URLSearchParams();

  // Accumulate filters by type
  const typeFilters: string[] = [];
  const materialFilters: string[] = [];

  for (const segment of segments) {
    // Normalize segment for comparison (convert to uppercase)
    const normalizedSegment = segment.toUpperCase();

    // Check if segment is a material (case insensitive)
    const matchedMaterial = KNOWN_MATERIALS.find(
      (m) => m.toUpperCase() === normalizedSegment
    );
    if (matchedMaterial) {
      materialFilters.push(matchedMaterial);
    } else {
      typeFilters.push(segment);
    }
  }

  // Add type filters
  for (const filter of typeFilters) {
    params.append("type", filter);
  }

  // Add material filters
  for (const filter of materialFilters) {
    params.append("material", filter);
  }

  return `/products${params.toString() ? `?${params.toString()}` : ""}`;
}

/**
 * Generates product breadcrumbs with filter context
 */
export function generateProductBreadcrumbs(
  pathname: string,
  productTitle?: string
): BreadcrumbSegment[] {
  const pathSegments = pathname.split("/").filter(Boolean);

  // Start with static segments
  const segments: BreadcrumbSegment[] = [
    { name: "Home", href: "/" },
    { name: "Product", href: "/products" },
  ];

  // Add filter segments
  const appliedFilters: string[] = [];
  for (let i = 1; i < pathSegments.length - 1; i++) {
    const segment = pathSegments[i];

    // Check if this segment is a material (case insensitive)
    const normalizedSegment = segment.toUpperCase();
    const matchedMaterial = KNOWN_MATERIALS.find(
      (m) => m.toUpperCase() === normalizedSegment
    );

    // If it's a material, use the uppercase version, otherwise capitalize words
    const segmentName =
      matchedMaterial ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Add this segment as a filter
    appliedFilters.push(segmentName);

    segments.push({
      name: segmentName,
      href: buildProductFilterUrl(appliedFilters),
    });
  }

  // Add the final product segment if provided (no href for current page)
  if (productTitle) {
    segments.push({
      name: productTitle,
      href: "",
    });
  }

  return segments;
}
