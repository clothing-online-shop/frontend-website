import type { ProductListItem } from "@/lib/shared-types";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function ProductGrid({
  products,
  isLoading,
  total,
  limit,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  products: ProductListItem[];
  isLoading: boolean;
  total: number;
  limit: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-3/4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-border py-24 text-center">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.</p>
      </div>
    );
  }

  const remaining = Math.min(limit, total - products.length);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Đang tải..." : `Xem thêm ${remaining} sản phẩm`}
          </Button>
        </div>
      ) : null}
    </>
  );
}
