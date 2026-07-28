"use client";

import { useMemo, useState } from "react";
import type { ProductDetail } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const COLOR_SWATCHES: Record<string, string> = {
  Đen: "#1a1a1a",
  Trắng: "#ffffff",
  Xanh: "#3b5fa0",
};

export function ProductVariantPicker({ product }: { product: ProductDetail }) {
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size))),
    [product],
  );
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color))),
    [product],
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [added, setAdded] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.size === selectedSize && v.color === selectedColor) ??
    null;

  function isSizeAvailable(size: string): boolean {
    return product.variants.some(
      (v) => v.size === size && (!selectedColor || v.color === selectedColor) && v.stockQuantity > 0,
    );
  }

  function isColorAvailable(color: string): boolean {
    return product.variants.some(
      (v) => v.color === color && (!selectedSize || v.size === selectedSize) && v.stockQuantity > 0,
    );
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    // Sprint 3 sẽ nối API giỏ hàng thật; hiện log lại lựa chọn để xác nhận luồng chọn variant.
    console.log("Thêm vào giỏ hàng:", {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const displayPrice = selectedVariant?.price ?? product.basePrice;
  const outOfStock = selectedVariant ? selectedVariant.stockQuantity <= 0 : false;

  return (
    <div className="space-y-6">
      <p className="text-2xl font-medium text-foreground">{formatPrice(displayPrice)}</p>

      <div>
        <p className="mb-2 text-sm font-medium">
          Màu sắc{selectedColor ? `: ${selectedColor}` : ""}
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              disabled={!isColorAvailable(color)}
              onClick={() => setSelectedColor(color)}
              aria-label={color}
              className={cn(
                "size-9 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-30",
                selectedColor === color ? "border-foreground" : "border-border",
              )}
              style={{ backgroundColor: COLOR_SWATCHES[color] ?? "#cccccc" }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">
          Kích cỡ{selectedSize ? `: ${selectedSize}` : ""}
        </p>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={!isSizeAvailable(size)}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground/50 disabled:line-through",
                selectedSize === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <p className={cn("text-sm", outOfStock ? "text-destructive" : "text-muted-foreground")}>
        {!selectedVariant
          ? "Vui lòng chọn màu sắc và kích cỡ"
          : outOfStock
            ? "Hết hàng"
            : `Còn ${selectedVariant.stockQuantity} sản phẩm`}
      </p>

      <Button
        size="lg"
        className="w-full"
        disabled={!selectedVariant || outOfStock}
        onClick={handleAddToCart}
      >
        {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
      </Button>
    </div>
  );
}
