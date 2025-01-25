"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/react/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/react/ui/select";
import { Button } from "@/components/react/ui/button";
import { Checkbox } from "@/components/react/ui/checkbox";
import { ScrollArea } from "@/components/react/ui/scroll-area";

const sortOptions = [
  { name: "Most Popular", value: "popular" },
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
];

const filters = {
  category: [
    { label: "Magnet Wire", value: "magnet-wire" },
    { label: "Litz Wire", value: "litz-wire" },
    { label: "Custom Solutions", value: "custom" },
  ],
  temperature: [
    { label: "130°C", value: "130" },
    { label: "155°C", value: "155" },
    { label: "180°C", value: "180" },
    { label: "200°C", value: "200" },
  ],
  voltage: [
    { label: "600V", value: "600" },
    { label: "1000V", value: "1000" },
  ],
};

interface Product {
  slug: string;
  data: {
    title: string;
    description: string;
    heroImage?: string;
    category: string;
    specifications?: {
      conductor?: string;
      insulation?: string;
      temperature?: string;
      voltage?: string;
      tensileStrength?: string;
    };
  };
}

interface ProductListingPageProps {
  products: Product[];
  categories: string[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductListingPage({
  products,
  categories,
}: ProductListingPageProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="bg-background">
      <div>
        {/* Mobile filter dialog */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetContent side="left" className="flex h-full flex-col">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <ScrollArea className="px-4">
              <form className="mt-4">
                {Object.entries(filters).map(([filterName, options]) => (
                  <div key={filterName} className="border-b border-muted pb-6">
                    <h3 className="mb-4 font-medium capitalize">
                      {filterName}
                    </h3>
                    <div className="space-y-4">
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox id={option.value} />
                          <label
                            htmlFor={option.value}
                            className="text-sm text-muted-foreground"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </form>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-muted pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight">Products</h1>

            <div className="flex items-center">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                className="ml-4 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                {Object.entries(filters).map(([filterName, options]) => (
                  <div key={filterName} className="border-b border-muted py-6">
                    <h3 className="mb-4 font-medium capitalize">
                      {filterName}
                    </h3>
                    <div className="space-y-4">
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox id={option.value} />
                          <label
                            htmlFor={option.value}
                            className="text-sm text-muted-foreground"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products.map((product) => (
                    <a
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="group relative"
                    >
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-muted">
                        <img
                          src={
                            product.data.heroImage ||
                            "@/assets/rubadue-hero.webp"
                          }
                          alt={product.data.title}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {product.data.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {product.data.category}
                          </p>
                        </div>
                      </div>
                      {product.data.specifications && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(product.data.specifications).map(
                            ([key, value]) =>
                              value && (
                                <span
                                  key={key}
                                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                                >
                                  {value}
                                </span>
                              )
                          )}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
