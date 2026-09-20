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

  // Kiểu Shopee: vào trang chưa chọn sẵn size/màu (chọn sẵn cả 2 thì 2 trục lọc chéo làm kẹt ở 1 tổ
  // hợp) — chọn màu thì chỉ size còn hàng của màu đó bấm được, chọn size thì ngược lại. Chỉ giữ sẵn
  // màu từ ?color= trên URL (bấm từ chấm màu ở ProductCard) nếu màu đó còn hàng.
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(() =>
    initialColor && product.variants.some((v) => v.color === initialColor && v.stockQuantity > 0)
      ? initialColor
      : null,
  );

  const selectedVariant =
    product.variants.find((v) => v.size === selectedSize && v.color === selectedColor) ?? null;

  // Badge tồn kho theo phần đã chọn: chưa chọn gì = cả sản phẩm, chọn màu/size = trong phạm vi đó,
  // chọn đủ 2 = đúng biến thể.
  const inStock = product.variants.some(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor) &&
      v.stockQuantity > 0,
  );

  return (
    <div>
      <ProductInfoHeader product={product} inStock={inStock} />
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
