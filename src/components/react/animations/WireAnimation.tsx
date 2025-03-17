import { cn } from "@/lib/utils";
import { WirePaths } from "./shared/wire-paths";

export const WireAnimation = ({ className }: { className?: string }) => {
	return (
		<div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
			<svg
				className="absolute w-full h-full left-1/3 animate-pulse"
				style={{
					transform: "scaleX(1.25) scaleY(.9) rotate(90deg)",
				}}
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				role="img"
				aria-label="Decorative wire animation"
			>
				<title>Animated wire patterns</title>
				<path
					d={WirePaths.WAVE}
					className="stroke-primary/20"
					strokeWidth="2"
					fill="none"
				/>
				<path
					d={WirePaths.SIMPLE_CURVE}
					className="stroke-primary/10"
					strokeWidth="2"
					fill="none"
					transform="translate(0, 20)"
				/>
				<path
					d={WirePaths.ZIGZAG}
					className="stroke-primary/15"
					strokeWidth="2"
					fill="none"
					transform="translate(0, -20)"
				/>
			</svg>
		</div>
	);
};
