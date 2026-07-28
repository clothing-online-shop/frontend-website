"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { CategoryNode } from "@/lib/shared-types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIZES = ["S", "M", "L", "XL"];
const COLOR_SWATCHES: Record<string, string> = {
  Đen: "#1a1a1a",
  Trắng: "#ffffff",
  Xanh: "#3b5fa0",
};

function CategoryLinks({ categories }: { categories: CategoryNode[] }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <ul className="space-y-1">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={
              activeCategory === category.slug
                ? "/products"
                : `/products?category=${category.slug}`
            }
            className={cn(
              "block rounded-md px-2 py-1 text-sm transition-colors hover:bg-secondary",
              activeCategory === category.slug
                ? "bg-secondary font-medium text-foreground"
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
                    href={
                      activeCategory === child.slug
                        ? "/products"
                        : `/products?category=${child.slug}`
                    }
                    className={cn(
                      "block rounded-md px-2 py-1 text-sm transition-colors hover:bg-secondary",
                      activeCategory === child.slug
                        ? "bg-secondary font-medium text-foreground"
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

export function ProductFilters({ categories }: { categories: CategoryNode[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSizes = searchParams.get("size")?.split(",").filter(Boolean) ?? [];
  const selectedColors = searchParams.get("color")?.split(",").filter(Boolean) ?? [];
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function toggleMultiValue(key: "size" | "color", value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  }

  function handlePriceSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParams({
      minPrice: (formData.get("minPrice") as string) || null,
      maxPrice: (formData.get("maxPrice") as string) || null,
    });
  }

  return (
    <aside className="space-y-8">
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold">Danh mục</h3>
        <CategoryLinks categories={categories} />
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold">Khoảng giá</h3>
        <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
          <Input
            name="minPrice"
            type="number"
            min={0}
            placeholder="Từ"
            defaultValue={minPrice}
            aria-label="Giá tối thiểu"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            name="maxPrice"
            type="number"
            min={0}
            placeholder="Đến"
            defaultValue={maxPrice}
            aria-label="Giá tối đa"
          />
          <Button type="submit" size="sm" variant="outline">
            Áp dụng
          </Button>
        </form>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold">Kích cỡ</h3>
        <div className="space-y-2">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => toggleMultiValue("size", size, selectedSizes)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold">Màu sắc</h3>
        <div className="space-y-2">
          {Object.keys(COLOR_SWATCHES).map((color) => (
            <label key={color} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleMultiValue("color", color, selectedColors)}
              />
              <span
                className="size-4 rounded-full border border-border"
                style={{ backgroundColor: COLOR_SWATCHES[color] }}
              />
              {color}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
