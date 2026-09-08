"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { CategoryNode } from "@/lib/shared-types";
import { getBrands } from "@/lib/brands-api";
import { CategoryFilter } from "@/components/products/filters/CategoryFilter";
import { PriceRangeFilter } from "@/components/products/filters/PriceRangeFilter";
import { SizeFilter } from "@/components/products/filters/SizeFilter";
import { ColorFilter } from "@/components/products/filters/ColorFilter";
import { BrandFilter } from "@/components/products/filters/BrandFilter";
import { ActiveFilterChips, buildPriceChipLabel } from "@/components/products/filters/ActiveFilterChips";

const PRICE_MAX = 2_000_000;

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
  const { data: brands } = useQuery({ queryKey: ["brands"], queryFn: getBrands });

  const selectedSizes = searchParams.get("size")?.split(",").filter(Boolean) ?? [];
  const selectedColors = searchParams.get("color")?.split(",").filter(Boolean) ?? [];
  const selectedBrandIds = searchParams.get("brand")?.split(",").filter(Boolean) ?? [];
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? PRICE_MAX);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleMultiValue(key: "size" | "color" | "brand", value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  }

  function removeFromMultiValue(key: "size" | "color" | "brand", value: string, current: string[]) {
    const next = current.filter((v) => v !== value);
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  }

  const priceChipLabel = buildPriceChipLabel(minPrice, maxPrice, PRICE_MAX);
  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedBrandIds.length > 0 ||
    priceChipLabel !== null;

  const chips = [
    ...selectedSizes.map((size) => ({
      key: `size-${size}`,
      label: `Size ${size}`,
      onRemove: () => removeFromMultiValue("size", size, selectedSizes),
    })),
    ...selectedColors.map((color) => ({
      key: `color-${color}`,
      label: `Màu ${color}`,
      onRemove: () => removeFromMultiValue("color", color, selectedColors),
    })),
    ...selectedBrandIds.map((brandId) => ({
      key: `brand-${brandId}`,
      label: brands?.find((b) => b.id === brandId)?.name ?? "Thương hiệu",
      onRemove: () => removeFromMultiValue("brand", brandId, selectedBrandIds),
    })),
    ...(priceChipLabel
      ? [
          {
            key: "price",
            label: priceChipLabel,
            onRemove: () => updateParams({ minPrice: null, maxPrice: null }),
          },
        ]
      : []),
  ];

  function clearAll() {
    updateParams({ size: null, color: null, brand: null, minPrice: null, maxPrice: null });
  }

  return (
    <aside className="bg-white p-6 max-h-[900px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase">Bộ lọc</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="cursor-pointer text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <ActiveFilterChips chips={chips} />

      <CategoryFilter categories={categories} activeCategorySlug={activeCategorySlug} />
      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onCommit={(min, max) =>
          updateParams({
            minPrice: min > 0 ? String(min) : null,
            maxPrice: max < PRICE_MAX ? String(max) : null,
          })
        }
      />
      <SizeFilter
        selectedSizes={selectedSizes}
        onToggle={(size) => toggleMultiValue("size", size, selectedSizes)}
      />
      <ColorFilter
        selectedColors={selectedColors}
        onToggle={(color) => toggleMultiValue("color", color, selectedColors)}
      />
      <BrandFilter
        selectedBrandIds={selectedBrandIds}
        onToggle={(brandId) => toggleMultiValue("brand", brandId, selectedBrandIds)}
      />
    </aside>
  );
}
