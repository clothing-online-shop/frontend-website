import type { ProductDetail } from "@/lib/shared-types";
import { ProductRatingRow } from "@/components/products/ProductRatingRow";

export function ProductInfoHeader({ product }: { product: ProductDetail }) {
  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold">{product.name}</h1>
      <ProductRatingRow rating={product.displayRating} soldCount={product.soldCount} />
    </div>
  );
}
