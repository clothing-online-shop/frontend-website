import Image from "next/image";
import Link from "next/link";
import type { CategoryNode } from "@/lib/shared-types";
import { FEATURED_CATEGORY_FALLBACK_IMAGE } from "@/lib/home-mock";

const MAX_FEATURED_CATEGORIES = 8;

function flattenCategories(categories: CategoryNode[]): CategoryNode[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children)]);
}

export function FeaturedCategories({ categories }: { categories: CategoryNode[] }) {
  const featured = flattenCategories(categories).slice(0, MAX_FEATURED_CATEGORIES);

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="mb-6 font-heading text-2xl font-extrabold uppercase">Danh mục nổi bật</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {featured.map((category) => (
          <Link key={category.id} href={`/danh-muc/${category.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden bg-secondary">
              <Image
                src={category.image ?? FEATURED_CATEGORY_FALLBACK_IMAGE(category.slug)}
                alt={category.name}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
              <span className="absolute bottom-3 left-3 font-heading text-sm font-extrabold text-white uppercase sm:text-base">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
