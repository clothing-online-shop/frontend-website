"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductSort } from "@/lib/shared-types";
import { getProducts } from "@/lib/products-api";
import { getCategoryTree } from "@/lib/categories-api";
import { getRecentSearches, recordSearch } from "@/lib/search-history-api";
import { getColors } from "@/lib/colors-api";
import { ProductFilters } from "@/components/products/filters/ProductFilters";
import { ProductsBreadcrumb } from "@/components/products/ProductsBreadcrumb";
import { CategoryHero } from "@/components/products/CategoryHero";
import { ProductsToolbar } from "@/components/products/ProductsToolbar";
import { ProductGrid } from "@/components/products/ProductGrid";

const PAGE_LIMIT = 9;

export function ProductsPageClient({ category: categoryProp }: { category?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = categoryProp ?? searchParams.get("category") ?? undefined;
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

  const queryClient = useQueryClient();
  useEffect(() => {
    if (!search) return;
    const cachedHistory = queryClient.getQueryData<string[]>(["search-history"]) ?? [];
    if (cachedHistory.includes(search)) return;

    recordSearch(search)
      .then(() => queryClient.invalidateQueries({ queryKey: ["search-history"] }))
      .catch(() => undefined);
  }, [search, queryClient]);

  const recentSearchesQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: getRecentSearches,
    enabled: Boolean(search),
  });

  // Cùng query ["colors"] với ColorFilter (React Query dedupe theo queryKey, không gọi
  // API 2 lần) — dùng để hiện đúng hex thật ở chấm màu trên từng ProductCard, khớp màu
  // đang hiện trong bộ lọc thay vì đoán qua bảng tĩnh.
  const colorsQuery = useQuery({ queryKey: ["colors"], queryFn: getColors });
  const colorHexMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of colorsQuery.data ?? []) map[c.name] = c.hexCode;
    return map;
  }, [colorsQuery.data]);

  const activeCategory = categoriesQuery.data
    ?.flatMap((c) => [c, ...c.children])
    .find((c) => c.slug === category);

  function updateSort(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const heroTitle = activeCategory ? activeCategory.name : "Tất cả sản phẩm";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <ProductsBreadcrumb
        categories={categoriesQuery.data ?? []}
        activeCategory={activeCategory}
        search={search}
      />
      {!search && <CategoryHero title={heroTitle} total={productsQuery.data ? total : undefined} />}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[270px_1fr]">
        <ProductFilters categories={categoriesQuery.data ?? []} activeCategorySlug={category} />

        <div>
          {search ? (
            <div className="mb-8">
              <h1 className="font-heading text-size-28 font-normal text-brand-10 sm:text-size-32">
                {`Kết quả cho "${search}"`}
              </h1>
              {productsQuery.data ? (
                <p className="mt-2 text-size-14 text-neutral-68625C">Tìm thấy {total} sản phẩm</p>
              ) : null}
            </div>
          ) : null}

          {search && recentSearchesQuery.data && recentSearchesQuery.data.length > 0 ? (
            <div className="mb-8">
              <p className="mb-3 text-size-14 text-neutral-68625C">Từ khóa tìm gần đây</p>
              <div className="flex flex-wrap gap-2">
                {recentSearchesQuery.data.map((keyword) => (
                  <Link
                    key={keyword}
                    href={`/san-pham?search=${encodeURIComponent(keyword)}`}
                    className="border border-neutral-E0DDDA px-3.5 py-1.75 text-size-13 transition-colors bg-white hover:border-primary hover:text-primary"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {!search && (
            <ProductsToolbar
              shownCount={products.length}
              total={total}
              isLoading={productsQuery.isLoading}
              sort={sort}
              onSortChange={updateSort}
            />
          )}

          <ProductGrid
            products={products}
            isLoading={productsQuery.isLoading}
            total={total}
            limit={PAGE_LIMIT}
            hasMore={productsQuery.hasNextPage}
            isLoadingMore={productsQuery.isFetchingNextPage}
            onLoadMore={() => productsQuery.fetchNextPage()}
            colorHexMap={colorHexMap}
          />
        </div>
      </div>
    </div>
  );
}
