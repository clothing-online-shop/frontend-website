"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { ProductSort } from "@/lib/shared-types";
import { getProducts } from "@/lib/products-api";
import { getCategoryTree } from "@/lib/categories-api";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];

const PAGE_LIMIT = 12;

export function ProductsPageClient({ category }: { category?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const size = searchParams.get("size") ?? undefined;
  const color = searchParams.get("color") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const sort = (searchParams.get("sort") as ProductSort | null) ?? "newest";
  const page = Number(searchParams.get("page") ?? "1");

  const queryParams = {
    category,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    size,
    color,
    search,
    sort,
    page,
    limit: PAGE_LIMIT,
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: getCategoryTree,
  });

  const productsQuery = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
  });

  const activeCategory = categoriesQuery.data
    ?.flatMap((c) => [c, ...c.children])
    .find((c) => c.slug === category);

  function updateSort(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {activeCategory ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Sản phẩm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeCategory.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <ProductFilters categories={categoriesQuery.data ?? []} activeCategorySlug={category} />

        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-extrabold uppercase">
                {search
                  ? `Kết quả tìm kiếm cho "${search}"`
                  : activeCategory
                    ? activeCategory.name
                    : "Tất cả sản phẩm"}
              </h1>
              {productsQuery.data ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {productsQuery.data.meta.total} sản phẩm
                </p>
              ) : null}
            </div>
            <Select value={sort} onValueChange={updateSort}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-3/4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : productsQuery.data && productsQuery.data.data.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {productsQuery.data.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {productsQuery.data.meta.totalPages > 1 ? (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    Trước
                  </Button>
                  <span className="px-3 text-sm text-muted-foreground">
                    Trang {page} / {productsQuery.data.meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= productsQuery.data.meta.totalPages}
                    onClick={() => goToPage(page + 1)}
                  >
                    Sau
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-border py-24 text-center">
              <p className="text-muted-foreground">
                Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
