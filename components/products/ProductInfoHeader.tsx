import type { ProductDetail, ProductVariant } from "@/lib/shared-types";
import { ProductRatingRow } from "@/components/products/ProductRatingRow";
import { ClampedText } from "@/components/common/ClampedText";

export function ProductInfoHeader({
  product,
  selectedVariant,
}: {
  product: ProductDetail;
  selectedVariant: ProductVariant | null;
}) {
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : null;

  return (
    <div>
      <ClampedText
        text={product.name}
        render={<h1 />}
        className="line-clamp-3 wrap-break-word font-heading text-size-40 leading-12 font-normal tracking-[-0.4px]"
      />
      <ProductRatingRow rating={product.displayRating} inStock={inStock} />
    </div>
  );
}
