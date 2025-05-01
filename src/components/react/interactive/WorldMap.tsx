import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
// Import type for TS
import { Loader2 } from "lucide-react"; // Import Loader icon

interface LocationDetails {
	lat: number;
	lng: number;
	label?: string;
}

interface MapProps {
	dots?: Array<{
		start: LocationDetails;
		end: LocationDetails;
	}>;
	lineColor?: string;
}

export function WorldMap({
	dots = [],
	lineColor = "hsl(var(--primary))",
}: MapProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [svgMap, setSvgMap] = useState<string>("");
	// Removed mapInstanceRef

	useEffect(() => {
		import("dotted-map").then(({ default: DottedMap }) => {
			// Use width/height that match the 2:1 aspect ratio
			const map = new DottedMap({ width: 200, height: 100, grid: "diagonal" });
			// Removed storing instance in ref

			const svg = map.getSVG({
				radius: 0.22,
				color: "#00000040",
				shape: "circle",
				backgroundColor: "white",
			});
			setSvgMap(svg);
		});
	}, []); // Removed theme from dependencies

	// Reintroduce the projectPoint function
	const projectPoint = (lat: number, lng: number) => {
		const x = (lng + 180) * (800 / 360);
		const y = (90 - lat) * (400 / 180);
		return { x, y };
	};

	const createCurvedPath = (
		start: { x: number; y: number },
		end: { x: number; y: number },
	) => {
		const midX = (start.x + end.x) / 2;
		// Revert to original curve calculation or a simpler one
		const midY = Math.min(start.y, end.y) - 50;
		return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
	};

	// Render placeholder or loading state if map not ready
	if (!svgMap) {
		// Only check svgMap now
		return (
			<div
				className="w-full aspect-[2/1]  bg-background-muted rounded-lg relative font-sans flex items-center justify-center text-muted-foreground"
				aria-label="Loading world map..."
			>
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		);
	}

	// Removed mapInstance check

	return (
		<div className="w-full aspect-[2/1] bg-white rounded-lg relative font-sans">
			<img
				src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
				className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
				alt="world map background"
				height="400"
				width="800"
				draggable={false}
			/>
			<svg
				ref={svgRef}
				viewBox="0 0 800 400"
				className="w-full h-full absolute inset-0 pointer-events-none select-none"
				aria-labelledby="map-title"
			>
				<title id="map-title">World map showing global connections</title>
				{dots.map((dot, index) => {
					// Use projectPoint again
					const startPoint = projectPoint(dot.start.lat, dot.start.lng);
					const endPoint = projectPoint(dot.end.lat, dot.end.lng);
					const pathKey = `path-${index}-${dot.start.lat}-${dot.start.lng}-${dot.end.lat}-${dot.end.lng}`;

					// Removed null checks specific to getPin

					return (
						<g key={pathKey}>
							<motion.path
								d={createCurvedPath(startPoint, endPoint)}
								fill="none"
								stroke="url(#path-gradient)"
								strokeWidth="1"
								initial={{
									pathLength: 0,
								}}
								animate={{
									pathLength: 1,
								}}
								transition={{
									duration: 1,
									// Using index for delay might still be okay, but keep commented if preferred
									// delay: 0.5 * index,
									ease: "easeOut",
								}}
							/>
						</g>
					);
				})}

				<defs>
					<linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="white" stopOpacity="0" />
						<stop offset="5%" stopColor={lineColor} stopOpacity="1" />
						<stop offset="95%" stopColor={lineColor} stopOpacity="1" />
						<stop offset="100%" stopColor="white" stopOpacity="0" />
					</linearGradient>
				</defs>

				{dots.map((dot, index) => {
					const startKey = `start-point-${index}-${dot.start.lat}-${dot.start.lng}`;
					const endKey = `end-point-${index}-${dot.end.lat}-${dot.end.lng}`;
					// Use projectPoint again
					const startPoint = projectPoint(dot.start.lat, dot.start.lng);
					const endPoint = projectPoint(dot.end.lat, dot.end.lng);

					// Removed null checks specific to getPin

					return (
						<g key={`points-group-${index}-${startKey}-${endKey}`}>
							<g key={startKey}>
								<circle
									cx={startPoint.x}
									cy={startPoint.y}
									r="2"
									fill={lineColor}
								/>
								<circle
									cx={startPoint.x}
									cy={startPoint.y}
									r="2"
									fill={lineColor}
									opacity="0.5"
								>
									<animate
										attributeName="r"
										from="2"
										to="8"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="opacity"
										from="0.5"
										to="0"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
								</circle>
							</g>
							<g key={endKey}>
								<circle
									cx={endPoint.x}
									cy={endPoint.y}
									r="2"
									fill={lineColor}
								/>
								<circle
									cx={endPoint.x}
									cy={endPoint.y}
									r="2"
									fill={lineColor}
									opacity="0.5"
								>
									<animate
										attributeName="r"
										from="2"
										to="8"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="opacity"
										from="0.5"
										to="0"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
								</circle>
							</g>
						</g>
					);
				})}
			</svg>
		</div>
	);
}
