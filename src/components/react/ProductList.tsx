import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/react/ui/card";
import { Badge } from "@/components/react/ui/badge";

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

interface ProductListProps {
  products: Product[];
  categories: string[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList({
  products,
  categories,
}: ProductListProps) {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Our Products
          </h2>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="capitalize">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <Card key={product.slug} className="group relative">
              <CardContent className="p-0">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-muted lg:aspect-none lg:h-80">
                  <img
                    src={product.data.heroImage || "@/assets/rubadue-hero.webp"}
                    alt={product.data.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 px-4 pb-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      <a href={`/products/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.data.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.data.category}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm line-clamp-3 text-muted-foreground">
                      {product.data.description}
                    </p>
                  </div>
                  {product.data.specifications && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {Object.entries(product.data.specifications).map(
                        ([key, value]) =>
                          value && (
                            <Badge
                              key={key}
                              variant="outline"
                              className="text-xs"
                            >
                              {key}: {value}
                            </Badge>
                          )
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
