import type { ProductDetail } from "@/lib/shared-types";
import { ProductRatingRow } from "@/components/products/ProductRatingRow";

export function ProductInfoHeader({ product }: { product: ProductDetail }) {
  return (
    <div>
      <h1 className="font-heading text-size-40 leading-[44px] font-normal tracking-[-0.4px]">
        {product.name}
      </h1>
      <ProductRatingRow rating={product.displayRating} soldCount={product.soldCount} />
    </div>
  );
}
