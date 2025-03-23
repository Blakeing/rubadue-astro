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
 * Props for the Search component
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
}

/** Default number of posts to display per page */
export const DEFAULT_POSTS_PER_PAGE = 4;

/** Default debounce delay for search in milliseconds */
export const DEFAULT_DEBOUNCE_DELAY = 300;
