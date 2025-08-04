import { getImage } from "astro:assets";
import defaultHeroImageMetadata from "@/assets/backgrounds/rubadue-hero.webp";

// We still need the glob to check if an asset path exists
const images = import.meta.glob("/src/assets/**/*.{jpeg,jpg,png,gif,webp}");

/**
 * Resolves an image path to an optimized image URL string.
 * Handles public paths, asset paths (@/assets/), and provides a fallback.
 * @param imagePath The raw image path string (e.g., "/img.jpg", "@/assets/img.jpg", or undefined).
 * @returns A promise resolving to the optimized image source URL string.
 */
export async function getResolvedImageSource(
	imagePath: string | undefined | null,
	options: { width?: number; height?: number; quality?: number } = {},
): Promise<string> {
	const { width = 800, height, quality = 80 } = options;

	// Handle public paths directly
	if (imagePath?.startsWith("/")) {
		return imagePath;
	}

	// Default to fallback image
	let imageToProcess = defaultHeroImageMetadata;

	// Try to resolve asset paths
	if (imagePath?.startsWith("@/assets/")) {
		const normalizedPath = imagePath.replace("@/assets/", "/src/assets/");
		const imageModuleEntry = images[normalizedPath];
		if (imageModuleEntry) {
			try {
				const importedModule = (await imageModuleEntry()) as {
					default: typeof defaultHeroImageMetadata;
				};
				imageToProcess = importedModule.default;
			} catch (importError) {
				// Fallback to default image instead of breaking
				imageToProcess = defaultHeroImageMetadata;
			}
		} else {
			// Use fallback image
			imageToProcess = defaultHeroImageMetadata;
		}
	}

	// Optimize the image with better error handling
	try {
		const optimizedImage = await getImage({
			src: imageToProcess,
			width,
			height,
			format: "webp",
			quality,
		});
		return optimizedImage.src;
	} catch (error) {
		// Return the source directly as a last resort
		return imageToProcess.src || defaultHeroImageMetadata.src;
	}
}
