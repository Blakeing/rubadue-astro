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
		pubDate: Date;
		heroImage?: string;
		description?: string;
		tags?: string[];
	};
}

interface BlogSearchProps {
	posts: Post[];
	className?: string;
}

const POSTS_PER_PAGE = 4;

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

function PostCard({ post }: { post: Post }) {
	return (
		<a href={`/blog/${post.id.replace(/\.md$/, "")}/`} className="group">
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
				<CardContent className="p-6">
					<h2 className="text-2xl font-bold leading-tight tracking-tighter mb-2 group-hover:text-primary transition-colors line-clamp-2">
						{post.data.title}
					</h2>
					<div className="flex flex-wrap gap-2 mb-2">
						{post.data.tags?.map((tag) => (
							<span
								key={tag}
								className="text-xs px-2 py-1 rounded-full bg-muted"
							>
								{tag}
							</span>
						))}
					</div>
					<p className="text-sm text-muted-foreground">
						{formatDate(post.data.pubDate)}
					</p>
					{post.data.description && (
						<p className="text-muted-foreground mt-2 line-clamp-2">
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

export default function BlogSearch({ posts, className }: BlogSearchProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
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
		hasMounted.current = true;

		// Check URL parameters
		const params = new URLSearchParams(window.location.search);
		const tagParam = params.get("tag");
		if (tagParam && allTags.includes(tagParam)) {
			setSelectedTag(tagParam);
		}
	}, [allTags]);

	// Update URL when tag changes
	useEffect(() => {
		if (!hasMounted.current || !isInitialized.current) {
			isInitialized.current = true;
			return;
		}

		const url = new URL(window.location.href);
		if (selectedTag && allTags.includes(selectedTag)) {
			url.searchParams.set("tag", selectedTag);
		} else {
			url.searchParams.delete("tag");
		}
		window.history.replaceState({}, "", url.toString());
	}, [selectedTag, allTags]);

	// Filter posts based on search query and selected tag
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

				const matchesTag =
					!selectedTag || post.data.tags?.includes(selectedTag);

				return matchesSearch && matchesTag;
			}),
		[posts, debouncedSearch, selectedTag],
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
	}, [searchQuery, selectedTag]);

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
		setSelectedTag(selectedTag === tag ? null : tag);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div
			className={cn("w-full space-y-6 min-h-[calc(100vh-452px)]", className)}
		>
			<style>{searchInputStyles}</style>
			<div className="space-y-4">
				<div className="relative w-full max-w-2xl">
					<div className="relative">
						<Input
							type="search"
							placeholder="Search posts by title, description, or tags..."
							value={searchQuery}
							onChange={handleSearch}
							className="pr-8"
						/>
						{isSearching && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
							</div>
						)}
					</div>
				</div>

				{allTags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{allTags.map((tag) => (
							<button
								type="button"
								key={tag}
								onClick={() => handleTagClick(tag)}
								className={cn(
									"px-3 py-1 rounded-full text-sm transition-colors",
									selectedTag === tag
										? "bg-primary text-primary-foreground"
										: "bg-muted hover:bg-muted/80",
								)}
							>
								{tag}
							</button>
						))}
					</div>
				)}
			</div>
			<Separator />
			<div className="grid gap-6 sm:grid-cols-2 min-h-[200px]">
				{currentPosts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}

				{filteredPosts.length === 0 && (
					<div className="col-span-2 flex items-center justify-center text-center text-muted-foreground py-8">
						No posts found matching your search
						{selectedTag && ` and tag "${selectedTag}"`}.
					</div>
				)}
			</div>

			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage > 1) handlePageChange(currentPage - 1);
								}}
								className={cn(
									currentPage === 1 && "pointer-events-none opacity-50",
								)}
							/>
						</PaginationItem>

						{[...Array(totalPages)].map((_, i) => {
							const page = i + 1;
							// Show first page, last page, current page, and pages around current page
							if (
								page === 1 ||
								page === totalPages ||
								(page >= currentPage - 1 && page <= currentPage + 1)
							) {
								return (
									<PaginationItem key={page}>
										<PaginationLink
											href="#"
											onClick={(e) => {
												e.preventDefault();
												handlePageChange(page);
											}}
											isActive={currentPage === page}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								);
							}
							// Show ellipsis for skipped pages
							if (page === currentPage - 2 || page === currentPage + 2) {
								return (
									<PaginationItem key={page}>
										<PaginationEllipsis />
									</PaginationItem>
								);
							}
							return null;
						})}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage < totalPages)
										handlePageChange(currentPage + 1);
								}}
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
