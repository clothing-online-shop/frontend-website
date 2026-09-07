"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { ProductSort } from "@/lib/shared-types";
import { getProducts } from "@/lib/products-api";
import { getCategoryTree } from "@/lib/categories-api";
import { ProductFilters } from "@/components/products/filters/ProductFilters";
import { ProductsBreadcrumb } from "@/components/products/ProductsBreadcrumb";
import { CategoryHero } from "@/components/products/CategoryHero";
import { ProductsToolbar } from "@/components/products/ProductsToolbar";
import { ProductGrid } from "@/components/products/ProductGrid";

const PAGE_LIMIT = 9;

export function ProductsPageClient({ category }: { category?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const size = searchParams.get("size") ?? undefined;
  const color = searchParams.get("color") ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const sort = (searchParams.get("sort") as ProductSort | null) ?? "newest";

  const queryParams = {
    category,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    size,
    color,
    brand,
    search,
    sort,
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: getCategoryTree,
  });

  // Đổi bất kỳ filter/sort nào ở trên đều đổi queryKey -> React Query tự coi là query mới,
  // bắt đầu lại từ trang 1 (không cần tự reset thủ công) — khớp UX "Xem thêm" (load more),
  // không dùng URL param `page` như bản Trước/Sau cũ.
  const productsQuery = useInfiniteQuery({
    queryKey: ["products", queryParams],
    queryFn: ({ pageParam }) => getProducts({ ...queryParams, page: pageParam, limit: PAGE_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
  });

  const products = productsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const total = productsQuery.data?.pages[0]?.meta.total ?? 0;

  const activeCategory = categoriesQuery.data
    ?.flatMap((c) => [c, ...c.children])
    .find((c) => c.slug === category);

  function updateSort(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const heroTitle = search
    ? `Kết quả tìm kiếm cho "${search}"`
    : activeCategory
      ? activeCategory.name
      : "Tất cả sản phẩm";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <ProductsBreadcrumb
        categories={categoriesQuery.data ?? []}
        activeCategory={activeCategory}
        search={search}
      />

      <CategoryHero title={heroTitle} total={productsQuery.data ? total : undefined} />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <ProductFilters categories={categoriesQuery.data ?? []} activeCategorySlug={category} />

        <div>
          <ProductsToolbar
            shownCount={products.length}
            total={total}
            isLoading={productsQuery.isLoading}
            sort={sort}
            onSortChange={updateSort}
          />

          <ProductGrid
            products={products}
            isLoading={productsQuery.isLoading}
            total={total}
            limit={PAGE_LIMIT}
            hasMore={productsQuery.hasNextPage}
            isLoadingMore={productsQuery.isFetchingNextPage}
            onLoadMore={() => productsQuery.fetchNextPage()}
          />
        </div>
      </div>
    </div>
  );
}
