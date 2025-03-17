/**
 * Product category
 */
export const PRODUCT_CATEGORIES = {
	LITZ_WIRE: "litz-wire",
	WINDING_WIRE: "winding-wire",
	CUSTOM_CABLE: "custom-cable",
} as const;

export type ProductCategory =
	(typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES];

/**
 * Product category display names
 */
export const PRODUCT_CATEGORY_NAMES: Record<ProductCategory, string> = {
	[PRODUCT_CATEGORIES.LITZ_WIRE]: "Litz Wire",
	[PRODUCT_CATEGORIES.WINDING_WIRE]: "Winding Wire",
	[PRODUCT_CATEGORIES.CUSTOM_CABLE]: "Custom Cable",
} as const;

/**
 * Product image configuration
 */
export interface ProductImage {
	/** URL of the image */
	url: string;
	/** Alt text for the image */
	alt: string;
	/** Width of the image in pixels */
	width: number;
	/** Height of the image in pixels */
	height: number;
}

/**
 * Product specification
 */
export interface ProductSpec {
	/** Name of the specification */
	name: string;
	/** Value of the specification */
	value: string;
	/** Optional unit for the specification */
	unit?: string;
}

/**
 * Product data
 */
export interface Product {
	/** Unique identifier for the product */
	id: string;
	/** Product name */
	name: string;
	/** Product description */
	description: string;
	/** Product category */
	category: ProductCategory;
	/** Product images */
	images: ProductImage[];
	/** Product specifications */
	specs: ProductSpec[];
	/** Whether the product is featured */
	featured?: boolean;
	/** Product part number */
	partNumber?: string;
}

/**
 * Product list props
 */
export interface ProductListProps {
	/** Array of products to display */
	products: Product[];
	/** Optional category to filter by */
	category?: ProductCategory;
	/** Optional className to apply to the root element */
	className?: string;
}

/**
 * Product page props
 */
export interface ProductPageProps {
	/** Product data */
	product: Product;
	/** Optional className to apply to the root element */
	className?: string;
}

/**
 * Product image props
 */
export interface ProductImageProps {
	/** Product image data */
	image: ProductImage;
	/** Optional className to apply to the root element */
	className?: string;
	/** Optional priority loading */
	priority?: boolean;
}
