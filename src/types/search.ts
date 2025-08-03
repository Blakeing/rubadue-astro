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

// Removed unused SearchProps interface

// Constants moved to src/components/data-display/search-results/constants.ts to avoid duplication

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
