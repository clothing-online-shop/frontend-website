"use client";

import { useMemo, useState } from "react";
import type { ProductDetail } from "@/lib/shared-types";
import { ProductInfoHeader } from "@/components/products/ProductInfoHeader";
import { ProductVariantPicker } from "@/components/products/ProductVariantPicker";

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

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    (initialColor && colors.includes(initialColor) ? initialColor : colors[0]) ?? null,
  );

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
