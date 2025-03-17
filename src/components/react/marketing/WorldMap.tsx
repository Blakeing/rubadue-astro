import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface LocationDetails {
	lat: number;
	lng: number;
	label?: string;
	name: string;
	location: string;
	manager?: {
		title: string;
		name: string;
		email: string;
		phone: string;
	};
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

	useEffect(() => {
		// Import DottedMap dynamically to avoid SSR issues
		import("dotted-map").then((DottedMap) => {
			const map = new DottedMap.default({ height: 100, grid: "diagonal" });
			const svg = map.getSVG({
				radius: 0.22,
				color: "hsl(21 0% 35%)",
				shape: "circle",
				backgroundColor: "white",
			});
			setSvgMap(svg);
		});
	}, []);

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
		const midY = Math.min(start.y, end.y) - 50;
		return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
	};

	if (!svgMap) {
		return (
			<div className="w-full aspect-[2/1] bg-background rounded-lg relative font-sans" />
		);
	}

	return (
		<div className="w-full aspect-[2/1] bg-background rounded-lg relative font-sans">
			{/* Background map */}
			{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
			<svg
				width="100%"
				height="100%"
				className="h-full w-full [mask-image:linear-gradient(to_bottom,white_0%,transparent_70%,transparent_100%)]"
			>
				<image
					href={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMid meet"
				/>
			</svg>

			{/* Paths and points */}
			<svg
				ref={svgRef}
				viewBox="0 0 800 400"
				className="w-full h-full absolute inset-0 pointer-events-none"
				aria-labelledby="map-title"
			>
				<title id="map-title">World map showing global connections</title>
				{/* Draw paths */}
				{dots.map((dot) => {
					const startPoint = projectPoint(dot.start.lat, dot.start.lng);
					const endPoint = projectPoint(dot.end.lat, dot.end.lng);
					const pathId = `${dot.start.lat}-${dot.start.lng}-${dot.end.lat}-${dot.end.lng}`;
					return (
						<motion.path
							key={pathId}
							d={createCurvedPath(startPoint, endPoint)}
							fill="none"
							stroke="url(#path-gradient)"
							strokeWidth="1"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{
								duration: 1,
								delay: 0.5,
								ease: "easeOut",
							}}
						/>
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
			</svg>

			{/* Interactive points with tooltips */}
			<div className="absolute inset-0">
				<TooltipProvider>
					{dots.map((dot, index) => {
						const startPoint = projectPoint(dot.start.lat, dot.start.lng);
						const endPoint = projectPoint(dot.end.lat, dot.end.lng);
						const pathId = `${dot.start.lat}-${dot.start.lng}-${dot.end.lat}-${dot.end.lng}`;
						return (
							<div key={pathId}>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											type="button"
											className="absolute rounded-full w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 hover:opacity-80 focus:outline-none"
											style={{
												left: `${(startPoint.x / 800) * 100}%`,
												top: `${(startPoint.y / 400) * 100}%`,
												backgroundColor: lineColor,
											}}
										/>
									</TooltipTrigger>
									<TooltipContent side="top" sideOffset={5}>
										<div className="space-y-2">
											<div>
												<p className="font-semibold text-base">
													{dot.start.name}
												</p>
												<p className="text-muted-foreground">
													{dot.start.location}
												</p>
											</div>
											{dot.start.manager && (
												<div className="border-t pt-2 text-sm">
													<p className="font-medium">
														{dot.start.manager.title}
													</p>
													<p>{dot.start.manager.name}</p>
													<div className="mt-1 space-y-1">
														<a
															href={`mailto:${dot.start.manager.email}`}
															className="block text-primary hover:underline"
														>
															{dot.start.manager.email}
														</a>
														<a
															href={`tel:${dot.start.manager.phone}`}
															className="block text-primary hover:underline"
														>
															{dot.start.manager.phone}
														</a>
													</div>
												</div>
											)}
										</div>
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<button
											type="button"
											className="absolute rounded-full w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 hover:opacity-80 focus:outline-none"
											style={{
												left: `${(endPoint.x / 800) * 100}%`,
												top: `${(endPoint.y / 400) * 100}%`,
												backgroundColor: lineColor,
											}}
										/>
									</TooltipTrigger>
									<TooltipContent side="top" sideOffset={5}>
										<div className="space-y-2">
											<div>
												<p className="font-semibold text-base">
													{dot.end.name}
												</p>
												<p className="text-muted-foreground">
													{dot.end.location}
												</p>
											</div>
											{dot.end.manager && (
												<div className="border-t pt-2 text-sm">
													<p className="font-medium">{dot.end.manager.title}</p>
													<p>{dot.end.manager.name}</p>
													<div className="mt-1 space-y-1">
														<a
															href={`mailto:${dot.end.manager.email}`}
															className="block text-primary hover:underline"
														>
															{dot.end.manager.email}
														</a>
														<a
															href={`tel:${dot.end.manager.phone}`}
															className="block text-primary hover:underline"
														>
															{dot.end.manager.phone}
														</a>
													</div>
												</div>
											)}
										</div>
									</TooltipContent>
								</Tooltip>
							</div>
						);
					})}
				</TooltipProvider>
			</div>
		</div>
	);
}
