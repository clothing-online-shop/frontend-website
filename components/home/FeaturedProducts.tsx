import Link from "next/link";
import type { ProductListItem } from "@/lib/shared-types";
import { ProductCard } from "@/components/products/ProductCard";

export function FeaturedProducts({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-extrabold uppercase">Bán chạy 30 ngày</h2>
        <Link
          href="/san-pham?sort=best_selling"
          className="text-sm font-bold text-primary hover:underline"
        >
          Tất cả sản phẩm →
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
