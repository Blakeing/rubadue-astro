import { Fragment, useEffect, useRef, useCallback } from "react";
import { Star } from "lucide-react";
import type { ImageMetadata } from "astro";
import { Image } from "astro:assets";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/react/ui/accordion";
import { ScrollArea } from "@/components/react/ui/scroll-area";
import { cn } from "@/lib/utils";
interface ProductPageProps {
	product: {
		name: string;
		version?: { name: string; date: string; datetime: string };
		price?: string;
		description: string;
		highlights?: string[];
		imageSrc: string | ImageMetadata;
		imageAlt: string;
		construction?: {
			sizeRange?: string;
			conductor?: string;
			insulation?: string;
			rating?: {
				temperature?: string;
				voltage?: string[];
			};
			numberWires?: string;
			coatings?: string[];
		};
		compliances?: string[];
		systemApprovals?: string[];
		category: string;
		overview?: string;
		applications?: string[];
		tensileStrength?: string;
		breakdown?: string;
		tags?: {
			type?: string[];
			material?: string[];
		};
	};

	license?: {
		href: string;
		summary: string;
		content: string;
	};
}

export default function ProductPage({ product, license }: ProductPageProps) {
	const productImageRef = useRef<HTMLDivElement>(null);
	const productDetailsRef = useRef<HTMLDivElement>(null);

	// Function to update the details height based on image height
	const updateDetailsHeight = useCallback(() => {
		if (productImageRef.current && productDetailsRef.current) {
			const imageHeight = productImageRef.current.offsetHeight;
			// Find the ScrollArea viewport element
			const scrollAreaViewport = productDetailsRef.current.querySelector(
				"[data-radix-scroll-area-viewport]",
			);
			if (scrollAreaViewport) {
				// Only apply fixed height on larger screens (lg and up)
				if (window.innerWidth >= 1024) {
					// 1024px is the lg breakpoint in Tailwind
					// Subtract space for the heading (approximately 80px)
					(scrollAreaViewport as HTMLElement).style.height =
						`${imageHeight - 80}px`;
				} else {
					// Remove fixed height on mobile
					(scrollAreaViewport as HTMLElement).style.height = "auto";
				}
			}
		}
	}, []);

	useEffect(() => {
		// Check if we're on mobile initially
		const isMobile = window.innerWidth < 1024;

		// Initial setup based on screen size
		if (productDetailsRef.current) {
			const scrollAreaViewport = productDetailsRef.current.querySelector(
				"[data-radix-scroll-area-viewport]",
			);

			if (scrollAreaViewport) {
				if (isMobile) {
					// On mobile, set height to auto
					(scrollAreaViewport as HTMLElement).style.height = "auto";
				} else {
					// On desktop, calculate based on image height
					updateDetailsHeight();
				}
			}
		}

		// Handle window resize for responsive behavior
		const handleResize = () => {
			// Find the ScrollArea viewport element
			if (productDetailsRef.current) {
				const scrollAreaViewport = productDetailsRef.current.querySelector(
					"[data-radix-scroll-area-viewport]",
				);

				if (scrollAreaViewport) {
					// On mobile, ensure height is auto
					if (window.innerWidth < 1024) {
						(scrollAreaViewport as HTMLElement).style.height = "auto";
					} else {
						// On desktop, recalculate based on image height
						updateDetailsHeight();
					}
				}
			}
		};

		// Update on window resize
		window.addEventListener("resize", handleResize);

		// Add multiple checks to ensure images are loaded (only needed for desktop)
		const imageLoadTimers = !isMobile
			? [
					setTimeout(updateDetailsHeight, 100),
					setTimeout(updateDetailsHeight, 300),
					setTimeout(updateDetailsHeight, 800),
					setTimeout(updateDetailsHeight, 1500),
				]
			: [];

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			for (const timer of imageLoadTimers) {
				clearTimeout(timer);
			}
		};
	}, [updateDetailsHeight]);

	const sections = [
		{
			id: "overview",
			title: "Overview",
			show: !!product.overview,
			content: <p className="text-sm text-foreground">{product.overview}</p>,
		},
		{
			id: "applications",
			title: "Applications",
			show: !!product.applications?.length,
			content: (
				<ul className="list-disc space-y-2 pl-5 text-sm">
					{product.applications?.map((application) => (
						<li key={application}>{application}</li>
					))}
				</ul>
			),
		},
		{
			id: "construction",
			title: "Product Construction",
			show: !!product.construction,
			content: (
				<div className="space-y-4">
					{product.construction && (
						<>
							{product.construction.sizeRange && (
								<div className="flex items-center">
									<dt className="pr-2 flex-none text-sm text-muted-foreground">
										Size Range:
									</dt>
									<dd className="text-sm text-foreground">
										{product.construction.sizeRange}
									</dd>
								</div>
							)}

							{product.construction.numberWires && (
								<div className="flex items-center">
									<dt className="pr-2 flex-none text-sm text-muted-foreground">
										Number of Wires:
									</dt>
									<dd className="text-sm text-foreground">
										{product.construction.numberWires}
									</dd>
								</div>
							)}

							{product.construction.conductor && (
								<div className="flex items-center">
									<dt className="pr-2 flex-none text-sm text-muted-foreground">
										Conductor:
									</dt>
									<dd className="text-sm text-foreground">
										{product.construction.conductor}
									</dd>
								</div>
							)}
							{product.construction.insulation && (
								<div className="flex items-center">
									<dt className="pr-2 flex-none text-sm text-muted-foreground">
										Insulation:
									</dt>
									<dd className="text-sm text-foreground">
										{product.construction.insulation}
									</dd>
								</div>
							)}
							{product.construction.rating && (
								<div className="flex flex-col space-y-2">
									{product.construction.rating.temperature && (
										<div className="flex items-center">
											<dt className="pr-2 flex-none text-sm text-muted-foreground">
												Temperature:
											</dt>
											<dd className="text-sm text-foreground">
												{product.construction.rating.temperature}
											</dd>
										</div>
									)}
									{product.construction.rating.voltage && (
										<div className="flex items-center">
											<dt className="pr-2 flex-none text-sm text-muted-foreground">
												Voltage:
											</dt>
											<dd className="text-sm text-foreground">
												{product.construction.rating.voltage.join(", ")}
											</dd>
										</div>
									)}
								</div>
							)}
							{product.construction.coatings && (
								<div
									className={cn(
										"flex items-center",
										product.construction.coatings.length > 1 &&
											"flex-col items-start",
									)}
								>
									<dt
										className={cn(
											"pr-2 flex-none text-sm text-muted-foreground",
											product.construction.coatings.length > 1 && "mb-2 pr-0",
										)}
									>
										Coatings:
									</dt>
									<dd>
										{product.construction.coatings.length > 1 ? (
											<ul className="list-disc space-y-2 pl-5 text-sm">
												{product.construction.coatings.map((coating) => (
													<li key={coating}>{coating}</li>
												))}
											</ul>
										) : (
											<p className="text-sm text-foreground">
												{product.construction.coatings[0]}
											</p>
										)}
									</dd>
								</div>
							)}
						</>
					)}
				</div>
			),
		},
		{
			id: "compliances",
			title: "Compliances",
			show: !!(
				product.compliances ||
				product.systemApprovals ||
				product.tensileStrength
			),
			content: (
				<div className="space-y-4">
					{product.compliances && (
						<div>
							<dt className="sr-only">Compliances:</dt>
							<dd>
								<ul className="list-disc space-y-2 pl-5 text-sm">
									{product.compliances.map((compliance) => (
										<li key={compliance}>{compliance}</li>
									))}
								</ul>
							</dd>
						</div>
					)}
					{product.systemApprovals && (
						<div className="mt-4">
							<dt className="text-sm text-muted-foreground mb-2">
								System Approvals:
							</dt>
							<dd>
								<ul className="list-disc space-y-2 pl-5 text-sm">
									{product.systemApprovals.map((approval) => (
										<li key={approval}>{approval}</li>
									))}
								</ul>
							</dd>
						</div>
					)}
					{product.tensileStrength && (
						<div className="flex items-center">
							<dt className="flex-none text-sm text-muted-foreground pr-2">
								Tensile Strength:
							</dt>
							<dd className="text-sm text-foreground">
								{product.tensileStrength}
							</dd>
						</div>
					)}
				</div>
			),
		},
	];

	const visibleSections = sections.filter((section) => section.show);
	const defaultSection = visibleSections[0]?.id;

	return (
		<div className="relative">
			{/* Product */}
			<div className="lg:grid lg:grid-cols-9 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
				{/* Product image */}
				<div
					ref={productImageRef}
					id="product-image"
					className="lg:col-span-4 lg:row-end-1 "
				>
					{typeof product.imageSrc === "string" ? (
						<img
							src={product.imageSrc}
							alt={product.imageAlt}
							className="aspect-[4/3] w-full rounded-lg  bg-accent object-contain shadow-2xl"
							onLoad={updateDetailsHeight}
						/>
					) : (
						<Image
							src={product.imageSrc}
							alt={product.imageAlt}
							class="aspect-[4/3] w-full rounded-lg bg-accent object-contain shadow-2xl"
							width={1600}
							height={900}
							format="webp"
							quality={80}
						/>
					)}
				</div>

				{/* Product details */}
				<div
					ref={productDetailsRef}
					id="product-details"
					className="mx-auto mt-8 sm:mt-10 lg:mt-0 max-w-2xl lg:col-span-5 lg:row-span-2 lg:row-end-2 lg:max-w-none w-full"
				>
					<h2 className="text-xl  font-bold tracking-tight text-foreground sm:text-3xl mb-4 lg:mb-6">
						Product Information
					</h2>
					<ScrollArea className="px-4 lg:px-6 py-2 border-0 lg:border rounded-lg">
						<div className="pb-4">
							<Accordion
								type="multiple"
								defaultValue={defaultSection ? [defaultSection] : []}
								className="w-full"
							>
								{visibleSections.map((section, index) => (
									<AccordionItem
										key={section.id}
										value={section.id}
										className={cn(
											index === visibleSections.length - 1 &&
												"data-[state=open]:border-b-0",
										)}
									>
										<AccordionTrigger>{section.title}</AccordionTrigger>
										<AccordionContent>{section.content}</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
