"use client";

import Image from "next/image";
import Link from "next/link";
import type { CategoryNode } from "@/lib/shared-types";
import { flattenCategories } from "@/lib/categoryTree";
import { FEATURED_CATEGORY_FALLBACK_IMAGE } from "@/lib/home-mock";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const MAX_FEATURED_CATEGORIES = 8;

export function FeaturedCategories({ categories }: { categories: CategoryNode[] }) {
  const featured = flattenCategories(categories).slice(0, MAX_FEATURED_CATEGORIES);

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-heading text-size-30 font-normal">Danh mục sản phẩm nổi bật</h2>
        <Link
          href="/san-pham?sort=best_selling"
          className="text-sm font-bold text-primary hover:underline"
        >
          Tất cả danh mục →
        </Link>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {featured.map((category) => (
            <CarouselItem key={category.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
              <Link href={`/danh-muc/${category.slug}`} className="group flex flex-col items-start gap-3">
                <div className="relative aspect-3/4 w-full overflow-hidden bg-secondary">
                  <Image
                    src={category.image ?? FEATURED_CATEGORY_FALLBACK_IMAGE(category.slug)}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 40vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold transition-colors group-hover:text-primary sm:text-base">
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{category.productCount} mẫu</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 2xl:-left-3" />
        <CarouselNext className="right-2 2xl:-right-3" />
      </Carousel>
    </section>
  );
}
