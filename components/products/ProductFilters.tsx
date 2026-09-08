"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CategoryNode } from "@/lib/shared-types";
import { COLOR_SWATCHES } from "@/lib/color-swatches";
import { formatPrice } from "@/lib/format";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const SIZES = ["S", "M", "L", "XL"];
const PRICE_MAX = 2_000_000;
const PRICE_STEP = 50_000;

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-border py-4 first:pt-0" open>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <Plus className="size-4 text-muted-foreground group-open:hidden" />
        <Minus className="hidden size-4 text-muted-foreground group-open:block" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

// Đang có search (?search=...) thì lọc danh mục phải CỘNG DỒN vào cùng URL /san-pham hiện
// tại (giữ nguyên search + mọi filter khác), không được nhảy sang route /danh-muc/<slug>
// riêng — route đó không mang theo search, bấm vào sẽ mất luôn từ khoá đang tìm. Không có
// search thì giữ đúng hành vi cũ: dùng route /danh-muc/<slug> (URL đẹp, tốt cho SEO danh mục).
function categoryHref(
  searchParams: URLSearchParams,
  activeCategorySlug: string | undefined,
  targetSlug: string,
): string {
  const isActive = activeCategorySlug === targetSlug;
  if (searchParams.get("search")) {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) params.delete("category");
    else params.set("category", targetSlug);
    params.delete("page");
    return `/san-pham?${params.toString()}`;
  }
  return isActive ? "/san-pham" : `/danh-muc/${targetSlug}`;
}

function CategoryLinks({
  categories,
  activeCategorySlug,
}: {
  categories: CategoryNode[];
  activeCategorySlug?: string;
}) {
  const searchParams = useSearchParams();

  return (
    <ul className="space-y-1">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={categoryHref(searchParams, activeCategorySlug, category.slug)}
            className={cn(
              "block rounded-sm px-2 py-1 text-sm transition-colors hover:bg-secondary",
              activeCategorySlug === category.slug
                ? "bg-secondary font-bold text-primary"
                : "text-muted-foreground",
            )}
          >
            {category.name}
          </Link>
          {category.children.length > 0 ? (
            <ul className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
              {category.children.map((child) => (
                <li key={child.id}>
                  <Link
                    href={categoryHref(searchParams, activeCategorySlug, child.slug)}
                    className={cn(
                      "block rounded-sm px-2 py-1 text-sm transition-colors hover:bg-secondary",
                      activeCategorySlug === child.slug
                        ? "bg-secondary font-bold text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ProductFilters({
  categories,
  activeCategorySlug,
}: {
  categories: CategoryNode[];
  activeCategorySlug?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSizes = searchParams.get("size")?.split(",").filter(Boolean) ?? [];
  const selectedColors = searchParams.get("color")?.split(",").filter(Boolean) ?? [];
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? PRICE_MAX);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleMultiValue(key: "size" | "color", value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  }

  function commitPriceRange(value: number[]) {
    const [next0, next1] = value;
    updateParams({
      minPrice: next0 > 0 ? String(next0) : null,
      maxPrice: next1 < PRICE_MAX ? String(next1) : null,
    });
  }

  return (
    <aside>
      <FilterSection title="Danh mục">
        <CategoryLinks categories={categories} activeCategorySlug={activeCategorySlug} />
      </FilterSection>

      <FilterSection title="Khoảng giá">
        <div className="px-1">
          <Slider
            value={priceRange}
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            onValueCommitted={(value) => commitPriceRange(value as number[])}
          />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Kích cỡ">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleMultiValue("size", size, selectedSizes)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-sm border px-2.5 text-sm font-medium transition-colors",
                selectedSizes.includes(size)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Màu sắc">
        <div className="flex flex-wrap gap-3">
          {Object.entries(COLOR_SWATCHES).map(([color, hex]) => (
            <button
              key={color}
              type="button"
              onClick={() => toggleMultiValue("color", color, selectedColors)}
              aria-label={color}
              aria-pressed={selectedColors.includes(color)}
              className={cn(
                "flex flex-col items-center gap-1 text-xs text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2",
                  selectedColors.includes(color) ? "border-primary" : "border-transparent",
                )}
              >
                <span
                  className="size-6 rounded-full border border-border"
                  style={{ backgroundColor: hex }}
                />
              </span>
              {color}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
