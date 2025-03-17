/**
 * Scroll to top of page with smooth animation
 * Falls back to instant scroll if smooth scroll is not supported
 */
export function scrollToTop(): void {
	if (typeof window === "undefined") return;

	try {
		window.scrollTo({ top: 0, behavior: "smooth" });
	} catch {
		// Fallback to basic scroll if smooth scroll fails
		window.scrollTo(0, 0);
	}
}
