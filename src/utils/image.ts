import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

export async function getOptimizedImage(src: string | ImageMetadata) {
	try {
		// If src is already an ImageMetadata object (from an import), return its src
		if (typeof src === "object" && "src" in src) {
			return src.src;
		}

		// If the image is from public directory, we need to handle it differently
		if (typeof src === "string" && src.startsWith("/")) {
			return src;
		}

		// For local images, we can use getImage
		const image = await getImage({
			src,
			width: 400,
			height: 400,
			format: "webp",
			quality: 80,
		});

		return image.src;
	} catch (error) {
		console.error("Error optimizing image:", error);
		return typeof src === "string" ? src : src.src;
	}
}
