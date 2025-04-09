import { Image } from "astro:assets";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	ScrollArea,
} from "@/components/react/ui";
import type { ImageMetadata } from "astro";

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
			sizeRange?: string | string[];
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

	filterContext?: {
		type: string[];
		material: string[];
		search: string;
	};
}

export default function ProductPage({
	product,
	filterContext,
}: ProductPageProps) {
	const getCatalogUrl = () => {
		if (!filterContext) return "/catalog";

		const params = new URLSearchParams();
		for (const type of filterContext.type) {
			params.append("type", type);
		}
		for (const material of filterContext.material) {
			params.append("material", material);
		}
		if (filterContext.search) params.set("q", filterContext.search);

		return `/catalog${params.toString() ? `?${params.toString()}` : ""}`;
	};

	const renderConstructionDetails = (
		construction: ProductPageProps["product"]["construction"],
	) => {
		if (!construction) return null;

		return (
			<>
				{construction.sizeRange && (
					<div className="space-y-1">
						<dt className="text-sm text-muted-foreground">Size Range:</dt>
						<dd className="text-sm text-foreground">
							{Array.isArray(construction.sizeRange) ? (
								<ul className="list-disc space-y-2 pl-5">
									{construction.sizeRange.map((size) => (
										<li key={size}>{size}</li>
									))}
								</ul>
							) : (
								construction.sizeRange
							)}
						</dd>
					</div>
				)}

				{construction.numberWires && (
					<div className="space-y-1">
						<dt className="text-sm text-muted-foreground">Number of Wires:</dt>
						<dd className="text-sm text-foreground">
							{construction.numberWires}
						</dd>
					</div>
				)}

				{construction.conductor && (
					<div className="space-y-1">
						<dt className="text-sm text-muted-foreground">Conductor:</dt>
						<dd className="text-sm text-foreground">
							{construction.conductor}
						</dd>
					</div>
				)}

				{construction.insulation && (
					<div className="space-y-1">
						<dt className="text-sm text-muted-foreground">Insulation:</dt>
						<dd className="text-sm text-foreground">
							{construction.insulation}
						</dd>
					</div>
				)}

				{construction.rating && (
					<div className="flex flex-col space-y-2">
						{construction.rating.temperature && (
							<div className="space-y-1">
								<dt className="text-sm text-muted-foreground">Temperature:</dt>
								<dd className="text-sm text-foreground">
									{construction.rating.temperature}
								</dd>
							</div>
						)}
						{construction.rating.voltage && (
							<div className="space-y-1">
								<dt className="text-sm text-muted-foreground">Voltage:</dt>
								<dd className="text-sm text-foreground">
									{construction.rating.voltage.join(", ")}
								</dd>
							</div>
						)}
					</div>
				)}

				{construction.coatings && (
					<div
						className={cn(
							"space-y-1",
							construction.coatings.length > 1 && "flex-col items-start",
						)}
					>
						<dt
							className={cn(
								"text-sm text-muted-foreground",
								construction.coatings.length > 1 && "mb-2",
							)}
						>
							Coatings:
						</dt>
						<dd>
							{construction.coatings.length > 1 ? (
								<ul className="list-disc space-y-2 pl-5 text-sm">
									{construction.coatings.map((coating) => (
										<li key={coating}>{coating}</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-foreground">
									{construction.coatings[0]}
								</p>
							)}
						</dd>
					</div>
				)}

				{product.tensileStrength && (
					<div className="space-y-1">
						<dt className="text-sm text-muted-foreground">Tensile Strength:</dt>
						<dd className="text-sm text-foreground">
							{product.tensileStrength}
						</dd>
					</div>
				)}
			</>
		);
	};

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
			show: !!product.construction || !!product.tensileStrength,
			content: (
				<div className="space-y-4">
					{renderConstructionDetails(product.construction)}
				</div>
			),
		},
		{
			id: "compliances",
			title: "Compliances",
			show: !!(product.compliances || product.systemApprovals),
			content: (
				<div className="space-y-4">
					{product.compliances && (
						<div className="space-y-2">
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
						<div className="space-y-2">
							<dt className="text-sm text-muted-foreground">
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
				</div>
			),
		},
	];

	const visibleSections = sections.filter((section) => section.show);
	const defaultSection = visibleSections[0]?.id;

	return (
		<div className="relative">
			<div className="lg:grid lg:grid-cols-9 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
				<div id="product-image" className="lg:col-span-4 lg:row-end-1">
					{typeof product.imageSrc === "string" ? (
						<img
							src={product.imageSrc}
							alt={product.imageAlt}
							className="aspect-[4/3] w-full rounded-lg bg-background object-cover shadow-lg sm:shadow-2xl"
						/>
					) : (
						<Image
							src={product.imageSrc}
							alt={product.imageAlt}
							class="aspect-[4/3] w-full rounded-lg bg-background object-contain shadow-lg sm:shadow-2xl"
							width={1600}
							height={900}
							format="webp"
							quality={80}
						/>
					)}
				</div>

				<div
					id="product-details"
					className="mx-auto mt-6 sm:mt-8 lg:mt-0 max-w-2xl lg:col-span-5 lg:row-span-2 lg:row-end-2 lg:max-w-none w-full"
				>
					<h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 lg:mb-6">
						Product Information
					</h2>
					<ScrollArea className="lg:h-96 lg:px-6 border-0 lg:border rounded-lg">
						<Accordion
							type="multiple"
							defaultValue={defaultSection ? [defaultSection] : []}
							className="w-full [&_[data-state=open]]:animate-none"
						>
							{visibleSections.map((section, index) => (
								<AccordionItem
									key={section.id}
									value={section.id}
									className={cn(
										index === visibleSections.length - 1 &&
											"data-[state=open]:border-b-0",
										index === 0 && "data-[state=open]",
									)}
								>
									<AccordionTrigger className="text-sm sm:text-base">
										{section.title}
									</AccordionTrigger>
									<AccordionContent className="data-[state=open]:animate-none">
										{section.content}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
