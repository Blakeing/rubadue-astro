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

interface ProductPageProps {
	product: {
		name: string;
		version?: { name: string; date: string; datetime: string };
		price?: string;
		description: string;
		highlights?: string[];
		imageSrc: string | ImageMetadata;
		imageAlt: string;
		specifications?: {
			conductor?: string;
			insulation?: string;
			temperature?: string;
			voltage?: string;
			tensileStrength?: string;
		};
		compliances?: string[];
		systemApprovals?: string[];
		category: string;
		overview?: string;
		applications?: string[];
	};
	reviews?: {
		average: number;
		featured: Array<{
			id: number;
			rating: number;
			content: string;
			date: string;
			datetime: string;
			author: string;
			avatarSrc: string;
		}>;
	};
	faqs?: Array<{
		question: string;
		answer: string;
	}>;
	license?: {
		href: string;
		summary: string;
		content: string;
	};
}

export default function ProductPage({
	product,
	reviews,
	faqs,
	license,
}: ProductPageProps) {
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
								defaultValue={["overview"]}
								className="w-full [&>*:last-child]:data-[state=open]:border-b-0"
							>
								{/* Product Overview */}
								{product.overview && (
									<AccordionItem value="overview">
										<AccordionTrigger>Overview</AccordionTrigger>
										<AccordionContent>
											<p className="text-sm text-foreground">
												{product.overview}
											</p>
										</AccordionContent>
									</AccordionItem>
								)}

								{/* Common Applications */}
								{product.applications && (
									<AccordionItem value="applications">
										<AccordionTrigger>Common Applications</AccordionTrigger>
										<AccordionContent>
											<ul className="list-disc space-y-2 pl-5 text-sm">
												{product.applications.map((application) => (
													<li key={application}>{application}</li>
												))}
											</ul>
										</AccordionContent>
									</AccordionItem>
								)}

								{/* Product Construction */}
								<AccordionItem value="construction">
									<AccordionTrigger>Product Construction</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-4">
											{product.specifications && (
												<>
													{product.specifications.conductor && (
														<div className="flex items-center">
															<dt className="w-1/3 flex-none text-sm text-muted-foreground">
																Conductor:
															</dt>
															<dd className="text-sm text-foreground">
																{product.specifications.conductor}
															</dd>
														</div>
													)}
													{product.specifications.insulation && (
														<div className="flex items-center">
															<dt className="w-1/3 flex-none text-sm text-muted-foreground">
																Insulation:
															</dt>
															<dd className="text-sm text-foreground">
																{product.specifications.insulation}
															</dd>
														</div>
													)}
													{product.specifications.temperature && (
														<div className="flex items-center">
															<dt className="w-1/3 flex-none text-sm text-muted-foreground">
																Temperature:
															</dt>
															<dd className="text-sm text-foreground">
																{product.specifications.temperature}
															</dd>
														</div>
													)}
													{product.specifications.voltage && (
														<div className="flex items-center">
															<dt className="w-1/3 flex-none text-sm text-muted-foreground">
																Voltage:
															</dt>
															<dd className="text-sm text-foreground">
																{product.specifications.voltage}
															</dd>
														</div>
													)}
													{product.specifications.tensileStrength && (
														<div className="flex items-center">
															<dt className="w-1/3 flex-none text-sm text-muted-foreground">
																Tensile Strength:
															</dt>
															<dd className="text-sm text-foreground">
																{product.specifications.tensileStrength}
															</dd>
														</div>
													)}
												</>
											)}
										</div>
									</AccordionContent>
								</AccordionItem>

								{/* Compliances & Approvals */}
								{(product.compliances || product.systemApprovals) && (
									<AccordionItem
										value="compliances"
										className="data-[state=open]:border-b-0"
									>
										<AccordionTrigger>Compliances & Approvals</AccordionTrigger>
										<AccordionContent>
											<div className="space-y-6">
												{product.compliances && (
													<div>
														<dt className="text-sm text-muted-foreground mb-2">
															Compliances:
														</dt>
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
											</div>
										</AccordionContent>
									</AccordionItem>
								)}
							</Accordion>
						</ScrollArea>
					</div>
				</div>

				{/* Tabs section */}
				{/* <div className="mx-auto mt-16 w-full max-w-2xl lg:max-w-none">
						<Card>
							<CardContent className="pt-6">
								<Tabs
									defaultValue={reviews ? "reviews" : faqs ? "faq" : "license"}
									className="space-y-16"
								>
									<TabsList className="w-full justify-start">
										{reviews && (
											<TabsTrigger value="reviews">Reviews</TabsTrigger>
										)}
										{faqs && <TabsTrigger value="faq">FAQ</TabsTrigger>}
										{license && (
											<TabsTrigger value="license">License</TabsTrigger>
										)}
									</TabsList>

									{reviews && (
										<TabsContent value="reviews" className="space-y-8">
											<div>
												<h2 className="text-lg font-medium text-foreground">
													Customer Reviews ({reviews.average}/5)
												</h2>
												<div className="mt-6 space-y-10">
													{reviews.featured.map((review) => (
														<div key={review.id} className="flex space-x-4">
															<div className="flex-none">
																<img
																	src={review.avatarSrc}
																	alt={review.author}
																	className="h-10 w-10 rounded-full bg-muted"
																/>
															</div>
															<div className="flex-1">
																<h3 className="font-medium text-foreground">
																	{review.author}
																</h3>
																<div className="mt-1 flex items-center">
																	{[0, 1, 2, 3, 4].map((rating) => (
																		<Star
																			key={rating}
																			className={classNames(
																				review.rating > rating
																					? "text-primary"
																					: "text-muted-foreground",
																				"h-4 w-4",
																			)}
																			fill="currentColor"
																		/>
																	))}
																</div>
																<p className="mt-2 text-sm text-muted-foreground">
																	{review.content}
																</p>
																<p className="mt-2 text-sm text-muted-foreground">
																	<time dateTime={review.datetime}>
																		{review.date}
																	</time>
																</p>
															</div>
														</div>
													))}
												</div>
											</div>
										</TabsContent>
									)}

									{faqs && (
										<TabsContent value="faq" className="space-y-8">
											<div>
												<h2 className="text-lg font-medium text-foreground">
													Frequently Asked Questions
												</h2>
												<div className="mt-6 space-y-8">
													{faqs.map((faq) => (
														<Card key={faq.question}>
															<CardHeader>
																<CardTitle className="text-base">
																	{faq.question}
																</CardTitle>
															</CardHeader>
															<CardContent>
																<p className="text-sm text-muted-foreground">
																	{faq.answer}
																</p>
															</CardContent>
														</Card>
													))}
												</div>
											</div>
										</TabsContent>
									)}

									{license && (
										<TabsContent value="license" className="space-y-8">
											<div>
												<h2 className="text-lg font-medium text-foreground">
													License Information
												</h2>
												<div className="mt-6">
													<p className="font-medium text-foreground">
														{license.summary}
													</p>
													<p className="mt-4 text-sm text-muted-foreground">
														{license.content}
													</p>
													<a
														href={license.href}
														className="mt-4 inline-block text-sm text-primary hover:text-primary/80"
													>
														View full terms →
													</a>
												</div>
											</div>
										</TabsContent>
									)}
								</Tabs>
							</CardContent>
						</Card>
					</div> */}
			</div>
		</div>
	);
}
