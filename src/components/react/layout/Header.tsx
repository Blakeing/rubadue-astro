import {
	Button,
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
	navigationMenuTriggerStyle,
} from "@/components/react/ui";
import { cn } from "@/lib/utils";
import { Book, Cable, Menu, Settings, Shield, Wrench } from "lucide-react";
import * as React from "react";

const mainNavigation = [
	{ name: "Catalog", href: "/catalog" },
	{ name: "About", href: "/about" },
	{ name: "Markets", href: "/markets" },
	{ name: "Custom Solutions", href: "/custom-solutions" },
	{ name: "Careers", href: "/careers" },
];

const resources = [
	{ name: "Part Number Builders", href: "/part-number-builders", icon: Wrench },
	{ name: "Glossary", href: "/glossary", icon: Book },
	{ name: "N1 Max Calculator", href: "/n1-max-calculator", icon: Settings },
	{ name: "Knowledge Base", href: "/knowledge-base", icon: Book },
	{ name: "Health & Safety", href: "/health-safety", icon: Shield },
];

export function Header() {
	return (
		<header className="sticky top-0 z-50">
			<div className="hidden lg:block bg-muted py-2">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-end gap-4">
						<a
							href="/contact"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							Contact Us
						</a>

						<a
							href="/request-a-quote"
							className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
						>
							Request a Quote
						</a>
					</div>
				</div>
			</div>
			<div className="bg-background shadow">
				<nav className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8 items-center justify-between py-2 sm:py-4 md:py-6">
					<a
						href="/"
						className="font-display text-shadow-lg text-xl lg:text-3xl tracking-tight"
					>
						Rubadue{" "}
						<span className="text-primary -ml-[4px] lg:-ml-[8px]">Wire</span>
					</a>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<NavigationMenu className="mr-4" data-hover="false">
							<NavigationMenuList>
								{mainNavigation.map((item) => (
									<NavigationMenuItem key={item.name}>
										<NavigationMenuLink
											asChild
											className={navigationMenuTriggerStyle()}
										>
											<a
												className="font-semibold tracking-wide"
												href={item.href}
											>
												{item.name}
											</a>
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}

								<NavigationMenuItem>
									<NavigationMenuTrigger className="font-semibold tracking-wide">
										Resources
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<div className="min-w-60 p-6">
											<div className="space-y-2">
												{resources.map((item) => (
													<a
														key={item.name}
														href={item.href}
														className="flex items-center gap-x-2 text-sm font-semibold text-foreground hover:text-accent-foreground"
													>
														<item.icon className="h-5 w-5 flex-none text-muted-foreground" />
														<span>{item.name}</span>
													</a>
												))}
											</div>
										</div>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
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

const ListItem = React.forwardRef<
	React.ComponentRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
