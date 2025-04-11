import {
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
	SheetTitle,
	SheetTrigger,
	navigationMenuTriggerStyle,
} from "@/components/react/ui";
import { cn } from "@/lib/utils";
import { Book, Cable, Menu, Settings, Shield, Wrench } from "lucide-react";
import * as React from "react";
import { TextLogo } from "./TextLogo";

const navigation = [
	{ name: "Catalog", href: "/catalog" },
	{ name: "About", href: "/about" },
	{ name: "Markets", href: "/markets" },
	{ name: "Careers", href: "/careers" },
	{ name: "Contact Us", href: "/contact" },
	{ name: "Request a Quote", href: "/request-a-quote" },
	{ name: "Part Number Builders", href: "/part-number-builders" },
	{ name: "Glossary", href: "/glossary" },
	{ name: "Knowledge Base", href: "/knowledge-base" },
];

const wireTypes = [
	{ name: "Bare Litz Wires", href: "/catalog", icon: Cable },
	{
		name: "Insulated Litz Wires",
		href: "/catalog",
		icon: Cable,
	},
	{
		name: "Triple Insulated Wires",
		href: "/catalog",
		icon: Cable,
	},
	{
		name: "Double Insulated Wires",
		href: "/catalog",
		icon: Cable,
	},
	{
		name: "Single Insulated Wires",
		href: "/catalog",
		icon: Cable,
	},
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
		<div className="sticky top-0 z-50">
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
			<header className="bg-background shadow">
				<nav className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8 items-center justify-between py-3 sm:py-4 md:py-6">
					{/* <a className="font-semibold tracking-wide" href="/" className="-m-1.5 p-1.5">
						<TextLogo className="h-4 lg:h-5" />
					</a> */}
					<a
						href="/"
						// style={{ textShadow: "0 0 1px hsla(20 14.3% 4.1% / 0.5)" }}
						className="font-display text-shadow-lg text-xl lg:text-3xl tracking-tight"
					>
						Rubadue <span className="text-primary -ml-[8px]">Wire</span>
					</a>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<NavigationMenu className="mr-4" data-hover="false">
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<a className="font-semibold tracking-wide" href="/catalog">
											Catalog
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem>

								<NavigationMenuItem>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<a className="font-semibold tracking-wide" href="/about">
											About
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem>

								<NavigationMenuItem>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<a className="font-semibold tracking-wide" href="/markets">
											Markets
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<a
											className="font-semibold tracking-wide"
											href="/custom-solutions"
										>
											Custom Solutions
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<a className="font-semibold tracking-wide" href="/careers">
											Careers
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem>
								{/* <NavigationMenuItem>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<a className="font-semibold tracking-wide" href="/contact">
											Contact Us
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem> */}
								{/* <NavigationMenuItem>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<a
											className="font-semibold tracking-wide"
											href="/request-a-quote"
										>
											Request a Quote
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem> */}

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
									className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
									aria-label="Open main menu"
								>
									<span className="sr-only">Open main menu</span>
									<Menu className="h-6 w-6" />
								</button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="w-full max-w-xs sm:max-w-sm"
							>
								<SheetTitle className="text-lg">Navigation Menu</SheetTitle>
								<SheetDescription className="text-sm">
									Browse our wire products and resources.
								</SheetDescription>
								<div className="mt-6 flow-root">
									<div className="-my-6 divide-y divide-border">
										<div className="space-y-1 py-6">
											{navigation.map((item) => (
												<SheetClose asChild key={item.name}>
													<a
														href={item.href}
														className="flex items-center justify-between -mx-3 rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-accent hover:text-accent-foreground"
													>
														<span>{item.name}</span>
													</a>
												</SheetClose>
											))}
										</div>
										<div className="py-6">
											<SheetClose asChild>
												<a
													href="/request-a-quote"
													className="flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
												>
													Request a Quote
												</a>
											</SheetClose>
										</div>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</nav>
			</header>
		</div>
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
