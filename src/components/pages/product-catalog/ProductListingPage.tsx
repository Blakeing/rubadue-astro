import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";

import { navigate } from "astro:transitions/client";
import defaultHeroImage from "@/assets/backgrounds/rubadue-hero.webp";
import { SearchPagination } from "@/components/data-display/search-results/components/SearchPagination";
import ProductImage from "@/components/sections/product-showcase/ProductImage";
import { Card } from "@/components/ui/card";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { getProductCategory } from "@/utils/category";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export type FilterCategory = "type" | "material";

export type ProductTags = {
	[K in FilterCategory]?: string[];
};

export interface ProductData {
	title: string;
	description: string;
	heroImage?: string;
	category?: string;
	pubDate: string;
	tableType?: "litzWire" | "magnet" | "doubleInsulated" | "custom";
	construction?: {
		sizeRange?: string;
		conductor?: string;
		insulation?: string;
		rating?: {
			temperature?: string;
			voltage?: string[];
		};
	};
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

export interface Product {
	id: string;
	slug: string;
	collection: string;
	data: ProductData;
}

interface FilterOption {
	label: string;
	value: string;
}

type Filters = {
	[K in FilterCategory]: FilterOption[];
};

const filters: Filters = {
	type: [
		{ label: "Litz Wire", value: "Litz Wire" },
		{ label: "Single Insulated", value: "Single Insulated" },
		{ label: "Double Insulated", value: "Double Insulated" },
		{ label: "Triple Insulated", value: "Triple Insulated" },
	],
	material: [
		{ label: "ETFE", value: "ETFE" },
		{ label: "FEP", value: "FEP" },
		{ label: "PFA", value: "PFA" },
		{ label: "TCA", value: "TCA" },
	],
	// specs: [
	// 	{ label: "155°C", value: "155°C" },
	// 	{ label: "1000V", value: "1000V" },
	// ],
	// certifications: [
	// 	{ label: "UL", value: "UL" },
	// 	{ label: "VDE", value: "VDE" },
	// 	{ label: "RoHS", value: "RoHS" },
	// ],
};

type ActiveFilters = {
	[K in FilterCategory]: string[];
};

interface ProductListingPageProps {
	products: Product[];
	categories: string[];
	initialFilters?: {
		type: string[];
		material: string[];
		search: string;
	};
}

const ITEMS_PER_PAGE = 9; // Number of products per page

// Add mapping function for legacy categories
function getCategoryFromCollection(collection: string): string {
	const categoryMap: Record<string, string> = {
		"litz-wire": "Litz Wire",
		"single-insulated": "Single Insulated",
		"double-insulated": "Double Insulated",
		"triple-insulated": "Triple Insulated",
	};

	return categoryMap[collection] || collection;
}

export default function ProductListingPage({
	products,
	categories,
	initialFilters = {
		type: [],
		material: [],
		search: "",
	},
}: ProductListingPageProps) {
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState(initialFilters.search);
	const [currentPage, setCurrentPage] = useState(1);
	const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
		type: initialFilters.type,
		material: initialFilters.material,
	});

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();

		// Add type filters
		for (const type of activeFilters.type) {
			params.append("type", type);
		}

		// Add material filters
		for (const material of activeFilters.material) {
			params.append("material", material);
		}

		// Add search query if exists
		if (searchQuery) {
			params.set("q", searchQuery);
		}

		// Update URL without reloading the page
		const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
		window.history.replaceState({}, "", newUrl);
	}, [activeFilters, searchQuery]);

	// Clear all filters
	const clearFilters = () => {
		setActiveFilters({
			type: [],
			material: [],
		});
		setSearchQuery("");
		setCurrentPage(1);
	};

	// Filter products based on active filters and search query
	const filteredProducts = products.filter((product) => {
		// Search filter
		const searchLower = searchQuery.toLowerCase();
		const matchesSearch =
			searchQuery === "" ||
			product.data.title.toLowerCase().includes(searchLower) ||
			product.data.description.toLowerCase().includes(searchLower) ||
			(product.data.tags?.type?.some((tag) =>
				tag.toLowerCase().includes(searchLower),
			) ??
				false) ||
			(product.data.tags?.material?.some((tag) =>
				tag.toLowerCase().includes(searchLower),
			) ??
				false);

		if (!matchesSearch) return false;

		const productTags = product.data.tags;
		if (!productTags) {
			return searchQuery === ""; // Only include untagged products if no search query
		}

		// Get active filter categories
		const activeFilterCategories = Object.entries(activeFilters)
			.filter(([_, selectedTags]) => selectedTags.length > 0)
			.map(([category]) => category as FilterCategory);

		// If no filters are active, show all products that match search
		if (activeFilterCategories.length === 0) return true;

		// Product must match ALL selected tags in ALL active categories
		return activeFilterCategories.every((category) => {
			const selectedTags = activeFilters[category];
			const productCategoryTags = productTags[category];

			if (!productCategoryTags) {
				return false;
			}

			return selectedTags.every((tag) => productCategoryTags.includes(tag));
		});
	});

	// Pagination
	const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Toggle filter handler
	const toggleFilter = (category: FilterCategory, value: string) => {
		setCurrentPage(1); // Reset to first page when filter changes

		// Get the list of known materials
		const knownMaterials = filters.material.map((m) => m.value);

		// Determine the actual category based on whether the value is a known material
		const actualCategory = knownMaterials.includes(value)
			? "material"
			: category;

		setActiveFilters((prev) => {
			const currentFilters = prev[actualCategory];
			return {
				...prev,
				[actualCategory]: currentFilters.includes(value)
					? currentFilters.filter((v: string) => v !== value)
					: [...currentFilters, value],
			};
		});
	};

	// Update the search input onChange handler
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1);
	};

	return (
		<div className="bg-background">
			<div>
				{/* Mobile filter dialog */}
				<Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-4 w-4"
								aria-hidden="true"
							>
								<title>Filter icon</title>
								<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
							</svg>
							<span className="text-sm">Filters</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0">
						<div className="flex h-full w-full flex-col">
							<SheetHeader className="flex-none border-b p-6 text-left">
								<SheetTitle className="text-lg">Filters</SheetTitle>
								<SheetDescription className="text-sm">
									Filter products by type and material. Select multiple options
									to narrow down your search.
								</SheetDescription>
							</SheetHeader>

							<div className="flex-1 overflow-y-auto">
								<div className="divide-y divide-border">
									<div className="p-6">
										<form>
											{Object.entries(filters).map(([filterName, options]) => (
												<div key={filterName} className="pb-6">
													<h3 className="mb-4 font-medium capitalize">
														{filterName}
													</h3>
													<div className="space-y-4">
														{options.map((option) => {
															const inputId = `mobile-filter-${filterName}-${option.value}`;
															return (
																<div
																	key={option.value}
																	className="flex items-center gap-2"
																>
																	<Checkbox
																		id={inputId}
																		checked={activeFilters[
																			filterName as FilterCategory
																		].includes(option.value)}
																		onCheckedChange={() =>
																			toggleFilter(
																				filterName as FilterCategory,
																				option.value,
																			)
																		}
																	/>
																	<label
																		htmlFor={inputId}
																		className="text-sm text-foreground"
																	>
																		{option.label}
																	</label>
																</div>
															);
														})}
													</div>
												</div>
											))}
										</form>
									</div>
								</div>
							</div>

							<SheetFooter className="flex-none border-t p-6">
								<div className="flex justify-start gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											clearFilters();
											setMobileFiltersOpen(false);
										}}
									>
										Clear all
									</Button>
									<Button size="sm" onClick={() => setMobileFiltersOpen(false)}>
										Apply filters
									</Button>
								</div>
							</SheetFooter>
						</div>
					</SheetContent>
				</Sheet>

				<section
					aria-labelledby="products-heading"
					className="pb-12 sm:pb-16 md:pb-24 pt-6 sm:pt-10 md:pt-12"
				>
					<h2 id="products-heading" className="sr-only">
						Products
					</h2>

					<div className="relative grid grid-cols-1 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:grid-cols-12">
						{/* Filters */}
						<aside className="hidden lg:block lg:col-span-3">
							<div className="lg:sticky lg:top-40">
								<div className="border-b border-muted pb-6">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-medium">Filter Products</h3>
										<Button
											variant="ghost"
											size="sm"
											onClick={clearFilters}
											className="text-sm text-muted-foreground hover:text-foreground"
										>
											Clear all
										</Button>
									</div>
									{/* Search input */}
									<div className="mt-4">
										<div className="relative">
											<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												placeholder="Search products..."
												value={searchQuery}
												onChange={handleSearchChange}
												className="pl-8"
											/>
										</div>
									</div>
								</div>

								{Object.entries(filters).map(([category, options]) => (
									<div key={category} className="border-b border-muted py-6">
										<h3 className="text-sm font-medium capitalize">
											{category}
										</h3>
										<div className="mt-4 space-y-4">
											{options.map((option) => {
												const inputId = `filter-${category}-${option.value}`;
												return (
													<div key={option.value} className="flex items-center">
														<Checkbox
															id={inputId}
															checked={activeFilters[
																category as FilterCategory
															].includes(option.value)}
															onCheckedChange={() =>
																toggleFilter(
																	category as FilterCategory,
																	option.value,
																)
															}
														/>
														<label
															htmlFor={inputId}
															className="ml-3 text-sm text-foreground"
														>
															{option.label}
														</label>
													</div>
												);
											})}
										</div>
									</div>
								))}

								<div className="mt-6 space-y-3 sm:space-y-4">
									<h2 className="text-base font-semibold">
										Cant find what you need?
									</h2>
									<p className="text-xs text-muted-foreground">
										Create custom specifications with our interactive part
										number builders.
									</p>
									<Button
										asChild
										size="sm"
										className="w-full sm:w-auto text-xs"
									>
										<a href="/part-number-builders">Get Started</a>
									</Button>
								</div>
							</div>
						</aside>

						{/* Product grid */}
						<div className="lg:col-span-9">
							{/* Mobile search and filter controls */}
							<div className="mb-4 flex items-center justify-between lg:hidden">
								<div className="relative flex-1 mr-2">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search products..."
										value={searchQuery}
										onChange={handleSearchChange}
										className="pl-8 text-sm"
									/>
								</div>
							</div>

							{/* Results count */}
							{/* <div className="mb-4 flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									Showing {paginatedProducts.length} of{" "}
									{filteredProducts.length} products
								</p>
							</div> */}

							<div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6">
								{paginatedProducts.map((product) => (
									<a
										key={product.slug}
										href={`/catalog/${product.slug}`}
										className="group relative"
									>
										<div className="aspect-square w-full shadow overflow-hidden rounded-lg bg-accent/25">
											<ProductImage
												src={product.data.heroImage || defaultHeroImage.src}
												alt={product.data.title}
												className="h-full w-full object-contain"
											/>
										</div>
										<div className="mt-3 flex justify-between">
											<div>
												<h3 className="text-sm sm:text-base font-medium">
													<span
														aria-hidden="true"
														className="absolute inset-0"
													/>
													{product.data.title}
												</h3>
												<p className="mt-1 text-xs sm:text-sm text-muted-foreground">
													{getProductCategory(product.data)}
												</p>
											</div>
										</div>
									</a>
								))}
							</div>

							{/* Updated Pagination */}
							{totalPages > 1 && (
								<div className="mt-6 sm:mt-8">
									<SearchPagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
