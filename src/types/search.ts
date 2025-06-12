/**
 * Represents a post in the knowledge base
 */
export interface Post {
	/** Unique identifier for the post */
	id: string;
	data: {
		/** Title of the post */
		title: string;
		/** Publication date of the post */
		pubDate: string | Date;
		/** Optional URL to the hero image */
		heroImage?: string;
		/** Optional description/excerpt of the post */
		description?: string;
		/** Optional array of tags associated with the post */
		tags?: string[];
	};
}

/**
 * Props for search components
 */
export interface SearchProps {
	/** Array of posts to search through */
	posts: Post[];
	/** Optional className to apply to the root element */
	className?: string;
	/** Optional default tag to select on mount */
	defaultTag?: string;
	/** Number of posts to display per page */
	postsPerPage?: number;
	/** Debounce delay for search in milliseconds */
	debounceDelay?: number;
	/** Optional pagination props */
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	searchQuery?: string;
	onSearchQueryChange?: (query: string) => void;
	loading?: boolean;
	categories?: string[];
	selectedCategory?: string;
	onCategoryChange?: (category: string) => void;
}

/** Default number of posts to display per page */
export const DEFAULT_POSTS_PER_PAGE = 4;

/** Default debounce delay for search in milliseconds */
export const DEFAULT_DEBOUNCE_DELAY = 300;

/**
 * Interface for individual search result post
 */
export interface Post {
	id: string;
	title: string;
	description: string;
	slug: string;
	publishDate: Date;
	updatedDate?: Date;
	image?: string;
	category?: string;
	tags?: string[];
	readingTime?: string;
	author?: string;
}
