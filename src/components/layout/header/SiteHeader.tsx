import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
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
	Menu,
	Settings,
	Shield,
	Target,
	Wrench,
} from "lucide-react";
import * as React from "react";

const mainNavigation = [
	{ name: "Product", href: "/products" },
	{ name: "Markets", href: "/markets" },
	{ name: "Custom", href: "/custom-solutions" },
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


