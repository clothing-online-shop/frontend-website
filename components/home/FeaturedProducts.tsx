import Link from "next/link";
import type { ProductListItem } from "@/lib/shared-types";
import { ProductCard } from "@/components/products/ProductCard";

export function FeaturedProducts({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold uppercase">Sản phẩm nổi bật / bán chạy</h2>
          <p className="mt-1 text-sm text-muted-foreground">Được mua nhiều nhất gần đây</p>
        </div>
        <Link
          href="/products?sort=best_selling"
          className="text-sm font-bold text-primary hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
