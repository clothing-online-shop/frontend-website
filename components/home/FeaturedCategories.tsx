"use client";

import Image from "next/image";
import Link from "next/link";
import type { CategoryNode } from "@/lib/shared-types";
import { FEATURED_CATEGORY_FALLBACK_IMAGE } from "@/lib/home-mock";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const MAX_FEATURED_CATEGORIES = 8;

function flattenCategories(categories: CategoryNode[]): CategoryNode[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children)]);
}

export function FeaturedCategories({ categories }: { categories: CategoryNode[] }) {
  const featured = flattenCategories(categories).slice(0, MAX_FEATURED_CATEGORIES);

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="mb-6 font-heading text-size-30 font-normal">Danh mục nổi bật</h2>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {featured.map((category) => (
            <CarouselItem key={category.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
              <Link href={`/danh-muc/${category.slug}`} className="group flex flex-col items-center gap-3 text-center">
                <div className="relative aspect-square w-full overflow-hidden rounded-full bg-secondary">
                  <Image
                    src={category.image ?? FEATURED_CATEGORY_FALLBACK_IMAGE(category.slug)}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 40vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="font-heading text-sm font-bold uppercase transition-colors group-hover:text-primary sm:text-base">
                  {category.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
