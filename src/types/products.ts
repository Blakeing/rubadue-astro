import type { ImageMetadata } from "astro";

// Base product construction interface
export interface ProductConstruction {
  sizeRange?: string | string[];
  conductor?: string;
  insulation?: string;
  rating?: {
    temperature?: string;
    voltage?: string[];
  };
  numberWires?: string;
  coatings?: string[];
}

// Product tags for filtering
export type FilterCategory = "type" | "material";
export type ProductTags = {
  [K in FilterCategory]?: string[];
};

// Core product data interface (from content collections)
export interface ProductData {
  title: string;
  description: string;
  heroImage?: string;
  category?: string;
  pubDate: string;
  tableType?: "litzWire" | "magnet" | "doubleInsulated" | "custom";
  construction?: ProductConstruction;
  applications?: string[];
  compliances?: string[];
  systemApprovals?: string[];
  tensileStrength?: string;
  breakdown?: string;
  overview?: string;
  // Keep legacy specifications for backward compatibility
  specifications?: {
    conductor?: string;
    insulation?: string;
    temperature?: string;
    voltage?: string;
    tensileStrength?: string;
  };
  tags?: ProductTags;
}

// Product with collection metadata
export interface Product {
  id: string;
  slug: string;
  collection: string;
  data: ProductData;
}

// Product detail page interface
export interface ProductDetailData {
  name: string;
  version?: { name: string; date: string; datetime: string };
  price?: string;
  description: string;
  highlights?: string[];
  imageSrc: string | ImageMetadata;
  imageAlt: string;
  construction?: ProductConstruction;
  compliances?: string[];
  systemApprovals?: string[];
  category: string;
  overview?: string;
  applications?: string[];
  tensileStrength?: string;
  breakdown?: string;
  tags?: ProductTags;
}

// Filter context for product pages
export interface ProductFilterContext {
  type: string[];
  material: string[];
  search: string;
}

// Product listing props
export interface ProductListingProps {
  products: Product[];
  categories: string[];
  initialFilters: ProductFilterContext;
}

// Product detail props
export interface ProductDetailProps {
  product: ProductDetailData;
  filterContext?: ProductFilterContext;
  license?: {
    href: string;
    summary: string;
    content: string;
  };
}
