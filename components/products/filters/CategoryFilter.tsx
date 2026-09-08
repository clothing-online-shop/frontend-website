import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CategoryNode } from "@/lib/shared-types";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/products/filters/FilterSection";

function categoryHref(
  searchParams: URLSearchParams,
  isActive: boolean,
  targetSlug: string,
): string {
  if (searchParams.get("search")) {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) params.delete("category");
    else params.set("category", targetSlug);
    return `/san-pham?${params.toString()}`;
  }
  return isActive ? "/san-pham" : `/danh-muc/${targetSlug}`;
}

function CategoryRow({
  category,
  activeCategorySlug,
}: {
  category: CategoryNode;
  activeCategorySlug?: string;
}) {
  const searchParams = useSearchParams();
  const isActive = activeCategorySlug === category.slug;
  return (
    <Link
      href={categoryHref(searchParams, isActive, category.slug)}
      className={cn(
        "flex items-center justify-between rounded-sm px-2 py-1 text-sm transition-colors hover:bg-secondary",
        isActive ? "bg-secondary font-bold text-primary" : "text-muted-foreground",
      )}
    >
      <span>{category.name}</span>
      <span className="text-xs text-muted-foreground">{category.productCount}</span>
    </Link>
  );
}

export function CategoryFilter({
  categories,
  activeCategorySlug,
}: {
  categories: CategoryNode[];
  activeCategorySlug?: string;
}) {
  return (
    <FilterSection title="Danh mục">
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryRow category={category} activeCategorySlug={activeCategorySlug} />
            {category.children.length > 0 ? (
              <ul className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <CategoryRow category={child} activeCategorySlug={activeCategorySlug} />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </FilterSection>
  );
}
