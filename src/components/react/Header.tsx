import * as React from "react";
import { cn } from "@/lib/utils";
import { Book, Cable, FileText, Menu, Settings, Wrench } from "lucide-react";
import logo from "@/assets/rubadue-logo.svg?url";
import { ThemeToggle } from "./theme-toggle";
import { TextLogo } from "./TextLogo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/react/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/react/ui/sheet";

const navigation = [
  { name: "Part Number Builders", href: "#" },
  { name: "Bare Litz Wires", href: "/products/bare-litz-wire" },
  { name: "Insulated Litz Wires", href: "#" },
  { name: "Triple Insulated Wires", href: "#" },
  { name: "Double Insulated Wires", href: "#" },
  { name: "Single Insulated Wires", href: "#" },
  { name: "Specialty Products", href: "#" },
  { name: "Technical Info", href: "#" },
  { name: "Notes", href: "#" },
  { name: "Glossary", href: "#" },
  { name: "Part Number Index", href: "#" },
];

const wireTypes = [
  { name: "Bare Litz Wires", href: "/products/bare-litz-wire", icon: Cable },
  {
    name: "Insulated Litz Wires",
    href: "/products/insulated-litz-wire",
    icon: Cable,
  },
  {
    name: "Triple Insulated Wires",
    href: "/products/triple-insulated-wire",
    icon: Cable,
  },
  {
    name: "Double Insulated Wires",
    href: "/products/double-insulated-wire",
    icon: Cable,
  },
  {
    name: "Single Insulated Wires",
    href: "/products/single-insulated-wire",
    icon: Cable,
  },
];

const resources = [
  { name: "Part Number Builders", href: "/part-number-builders", icon: Wrench },
  { name: "Technical Info", href: "#", icon: FileText },
  { name: "Notes", href: "#", icon: FileText },
  { name: "Glossary", href: "#", icon: Book },
  { name: "Part Number Index", href: "#", icon: Settings },
];

export function Header() {
  return (
    <header className="bg-background shadow sticky top-0 z-50">
      <nav className="mx-auto flex container items-center justify-between py-6 ">
        <a href="/" className="-m-1.5 p-1.5">
          <TextLogo />
        </a>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <NavigationMenu className="mr-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Wire Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                      Litz Wire Types
                    </h3>
                    <div className="space-y-2">
                      {wireTypes.map((item) => (
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
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-6">
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
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Specialty Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-6">
                    <div className="flex items-center gap-x-2 mb-4">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-sm font-medium text-foreground">
                        Specialty Products
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Explore our range of specialized wire products and custom
                      solutions.
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Browse our wire products and resources.
              </SheetDescription>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-between -mx-3 rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
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
            className
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
