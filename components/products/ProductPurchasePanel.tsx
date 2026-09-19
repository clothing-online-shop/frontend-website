"use client";

import { useMemo, useState } from "react";
import type { ProductDetail, ProductVariant } from "@/lib/shared-types";
import { ProductInfoHeader } from "@/components/products/ProductInfoHeader";
import { ProductVariantPicker } from "@/components/products/ProductVariantPicker";

// Biến thể chọn sẵn khi vào trang: ưu tiên còn hàng, và khớp màu ?color= trên URL nếu có. Trước đây
// lấy size đầu × màu đầu trong danh sách — có thể là tổ hợp không tồn tại (không có biến thể) hoặc
// đã hết hàng dù sản phẩm vẫn còn size/màu khác, nên badge tồn kho hiện "Hết hàng" oan.
function pickInitialVariant(variants: ProductVariant[], initialColor?: string): ProductVariant | null {
  const inColor = initialColor ? variants.filter((v) => v.color === initialColor) : [];
  const pools = [inColor, variants];
  for (const pool of pools) {
    const inStock = pool.find((v) => v.stockQuantity > 0);
    if (inStock) return inStock;
  }
  return inColor[0] ?? variants[0] ?? null;
}

// Tách selectedSize/selectedColor ra khỏi ProductVariantPicker để đưa lên đây — ProductRatingRow
// (trong ProductInfoHeader) cần biết đúng biến thể đang chọn để hiện badge còn/hết hàng theo
// size, không thể tính lại độc lập trong ProductVariantPicker như trước (2 component tách biệt).
export function ProductPurchasePanel({
  product,
  initialColor,
}: {
  product: ProductDetail;
  initialColor?: string;
}) {
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size))),
    [product],
  );
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color))),
    [product],
  );

  const [initialVariant] = useState(() => pickInitialVariant(product.variants, initialColor));
  const [selectedSize, setSelectedSize] = useState<string | null>(initialVariant?.size ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(initialVariant?.color ?? null);

  const selectedVariant =
    product.variants.find((v) => v.size === selectedSize && v.color === selectedColor) ?? null;

  return (
    <div>
      <ProductInfoHeader product={product} selectedVariant={selectedVariant} />
      <div className="mt-6">
        <ProductVariantPicker
          product={product}
          sizes={sizes}
          colors={colors}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          selectedVariant={selectedVariant}
          onSelectSize={setSelectedSize}
          onSelectColor={setSelectedColor}
        />
      </div>
    </div>
  );
}
