import { Fragment } from "react";
import { Star } from "lucide-react";
import type { ImageMetadata } from "astro";
import { Image } from "astro:assets";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/react/ui/tabs";
import { Button } from "@/components/react/ui/button";
import { Card, CardContent } from "@/components/react/ui/card";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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
    <div className="bg-background">
      <div className="">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:col-span-4 lg:row-end-1">
            {typeof product.imageSrc === "string" ? (
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="aspect-[4/3] w-full rounded-lg bg-muted object-cover"
              />
            ) : (
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                class="aspect-[4/3] w-full rounded-lg bg-muted object-cover"
                width={1600}
                height={900}
                format="webp"
                quality={80}
              />
            )}
          </div>

          {/* Product details */}
          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {product.name}
                </h1>

                {product.version && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Version {product.version.name} (Updated{" "}
                    <time dateTime={product.version.datetime}>
                      {product.version.date}
                    </time>
                    )
                  </p>
                )}
              </div>
            </div>

            <p className="mt-6 text-gray-500">{product.description}</p>

            {/* Specifications */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-foreground">
                Specifications
              </h2>
              <div className="mt-4 space-y-6">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <dt className="w-1/3 flex-none text-sm text-muted-foreground capitalize">
                        {key}:
                      </dt>
                      <dd className="text-sm text-foreground">{value}</dd>
                    </div>
                  ))}
              </div>
            </div>

            {/* Compliances and Approvals */}
            {(product.compliances || product.systemApprovals) && (
              <div className="mt-10">
                <h2 className="text-sm font-medium text-foreground">
                  Compliances & Approvals
                </h2>
                <div className="mt-4 space-y-6">
                  {product.compliances && (
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Compliances:
                      </dt>
                      <dd className="mt-2">
                        <ul className="list-disc space-y-2 pl-5 text-sm">
                          {product.compliances.map((compliance) => (
                            <li key={compliance}>{compliance}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                  {product.systemApprovals && (
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        System Approvals:
                      </dt>
                      <dd className="mt-2">
                        <ul className="list-disc space-y-2 pl-5 text-sm">
                          {product.systemApprovals.map((approval) => (
                            <li key={approval}>{approval}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs section */}
        <div className="mx-auto mt-16 w-full max-w-2xl lg:max-w-none">
          <Tabs
            defaultValue={reviews ? "reviews" : faqs ? "faq" : "license"}
            className="space-y-16"
          >
            <TabsList>
              {reviews && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
              {faqs && <TabsTrigger value="faq">FAQ</TabsTrigger>}
              {license && <TabsTrigger value="license">License</TabsTrigger>}
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
                                    ? "text-yellow-400"
                                    : "text-gray-300",
                                  "h-4 w-4"
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
                    {faqs.map((faq, index) => (
                      <div key={index}>
                        <h3 className="text-base font-medium text-foreground">
                          {faq.question}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
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
        </div>
      </div>
    </div>
  );
}
