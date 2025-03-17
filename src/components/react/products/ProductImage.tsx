import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface ProductImageProps {
	src: ImageMetadata;
	alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
	return (
		<div className="w-full max-w-2xl mx-auto">
			<img
				src={src.src}
				alt={alt}
				width={800}
				height={600}
				className="w-full h-auto"
			/>
		</div>
	);
}
