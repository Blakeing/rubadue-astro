import { useDebounce } from "@/hooks/use-debounce";
import type { Post } from "@/components/react/search/utils/types";
import { POSTS_PER_PAGE } from "@/components/react/search/utils/types";
import { useEffect, useMemo, useRef, useState } from "react";

interface UseSearchProps {
	/** Array of posts to search through */
	posts: Post[];
	/** Optional default tag to select on mount */
	defaultTag?: string;
}

interface UseSearchReturn {
	/** Current search query */
	searchQuery: string;
	/** Function to update search query */
	setSearchQuery: (query: string) => void;
	/** Currently selected tag */
	selectedTag: string | null;
	/** Function to update selected tag */
	setSelectedTag: (tag: string | null) => void;
	/** Whether a search is in progress */
	isSearching: boolean;
	/** Current page number */
	currentPage: number;
	/** Function to update current page */
	setCurrentPage: (page: number) => void;
	/** Array of all unique tags from posts */
	allTags: string[];
	/** Array of all posts after filtering */
	filteredPosts: Post[];
	/** Array of posts for current page */
	currentPosts: Post[];
	/** Total number of pages */
	totalPages: number;
	/** Function to handle search input changes */
	handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** Function to handle tag selection */
	handleTagClick: (tag: string) => void;
	/** Function to handle page changes */
	handlePageChange: (page: number) => void;
}

/**
 * Custom hook for managing search functionality
 * @param props - Hook configuration
 * @returns Search state and handlers
 */
export function useSearch({
	posts,
	defaultTag,
}: UseSearchProps): UseSearchReturn {
	// Input state
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	// Debounced search for performance
	const debouncedSearch = useDebounce(searchQuery, 300);

	// Refs for handling hydration
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
		if (typeof window !== "undefined") {
			hasMounted.current = true;

			// Safe URL parameter handling
			const getTagFromUrl = () => {
				try {
					const params = new URLSearchParams(window.location.search);
					const tagParam = params.get("tag") || defaultTag;
					return tagParam && allTags.includes(tagParam) ? tagParam : null;
				} catch (error) {
					if (process.env.NODE_ENV === "development") {
						console.error("Error reading URL params:", error);
					}
					return defaultTag && allTags.includes(defaultTag) ? defaultTag : null;
				}
			};

			const initialTag = getTagFromUrl();
			if (initialTag) {
				setSelectedTag(initialTag);
			}
		}
	}, [allTags, defaultTag]);

	// Update URL when tag changes
	useEffect(() => {
		if (
			typeof window === "undefined" ||
			!hasMounted.current ||
			!isInitialized.current
		) {
			isInitialized.current = true;
			return;
		}

		// Safe URL update handling
		const updateUrlWithTag = () => {
			try {
				const url = new URL(window.location.href);
				if (selectedTag && allTags.includes(selectedTag)) {
					url.searchParams.set("tag", selectedTag);
				} else {
					url.searchParams.delete("tag");
				}
				window.history.replaceState({}, "", url.toString());
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("Error updating URL:", error);
				}
				// URL update failure is non-critical, functionality continues
			}
		};

		updateUrlWithTag();
	}, [selectedTag, allTags]);

	// Filter posts based on search query and selected tag
	const filteredPosts = useMemo(
		() =>
			posts.filter((post) => {
				const searchLower = debouncedSearch.toLowerCase();
				const matchesSearch =
					!debouncedSearch ||
					post.data.title.toLowerCase().includes(searchLower) ||
					post.data.description?.toLowerCase().includes(searchLower) ||
					post.data.tags?.some((tag) =>
						tag.toLowerCase().includes(searchLower),
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

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [selectedTag]);

	// Handle search state
	useEffect(() => {
		setIsSearching(debouncedSearch !== searchQuery);
	}, [debouncedSearch, searchQuery]);

	// Event handlers
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleTagClick = (tag: string) => {
		setSelectedTag(selectedTag === tag ? null : tag);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Safe scroll handling
		if (typeof window !== "undefined" && window.scrollTo) {
			try {
				window.scrollTo({ top: 0, behavior: "smooth" });
			} catch {
				// Fallback to basic scroll if smooth scroll fails
				window.scrollTo(0, 0);
			}
		}
	};

	return {
		searchQuery,
		setSearchQuery,
		selectedTag,
		setSelectedTag,
		isSearching,
		currentPage,
		setCurrentPage,
		allTags,
		filteredPosts,
		currentPosts,
		totalPages,
		handleSearch,
		handleTagClick,
		handlePageChange,
	};
}
