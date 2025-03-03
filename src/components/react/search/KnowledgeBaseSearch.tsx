import {
	useState,
	useEffect,
	type ChangeEvent,
	useCallback,
	useRef,
	useMemo,
} from "react";
import { Input } from "@/components/react/ui/input";
import { Card, CardContent, CardHeader } from "@/components/react/ui/card";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/react/ui/pagination";
import { Separator } from "../ui";

interface Post {
	id: string;
	data: {
		title: string;
		pubDate: string | Date;
		heroImage?: string;
		description?: string;
		tags?: string[];
	};
}

interface KnowledgeBaseSearchProps {
	posts: Post[];
	className?: string;
}

const POSTS_PER_PAGE = 4;

function formatDate(date: string | Date) {
	// Use a fixed locale and options to ensure consistent formatting between server and client
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC", // Use UTC to ensure consistent timezone handling
	}).format(new Date(date));
}

function PostCard({ post }: { post: Post }) {
	return (
		<a
			href={`/knowledge-base/${post.id.replace(/\.md$/, "")}/`}
			className="group"
		>
			<Card className="overflow-hidden transition-colors hover:border-primary h-full">
				<CardHeader className="p-0">
					{post.data.heroImage && (
						<div className="relative aspect-video">
							<img
								src={post.data.heroImage}
								alt=""
								width={720}
								height={360}
								className="object-cover absolute inset-0 w-full h-full"
							/>
						</div>
					)}
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					<h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tighter mb-2 group-hover:text-primary transition-colors line-clamp-2">
						{post.data.title}
					</h2>
					<div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
						{post.data.tags?.map((tag) => (
							<span
								key={tag}
								className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted"
							>
								{tag}
							</span>
						))}
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground">
						{formatDate(post.data.pubDate)}
					</p>
					{post.data.description && (
						<p className="text-sm text-muted-foreground mt-2 line-clamp-2">
							{post.data.description}
						</p>
					)}
				</CardContent>
			</Card>
		</a>
	);
}

// Add this CSS class to remove the search clear button
const searchInputStyles = `
  [type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
`;

