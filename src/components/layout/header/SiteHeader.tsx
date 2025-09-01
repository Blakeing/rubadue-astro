	import {
		Button,
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
		NavigationMenu,
		NavigationMenuContent,
		NavigationMenuItem,
		NavigationMenuLink,
		NavigationMenuList,
		NavigationMenuTrigger,
		Sheet,
		SheetClose,
		SheetContent,
		SheetDescription,
		SheetFooter,
		SheetHeader,
		SheetTitle,
		SheetTrigger,
	} from "@/components/ui";
	import { cn } from "@/lib/utils";
	import {
	Book,
	Cable,
	ChevronDown,
	ChevronRight,
	Menu,
	Settings,
	Shield,
	Target,
	Wrench,
} from "lucide-react";
	import * as React from "react";

	// Import knowledge base hero placeholder image
	import knowledgeBaseHero from "@/assets/backgrounds/knowledge-base-hero-placeholder.webp";

	const mainNavigation = [
		{ name: "Custom", href: "/custom-solutions" },
		{ name: "Markets", href: "/markets" },
	];

	const productTypes = [
		{
			name: "Single Insulated",
			href: "/products?type=Single%20Insulated",
			description: "Single layer insulation for standard applications",
		},
		{
			name: "Double Insulated",
			href: "/products?type=Double%20Insulated",
			description: "Dual layer insulation for enhanced protection",
		},
		{
			name: "Triple Insulated",
			href: "/products?type=Triple%20Insulated",
			description: "Triple layer insulation for maximum safety",
		},
		{
			name: "Litz Wire",
			href: "/products?type=Litz%20Wire",
			description: "Multi-strand constructions for high-frequency applications",
		},
	];

	const aboutPages = [
		{ name: "Our Story", href: "/about/our-story", icon: Book },
		{ name: "Why Rubadue", href: "/about/why-rubadue", icon: Target },
	];

	const engineerTools = [
		{ name: "Part Number Builders", href: "/part-number-builders", icon: Wrench },
		{ name: "N1 Max Calculator", href: "/n1-max-calculator", icon: Settings },
		{ name: "Litz Design Tool", href: "/litz-design-tool", icon: Cable },
	];

	const resources = [
		{ name: "Glossary", href: "/glossary", icon: Book },
		{ name: "Knowledge Base", href: "/knowledge-base", icon: Book },
		{ name: "Distributors", href: "/distributors", icon: Target },
		{ name: "Health & Safety", href: "/health-safety", icon: Shield },
	];

	export function Header() {
		const [productsExpanded, setProductsExpanded] = React.useState(false);

		return (
			<header className="sticky top-0 z-50 will-change-transform">
				<div className="hidden lg:block bg-muted py-2">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-end gap-4">
							<a
								href="/careers"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Careers
							</a>
							<div className="h-4 w-px bg-border"></div>
							<a
								href="/contact"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Contact Us
							</a>
							<div className="h-4 w-px bg-border"></div>
							<a
								href="/request-a-quote"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Request a Quote
							</a>
						</div>
					</div>
				</div>
				<div className="bg-background shadow transform-gpu">
					<nav className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8 items-center justify-between py-2 sm:py-4 md:py-6">
						<a
							href="/"
							className="flex items-center gap-3 font-display text-shadow-lg text-xl lg:text-3xl tracking-tight min-w-0 transform-gpu"
						>
							<span>
								Rubadue{" "}
								<span className="text-primary ">Wire</span>
							</span>
							<svg 
								xmlns="http://www.w3.org/2000/svg" 
								xmlSpace="preserve" 
								viewBox="0 0 106 31"
								className="h-6 sm:h-8 w-[82px] sm:w-[109px]"
								shapeRendering="geometricPrecision"
								aria-label="Rubadue Logo"
							>
								<path d="M15.71 3.74c6.51 0 11.8 5.29 11.8 11.8 0 6.51-5.29 11.8-11.8 11.8-6.51 0-11.8-5.29-11.8-11.8 0-6.51 5.29-11.8 11.8-11.8m0-3.37C7.33.37.54 7.16.54 15.54s6.79 15.17 15.17 15.17c8.38 0 15.17-6.79 15.17-15.17S24.09.37 15.71.37zm37.38 2.8c6.82 0 12.37 5.55 12.37 12.37 0 6.82-5.55 12.37-12.37 12.37s-12.37-5.55-12.37-12.37c0-6.82 5.55-12.37 12.37-12.37m0-2.8c-8.38 0-15.17 6.79-15.17 15.17s6.79 15.17 15.17 15.17c8.38 0 15.17-6.79 15.17-15.17S61.47.37 53.09.37zm37.38 3.37c6.51 0 11.8 5.29 11.8 11.8 0 6.51-5.29 11.8-11.8 11.8-6.51 0-11.8-5.29-11.8-11.8 0-6.51 5.29-11.8 11.8-11.8m0-3.37C82.09.37 75.3 7.16 75.3 15.54s6.79 15.17 15.17 15.17c8.38 0 15.17-6.79 15.17-15.17S98.85.37 90.47.37z"/>
								<path d="M53.09 5.96c5.28 0 9.57 4.29 9.57 9.57s-4.29 9.57-9.57 9.57-9.57-4.29-9.57-9.57c0-5.27 4.29-9.57 9.57-9.57m0-1.6c-6.17 0-11.17 5-11.17 11.17s5 11.17 11.17 11.17 11.17-5 11.17-11.17c0-6.16-5-11.17-11.17-11.17z"/>
								<path d="M53.09 8.89c3.66 0 6.65 2.98 6.65 6.65s-2.98 6.65-6.65 6.65-6.65-2.98-6.65-6.65 2.99-6.65 6.65-6.65m0-1.6c-4.55 0-8.25 3.69-8.25 8.25 0 4.55 3.69 8.25 8.25 8.25 4.55 0 8.25-3.69 8.25-8.25-.01-4.55-3.7-8.25-8.25-8.25z"/>
								<path fill="#c06536" d="M99.57 15.54c0 5.03-4.08 9.1-9.1 9.1-5.03 0-9.1-4.07-9.1-9.1 0-5.03 4.07-9.1 9.1-9.1 5.03-.01 9.1 4.07 9.1 9.1zm-41.44 0c0 2.78-2.26 5.04-5.04 5.04-2.78 0-5.04-2.25-5.04-5.04 0-2.78 2.26-5.04 5.04-5.04 2.78 0 5.04 2.26 5.04 5.04zM18.55 13.9c.9 1.57.37 3.57-1.2 4.48-1.57.9-3.57.37-4.48-1.2-.9-1.56-.37-3.57 1.2-4.47 1.57-.91 3.57-.38 4.48 1.19zm-3.82-6.62c.91 1.57.37 3.57-1.2 4.47-1.57.91-3.57.37-4.48-1.2-.9-1.57-.37-3.57 1.2-4.48 1.57-.89 3.57-.35 4.48 1.21zm-6.66 4.98c1.81 0 3.28 1.47 3.28 3.28 0 1.81-1.47 3.27-3.28 3.28-1.81 0-3.28-1.47-3.28-3.28 0-1.81 1.47-3.28 3.28-3.28zm.98 8.26c.9-1.57 2.91-2.11 4.48-1.2 1.57.9 2.1 2.91 1.2 4.47-.9 1.57-2.91 2.11-4.48 1.2-1.57-.9-2.1-2.91-1.2-4.47zm7.64 3.27c-.9-1.57-.37-3.57 1.2-4.48 1.57-.91 3.57-.37 4.48 1.2.9 1.57.37 3.57-1.2 4.48-1.57.91-3.57.37-4.48-1.2zm6.66-4.97c-1.81 0-3.28-1.47-3.28-3.28 0-1.81 1.47-3.28 3.28-3.28 1.81 0 3.28 1.47 3.28 3.28 0 1.81-1.47 3.28-3.28 3.28zm-.98-8.26c-.9 1.57-2.91 2.1-4.48 1.2-1.57-.9-2.1-2.91-1.2-4.48.9-1.57 2.91-2.1 4.48-1.2 1.56.91 2.1 2.91 1.2 4.48z"/>
							</svg>
						</a>
						<div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-1">
																			<DropdownMenu>
							<DropdownMenuTrigger className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-semibold tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none data-[state=open]:bg-accent/50">
								Products
								<ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-[500px] lg:w-[650px] p-0">
								<div className="grid gap-3 p-4 lg:grid-cols-[.5fr_1fr]">
									<div className="flex flex-col h-full space-y-3">
										<a
											className="flex flex-1 w-full select-none flex-col justify-end rounded-md p-4 no-underline outline-none focus:shadow-md relative overflow-hidden cursor-pointer"
											href="/products"
											style={{
												backgroundImage: `url(${knowledgeBaseHero.src})`,
												backgroundSize: 'cover',
												backgroundPosition: 'center',
											}}
										>
											<div className="absolute inset-0 bg-foreground/70"></div>
											<div className="relative z-10">
												<div className="mb-2 text-base font-medium text-primary-foreground">
													All Products
												</div>
												<p className="text-xs leading-tight text-primary-foreground/90">
													Explore our complete range of high-performance wire products.
												</p>
											</div>
										</a>
										<a
											href="/part-number-builders"
											className="flex items-center justify-center rounded-md bg-background border border-foreground px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition-colors cursor-pointer flex-shrink-0"
										>
											Part Number Builders
										</a>
									</div>
									<div className="grid grid-cols-2 gap-3">
										{productTypes.map((product) => (
											<a
												key={product.name}
												href={product.href}
												className="group block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
											>
												<div className="text-sm font-medium leading-tight">
													{product.name}
												</div>
												<p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
													{product.description}
												</p>
											</a>
										))}
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

							{mainNavigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-semibold tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
								>
									{item.name}
								</a>
							))}

							<DropdownMenu>
								<DropdownMenuTrigger className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-semibold tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none data-[state=open]:bg-accent/50">
									About
									<ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="min-w-60">
									{aboutPages.map((item) => (
										<DropdownMenuItem key={item.name} asChild>
											<a
												href={item.href}
												className="flex items-center gap-x-2 text-sm font-semibold cursor-pointer"
											>
												<item.icon className="h-5 w-5 flex-none text-muted-foreground" />
												<span>{item.name}</span>
											</a>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>

							<DropdownMenu>
								<DropdownMenuTrigger className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-semibold tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none data-[state=open]:bg-accent/50">
									Engineer Tools
									<ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="min-w-60">
									{engineerTools.map((item) => (
										<DropdownMenuItem key={item.name} asChild>
											<a
												href={item.href}
												className="flex items-center gap-x-2 text-sm font-semibold cursor-pointer"
											>
												<item.icon className="h-5 w-5 flex-none text-muted-foreground" />
												<span>{item.name}</span>
											</a>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>

							<DropdownMenu>
								<DropdownMenuTrigger className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-semibold tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none data-[state=open]:bg-accent/50">
									Resources
									<ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="min-w-60">
									{resources.map((item) => (
										<DropdownMenuItem key={item.name} asChild>
											<a
												href={item.href}
												className="flex items-center gap-x-2 text-sm font-semibold cursor-pointer"
											>
												<item.icon className="h-5 w-5 flex-none text-muted-foreground" />
												<span>{item.name}</span>
											</a>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex lg:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<button
										type="button"
										className=" inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
										aria-label="Open main menu"
									>
										<span className="sr-only">Open main menu</span>
										<Menu className="h-6 w-6" />
									</button>
								</SheetTrigger>
								<SheetContent
									side="right"
									className="w-full max-w-xs sm:max-w-sm p-0"
								>
									<div className="flex h-full w-full flex-col">
										<SheetHeader className="flex-none border-b p-6 text-left">
											<SheetTitle className="text-lg">Navigation Menu</SheetTitle>
											<SheetDescription className="text-sm">
												Browse our wire products and resources.
											</SheetDescription>
										</SheetHeader>

										<div className="flex-1 overflow-y-auto">
											<div className="divide-y divide-border">
												<div className="space-y-0.5 p-4">
													{/* Products with submenu */}
													<div className="space-y-0.5">
														<button
															onClick={() => setProductsExpanded(!productsExpanded)}
															className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
														>
															<span>Products</span>
															<ChevronRight 
																className={cn(
																	"h-4 w-4 transition-transform duration-200",
																	productsExpanded && "rotate-90"
																)}
															/>
														</button>
														{productsExpanded && (
															<div className="ml-4 space-y-0.5 border-l border-border pl-4">
																<SheetClose asChild>
																	<a
																		href="/products"
																		className="flex items-center rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
																	>
																		<span>All Products</span>
																	</a>
																</SheetClose>
																{productTypes.map((product) => (
																	<SheetClose asChild key={product.name}>
																		<a
																			href={product.href}
																			className="flex items-center rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
																		>
																			<span>{product.name}</span>
																		</a>
																	</SheetClose>
																))}
															</div>
														)}
													</div>
													{mainNavigation.map((item) => (
														<SheetClose asChild key={item.name}>
															<a
																href={item.href}
																className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
															>
																<span>{item.name}</span>
															</a>
														</SheetClose>
													))}
												</div>
												<div className="p-4">
													<h3 className="pl-2 text-xs font-medium text-muted-foreground mb-1">
														About
													</h3>
													<div className="space-y-0.5">
														{aboutPages.map((item) => (
															<SheetClose asChild key={item.name}>
																<a
																	href={item.href}
																	className="flex items-center rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
																>
																	<span>{item.name}</span>
																</a>
															</SheetClose>
														))}
													</div>
												</div>
												<div className="p-4">
													<h3 className="pl-2 text-xs font-medium text-muted-foreground mb-1">
														Engineer Tools
													</h3>
													<div className="space-y-0.5">
														{engineerTools.map((item) => (
															<SheetClose asChild key={item.name}>
																<a
																	href={item.href}
																	className="flex items-center rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
																>
																	<span>{item.name}</span>
																</a>
															</SheetClose>
														))}
													</div>
												</div>
												<div className="p-4">
													<h3 className="pl-2 text-xs font-medium text-muted-foreground mb-1">
														Resources
													</h3>
													<div className="space-y-0.5">
														{resources.map((item) => (
															<SheetClose asChild key={item.name}>
																<a
																	href={item.href}
																	className="flex items-center rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
																>
																	<span>{item.name}</span>
																</a>
															</SheetClose>
														))}
													</div>
												</div>
											</div>
										</div>

										<SheetFooter className="flex-none border-t p-6">
											<SheetClose asChild>
												<a
													href="/request-a-quote"
													className="flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
												>
													Request a Quote
												</a>
											</SheetClose>
										</SheetFooter>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</nav>
				</div>
			</header>
		);
	}