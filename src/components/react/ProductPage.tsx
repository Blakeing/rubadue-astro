import { Fragment } from "react";
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
			temperature?: string;
			voltage?: string | string[];
			numberWires?: string;
			coatings?: string[];
		};
		compliances?: string[];
		systemApprovals?: string[];
		category: string;
		overview?: string;
		applications?: string[];
		tensileStrength?: string;
	};

	license?: {
		href: string;
		summary: string;
		content: string;
	};
}

export default function ProductPage({ product, license }: ProductPageProps) {
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
							{product.construction.temperature && (
								<div className="flex items-center">
									<dt className="pr-2 flex-none text-sm text-muted-foreground">
										Temperature:
									</dt>
									<dd className="text-sm text-foreground">
										{product.construction.temperature}
									</dd>
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
							{product.construction.voltage && (
								<div className="flex items-start">
									<dt className="pr-2 flex-none text-sm text-muted-foreground">
										Voltage:
									</dt>
									<dd className="text-sm text-foreground">
										{Array.isArray(product.construction.voltage) ? (
											product.construction.voltage.length > 1 ? (
												<ul className="list-disc pl-5">
													{product.construction.voltage.map((v) => (
														<li key={v}>{v}</li>
													))}
												</ul>
											) : (
												product.construction.voltage[0]
											)
										) : (
											product.construction.voltage
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
		<div className="">
			<div className="">
				{/* Product */}
				<div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
					{/* Product image */}
					<div className="lg:col-span-4 lg:row-end-1">
						{typeof product.imageSrc === "string" ? (
							<img
								src={product.imageSrc}
								alt={product.imageAlt}
								className="aspect-[4/3] w-full rounded-lg bg-accent-foreground object-contain shadow-2xl"
							/>
						) : (
							<Image
								src={product.imageSrc}
								alt={product.imageAlt}
								class="aspect-[4/3] w-full rounded-lg bg-accent-foreground object-contain shadow-2xl"
								width={1600}
								height={900}
								format="webp"
								quality={80}
							/>
						)}
					</div>

					{/* Product details */}
					<div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none w-full">
						<h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-6">
							Product Information
						</h2>
						<ScrollArea className="h-[75vh]  lg:h-[440px] px-6 py-2 border rounded-lg">
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
						</ScrollArea>
					</div>
				</div>
			</div>
		</div>
	);
}
