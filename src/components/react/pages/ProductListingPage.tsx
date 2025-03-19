import {
	Button,
	Checkbox,
	Input,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	ScrollArea,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/react/ui";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

type FilterCategory = "type" | "material";

type ProductTags = {
	[K in FilterCategory]?: string[];
};

interface ProductData {
	title: string;
	description: string;
	heroImage?: string;
	category: string;
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

interface Product {
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
		{ label: "Double Insulated", value: "Double Insulated" },
		{ label: "Triple Insulated", value: "Triple Insulated" },
		{ label: "Single Insulated", value: "Single Insulated" },
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

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

// Function to generate pagination items
function generatePaginationItems(currentPage: number, totalPages: number) {
	const items: (number | "ellipsis")[] = [];
	const maxVisiblePages = 5;

	if (totalPages <= maxVisiblePages) {
		// Show all pages if total pages is less than or equal to max visible pages
		for (let i = 1; i <= totalPages; i++) {
			items.push(i);
		}
	} else {
		// Always show first page
		items.push(1);

		if (currentPage <= 3) {
			// If current page is near the start
			items.push(2, 3, 4);
			items.push("ellipsis");
			items.push(totalPages);
		} else if (currentPage >= totalPages - 2) {
			// If current page is near the end
			items.push("ellipsis");
			items.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
		} else {
			// If current page is in the middle
			items.push("ellipsis");
			items.push(currentPage - 1, currentPage, currentPage + 1);
			items.push("ellipsis");
			items.push(totalPages);
		}
	}

	return items;
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
							className="mr-2 flex items-center gap-1 lg:hidden"
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
							Filters
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="flex h-full flex-col">
						<SheetHeader>
							<SheetTitle>Filters</SheetTitle>
						</SheetHeader>

						<ScrollArea className="px-4">
							<form className="mt-4">
								{Object.entries(filters).map(([filterName, options]) => (
									<div key={filterName} className="border-b border-muted pb-6">
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
															className="text-sm text-muted-foreground"
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
							<div className="mt-6 flex justify-between">
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
						</ScrollArea>
					</SheetContent>
				</Sheet>

				<section
					aria-labelledby="products-heading"
					className="pb-12 sm:pb-16 md:pb-24 pt-6 sm:pt-10 md:pt-16"
				>
					<h2 id="products-heading" className="sr-only">
						Products
					</h2>

					<div className="grid grid-cols-1 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:grid-cols-4">
						{/* Filters */}
						<div className="hidden lg:block">
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
									<h3 className="text-sm font-medium capitalize">{category}</h3>
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
						</div>

						{/* Product grid */}
						<div className="lg:col-span-3">
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
							<div className="mb-4 flex items-center justify-end h-9">
								<p className="text-sm text-muted-foreground">
									Showing {paginatedProducts.length} of{" "}
									{filteredProducts.length} products
								</p>
							</div>

							<div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6">
								{paginatedProducts.map((product) => (
									<a
										key={product.slug}
										href={`/catalog/${product.slug}`}
										className="group relative"
									>
										<div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
											<img
												src={product.data.heroImage || "/rubadue-hero.webp"}
												alt={product.data.title}
												className="h-full w-full object-contain object-center group-hover:opacity-75"
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
													{product.data.category}
												</p>
											</div>
										</div>
									</a>
								))}
							</div>

							{/* Updated Pagination */}
							{totalPages > 1 && (
								<Pagination className="mt-6 sm:mt-8">
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handlePageChange(currentPage - 1);
												}}
												className={
													currentPage === 1
														? "pointer-events-none opacity-50"
														: ""
												}
											/>
										</PaginationItem>

										{generatePaginationItems(currentPage, totalPages).map(
											(item, index) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												<PaginationItem key={index}>
													{item === "ellipsis" ? (
														<PaginationEllipsis />
													) : (
														<PaginationLink
															href="#"
															onClick={(e) => {
																e.preventDefault();
																handlePageChange(item as number);
															}}
															isActive={currentPage === item}
														>
															{item}
														</PaginationLink>
													)}
												</PaginationItem>
											),
										)}

										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handlePageChange(currentPage + 1);
												}}
												className={
													currentPage === totalPages
														? "pointer-events-none opacity-50"
														: ""
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
