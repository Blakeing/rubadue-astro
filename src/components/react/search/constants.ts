/**
 * Default number of posts to display per page
 */
export const DEFAULT_POSTS_PER_PAGE = 4;

/**
 * Default debounce delay for search in milliseconds
 */
export const DEFAULT_DEBOUNCE_DELAY = 300;

/**
 * Default search placeholder text
 */
export const DEFAULT_SEARCH_PLACEHOLDER =
	"Search by title, description, or tags...";

/**
 * Default minimum height for search container
 */
export const DEFAULT_SEARCH_MIN_HEIGHT = "calc(100vh - 452px)";

/**
 * CSS to remove the search clear button from search inputs
 */
export const SEARCH_INPUT_STYLES = `
	[type="search"]::-webkit-search-cancel-button {
		-webkit-appearance: none;
		appearance: none;
	}
`;
