import { useState } from "react";
import defaultHeroImage from "@/assets/backgrounds/rubadue-hero.webp"; // Keep for fallback src
import { cn } from "@/lib/utils"; // Import cn utility

interface ProductImageProps {
	src?: string; // Should always receive a string URL now, or undefined
	alt: string;
	width?: number;
	height?: number;
	className?: string; // Add className prop
}

export default function ProductImage({
	src,
	alt,
	width = 400,
	height = 400,
	className, // Destructure className
}: ProductImageProps) {
	const [error, setError] = useState(false);

	// Use the provided src directly, or the default image src if error or src is missing
	const imageUrl = error || !src ? defaultHeroImage.src : src;

	return (
		<img
			src={imageUrl}
			alt={alt}
			width={width}
			height={height}
			// Set error state ONLY if the src prop was initially valid but failed to load
			onError={() => {
				if (src && !error) {
					// Prevent error loop if fallback also fails
					setError(true);
				}
			}}
			// Apply default and passed classNames
			className={cn(
				"h-full w-full", // Keep only essential size defaults
				className, // Passed classes will now fully control object-fit etc.
			)}
		/>
	);
}
