import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets"; // Import getImage
import defaultHeroImageMetadata from "@/assets/backgrounds/rubadue-hero.webp"; // Keep fallback metadata import

// We still need the glob to check if an asset path exists
const images = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/products/**/*.{jpeg,jpg,png,gif,webp}",
);
// Log discovered images ONCE at startup
// console.log('[getResolvedImageSource] Glob discovered images:', Object.keys(images));

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
	// console.log(`[getResolvedImageSource] Processing path: ${imagePath ?? 'undefined'}`);

	let imgSrcToProcess: string | ImageMetadata = defaultHeroImageMetadata;
	let isPublicPath = false;

	if (imagePath) {
		if (imagePath.startsWith("/")) {
			// console.log(`[getResolvedImageSource] Path is public: ${imagePath}`);
			imgSrcToProcess = imagePath;
			isPublicPath = true;
		} else if (imagePath.startsWith("@/assets/")) {
			const normalizedPath = imagePath.replace("@/assets/", "/src/assets/");
			// console.log(`[getResolvedImageSource] Path is asset. Normalized: ${normalizedPath}`);
			const imageModuleEntry = images[normalizedPath]; // Get the function to import
			if (imageModuleEntry) {
				// console.log(`[getResolvedImageSource] Asset found in glob: ${normalizedPath}. Importing...`);
				try {
					const importedModule = await imageModuleEntry(); // Dynamically import
					imgSrcToProcess = importedModule.default; // Use the imported metadata
					// console.log(`[getResolvedImageSource] Asset imported successfully. Passing metadata to getImage().`);
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
		// console.log('[getResolvedImageSource] No imagePath provided. Will use fallback.');
		imgSrcToProcess = defaultHeroImageMetadata; // Ensure fallback is set
	}

	if (isPublicPath && typeof imgSrcToProcess === "string") {
		// console.log(`[getResolvedImageSource] Returning public path directly: ${imgSrcToProcess}`);
		return imgSrcToProcess;
	}

	try {
		const srcDesc =
			typeof imgSrcToProcess === "string"
				? imgSrcToProcess
				: imgSrcToProcess.src;
		// console.log(`[getResolvedImageSource] Calling getImage() for: ${srcDesc}`);
		const optimizedImage = await getImage({
			src: imgSrcToProcess,
			width: width,
			height: height,
			format: "webp",
			quality: quality,
		});
		// console.log(`[getResolvedImageSource] getImage() success. Returning optimized src: ${optimizedImage.src}`);
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
			// console.log('[getResolvedImageSource] Optimizing fallback image...');
			const fallbackOptimized = await getImage({
				src: defaultHeroImageMetadata,
				width,
				height,
				format: "webp",
				quality,
			});
			// console.log(`[getResolvedImageSource] Fallback optimized. Returning: ${fallbackOptimized.src}`);
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
