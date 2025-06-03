import { getImage } from "astro:assets"; // Import getImage
import defaultHeroImageMetadata from "@/assets/backgrounds/rubadue-hero.webp"; // Keep fallback metadata import
import type { ImageMetadata } from "astro";

// We still need the glob to check if an asset path exists
const images = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/products/**/*.{jpeg,jpg,png,gif,webp}",
);
// Log discovered images ONCE at startup

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

	let imgSrcToProcess: string | ImageMetadata = defaultHeroImageMetadata;
	let isPublicPath = false;

	if (imagePath) {
		if (imagePath.startsWith("/")) {
			imgSrcToProcess = imagePath;
			isPublicPath = true;
		} else if (imagePath.startsWith("@/assets/")) {
			const normalizedPath = imagePath.replace("@/assets/", "/src/assets/");
			const imageModuleEntry = images[normalizedPath]; // Get the function to import
			if (imageModuleEntry) {
				try {
					const importedModule = await imageModuleEntry(); // Dynamically import
					imgSrcToProcess = importedModule.default; // Use the imported metadata
				} catch (importError) {
					console.error(
						`[getResolvedImageSource] Error importing asset ${normalizedPath}:`,
						importError,
					);
					imgSrcToProcess = defaultHeroImageMetadata; // Use fallback if import fails
				}
			} else {
				console.warn(
					`[getResolvedImageSource] Asset NOT found in glob: ${normalizedPath}. Will use fallback.`,
				);
				imgSrcToProcess = defaultHeroImageMetadata; // Ensure fallback is set
			}
		} else {
			console.warn(
				`[getResolvedImageSource] Unrecognized path format: ${imagePath}. Will use fallback.`,
			);
			imgSrcToProcess = defaultHeroImageMetadata; // Ensure fallback is set
		}
	} else {
		imgSrcToProcess = defaultHeroImageMetadata; // Ensure fallback is set
	}

	if (isPublicPath && typeof imgSrcToProcess === "string") {
		return imgSrcToProcess;
	}

	try {
		const srcDesc =
			typeof imgSrcToProcess === "string"
				? imgSrcToProcess
				: imgSrcToProcess.src;
		const optimizedImage = await getImage({
			src: imgSrcToProcess,
			width: width,
			height: height,
			format: "webp",
			quality: quality,
		});
		return optimizedImage.src;
	} catch (error) {
		const errorSrc =
			typeof imgSrcToProcess === "string"
				? imgSrcToProcess
				: imgSrcToProcess.src;
		console.error(
			`[getResolvedImageSource] Error calling getImage() for ${errorSrc}:`,
			error,
		);
		// If optimization fails, try optimizing the fallback image
		try {
			const fallbackOptimized = await getImage({
				src: defaultHeroImageMetadata,
				width,
				height,
				format: "webp",
				quality,
			});
			return fallbackOptimized.src;
		} catch (fallbackError) {
			console.error(
				"[getResolvedImageSource] Error optimizing fallback image! Returning raw fallback src.",
				fallbackError,
			);
			return defaultHeroImageMetadata.src;
		}
	}
}