export default function KnowledgeBaseSearch({
	posts,
	className,
}: KnowledgeBaseSearchProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const debouncedSearch = useDebounce(searchQuery, 300);
	const isInitialized = useRef(false);
	const hasMounted = useRef(false);

	// Get unique tags from all posts
	const allTags = useMemo(
		() =>
			Array.from(new Set(posts.flatMap((post) => post.data.tags || []))).sort(),
		[posts],
	);

	// Handle client-side initialization
	useEffect(() => {
		// Only run this code on the client side
		if (typeof window !== "undefined") {
			hasMounted.current = true;

			// Check URL parameters
			const params = new URLSearchParams(window.location.search);
			const tagParams = params.getAll("tag");

			if (tagParams.length > 0) {
				// Filter out any invalid tags
				const validTags = tagParams.filter((tag) => allTags.includes(tag));
				if (validTags.length > 0) {
					setSelectedTags(validTags);
				}
			}
		}
	}, [allTags]);

	// Update URL when tags change
	useEffect(() => {
		// Only run this code on the client side
		if (
			typeof window === "undefined" ||
			!hasMounted.current ||
			!isInitialized.current
		) {
			isInitialized.current = true;
			return;
		}

		const url = new URL(window.location.href);
		// Clear existing tag parameters
		url.searchParams.delete("tag");

		// Add each selected tag as a parameter
		if (selectedTags.length > 0) {
			for (const tag of selectedTags) {
				if (allTags.includes(tag)) {
					url.searchParams.append("tag", tag);
				}
			}
		}

		window.history.replaceState({}, "", url.toString());
	}, [selectedTags, allTags]);

	// Filter posts based on search query and selected tags
	const filteredPosts = useMemo(
		() =>
			posts.filter((post) => {
				const matchesSearch =
					!debouncedSearch ||
					post.data.title
						.toLowerCase()
						.includes(debouncedSearch.toLowerCase()) ||
					post.data.description
						?.toLowerCase()
						.includes(debouncedSearch.toLowerCase()) ||
					post.data.tags?.some((tag) =>
						tag.toLowerCase().includes(debouncedSearch.toLowerCase()),
					);

				const matchesTags =
					selectedTags.length === 0 ||
					(post.data.tags &&
						selectedTags.some((tag) => post.data.tags?.includes(tag)));

				return matchesSearch && matchesTags;
			}),
		[posts, debouncedSearch, selectedTags],
	);

	// Calculate pagination
	const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
	const pageStart = (currentPage - 1) * POSTS_PER_PAGE;
	const pageEnd = pageStart + POSTS_PER_PAGE;
	const currentPosts = filteredPosts.slice(pageStart, pageEnd);

	//biome-ignore lint/correctness/useExhaustiveDependencies: <Reset page when filters change>
	useEffect(() => {
		setCurrentPage(1);
		// We want this effect to run when filters change
	}, [searchQuery, selectedTags]);

	// Handle search state
	useEffect(() => {
		if (debouncedSearch !== searchQuery) {
			setIsSearching(true);
		} else {
			setIsSearching(false);
		}
	}, [debouncedSearch, searchQuery]);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleTagClick = (tag: string) => {
		setSelectedTags((prevTags) => {
			// If tag is already selected, remove it
			if (prevTags.includes(tag)) {
				return prevTags.filter((t) => t !== tag);
			}
			// Otherwise add it
			return [...prevTags, tag];
		});
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleClearTags = () => {
		setSelectedTags([]);
	};

	return (
		<div
			className={cn(
				"w-full space-y-4 sm:space-y-6 min-h-[calc(100vh-452px)]",
				className,
			)}
		>
			<style>{searchInputStyles}</style>

			{/* Search and filters */}
			<div className="space-y-3 sm:space-y-4">
				<div className="relative">
					<Input
						type="search"
						placeholder="Search articles..."
						value={searchQuery}
						onChange={handleSearch}
						className="w-full"
					/>
				</div>

				{/* Tags */}
				{allTags.length > 0 && (
					<div className="space-y-2 sm:space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium">Filter by tag</h3>
							{selectedTags.length > 0 && (
								<button
									type="button"
									onClick={handleClearTags}
									className="text-xs sm:text-sm text-primary hover:underline"
								>
									Clear all
								</button>
							)}
						</div>
						<div className="flex flex-wrap gap-1.5 sm:gap-2">
							{allTags.map((tag) => (
								<button
									type="button"
									key={tag}
									onClick={() => handleTagClick(tag)}
									className={cn(
										"text-xs px-2 py-0.5 sm:py-1 rounded-full transition-colors",
										selectedTags.includes(tag)
											? "bg-primary text-primary-foreground"
											: "bg-muted hover:bg-muted/80",
									)}
								>
									{tag}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Results count */}
			<div className="flex items-center justify-between">
				<p className="text-xs sm:text-sm text-muted-foreground">
					{filteredPosts.length === 0
						? "No articles found"
						: filteredPosts.length === 1
							? "1 article found"
							: `${filteredPosts.length} articles found`}
				</p>
			</div>

			{/* Results */}
			{currentPosts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					{currentPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
					<h3 className="text-lg sm:text-xl font-semibold mb-2">
						No articles found
					</h3>
					<p className="text-sm text-muted-foreground max-w-md">
						Try adjusting your search or filter criteria to find what you're
						looking for.
					</p>
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination className="mt-6 sm:mt-8">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
								className={cn(
									currentPage === 1 && "pointer-events-none opacity-50",
								)}
							/>
						</PaginationItem>

						{/* First page */}
						{currentPage > 3 && (
							<PaginationItem>
								<PaginationLink onClick={() => handlePageChange(1)}>
									1
								</PaginationLink>
							</PaginationItem>
						)}

						{/* Ellipsis if needed */}
						{currentPage > 4 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}

						{/* Page before current */}
						{currentPage > 1 && (
							<PaginationItem>
								<PaginationLink
									onClick={() => handlePageChange(currentPage - 1)}
								>
									{currentPage - 1}
								</PaginationLink>
							</PaginationItem>
						)}

						{/* Current page */}
						<PaginationItem>
							<PaginationLink isActive>{currentPage}</PaginationLink>
						</PaginationItem>

						{/* Page after current */}
						{currentPage < totalPages && (
							<PaginationItem>
								<PaginationLink
									onClick={() => handlePageChange(currentPage + 1)}
								>
									{currentPage + 1}
								</PaginationLink>
							</PaginationItem>
						)}

						{/* Ellipsis if needed */}
						{currentPage < totalPages - 3 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}

						{/* Last page */}
						{currentPage < totalPages - 2 && (
							<PaginationItem>
								<PaginationLink onClick={() => handlePageChange(totalPages)}>
									{totalPages}
								</PaginationLink>
							</PaginationItem>
						)}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									handlePageChange(Math.min(totalPages, currentPage + 1))
								}
								className={cn(
									currentPage === totalPages &&
										"pointer-events-none opacity-50",
								)}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
