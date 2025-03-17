import type { Post } from "@/types/search";

/**
 * Get the tag from URL parameters
 * @param defaultTag - Optional default tag to use if no tag is found in URL
 * @param allTags - Array of all available tags
 * @returns The tag from URL or default tag if valid
 */
export function getTagFromUrl(
	defaultTag?: string,
	allTags: string[] = [],
): string | null {
	if (typeof window === "undefined") return null;

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
}

/**
 * Update URL with selected tag
 * @param tag - Tag to set in URL
 * @param allTags - Array of all available tags
 */
export function updateUrlWithTag(
	tag: string | null,
	allTags: string[] = [],
): void {
	if (typeof window === "undefined") return;

	try {
		const url = new URL(window.location.href);
		if (tag && allTags.includes(tag)) {
			url.searchParams.set("tag", tag);
		} else {
			url.searchParams.delete("tag");
		}
		window.history.replaceState({}, "", url.toString());
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Error updating URL:", error);
		}
	}
}

/**
 * Get unique tags from posts
 * @param posts - Array of posts
 * @returns Array of unique tags
 */
export function getUniqueTags(posts: Post[]): string[] {
	return Array.from(
		new Set(posts.flatMap((post) => post.data.tags || [])),
	).sort();
}
