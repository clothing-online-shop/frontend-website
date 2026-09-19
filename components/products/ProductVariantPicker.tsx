"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { ProductDetail, ProductVariant } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { STOCK_LABEL } from "@/lib/constants";
import { getColors } from "@/lib/colors-api";
import { resolveColorHex } from "@/lib/color-swatches";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { QuantityStepper } from "@/components/products/QuantityStepper";
import { SizeGuideDialog } from "@/components/products/SizeGuideDialog";
import { WishlistButton } from "@/components/products/WishlistButton";

export function ProductVariantPicker({
  product,
  sizes,
  colors,
  selectedSize,
  selectedColor,
  selectedVariant,
  onSelectSize,
  onSelectColor,
}: {
  product: ProductDetail;
  sizes: string[];
  colors: string[];
  selectedSize: string | null;
  selectedColor: string | null;
  selectedVariant: ProductVariant | null;
  onSelectSize: (size: string) => void;
  onSelectColor: (color: string) => void;
}) {
  const router = useRouter();
  const cart = useCart();

  const { data: colorsData } = useQuery({ queryKey: ["colors"], queryFn: getColors });
  const colorHexMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of colorsData ?? []) map[c.name] = c.hexCode;
    return map;
  }, [colorsData]);

  const [quantity, setQuantity] = useState(1);
  // Đổi sang biến thể ít hàng hơn số đang chọn thì kéo số lượng xuống đúng tồn kho (quantity gốc
  // giữ nguyên trong state để chọn lại biến thể nhiều hàng vẫn ra số cũ) — không thì "Thêm vào
  // giỏ" gửi số lượng vượt tồn kho.
  const effectiveQuantity = selectedVariant
    ? Math.max(1, Math.min(quantity, selectedVariant.stockQuantity))
    : quantity;

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
    cart.addItem({
      productVariantId: selectedVariant.id,
      quantity: effectiveQuantity,
      snapshot: {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        thumbnail: product.thumbnail,
        size: selectedVariant.size,
        color: selectedVariant.color,
        price: selectedVariant.price,
        stockQuantity: selectedVariant.stockQuantity,
      },
    });
  }

  function handleBuyNow() {
    if (!selectedVariant) return;
    // TODO(checkout): khi có trang /checkout thật, chuyển thẳng sang đó với đúng item vừa
    // thêm thay vì qua /cart — hiện /checkout vẫn là stub nên tạm điều hướng vào giỏ hàng.
    handleAddToCart();
    router.push("/cart");
  }

  const hasDiscount = product.salePrice != null && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;
  const displayPrice = selectedVariant?.price ?? product.salePrice ?? product.basePrice;
  const outOfStock = selectedVariant ? selectedVariant.stockQuantity <= 0 : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <p className="text-2xl font-extrabold text-foreground">{formatPrice(displayPrice)}</p>
        {hasDiscount ? (
          <>
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.basePrice)}
            </p>
            <Badge className="rounded-none h-6 bg-primary font-bold text-primary-foreground">
              -{discountPercent}%
            </Badge>
          </>
        ) : null}
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm">
          <span className="font-bold text-foreground">Màu</span>
          {selectedColor ? <span className="text-muted-foreground">{selectedColor}</span> : null}
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              disabled={!isColorAvailable(color)}
              onClick={() => onSelectColor(color)}
              aria-label={color}
              className={cn(
                "size-8 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-30",
                selectedColor === color ? "border-primary" : "border-transparent",
              )}
            >
              <span
                className="block size-full rounded-full border border-border"
                style={{ backgroundColor: resolveColorHex(color, colorHexMap) }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Size</p>
          <SizeGuideDialog />
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={!isSizeAvailable(size)}
              onClick={() => onSelectSize(size)}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                selectedSize === size
                  ? "border-brand-10 bg-brand-10 text-white"
                  : "border-border hover:border-brand-10",
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
            ? STOCK_LABEL.outOfStock
            : `${STOCK_LABEL.inStock} · size ${selectedVariant.size}`}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <QuantityStepper value={effectiveQuantity} onChange={setQuantity} max={selectedVariant?.stockQuantity} />
          <WishlistButton
            productId={product.id}
            className="cursor-pointer static top-auto right-auto z-auto size-13 shrink-0 rounded-none border border-border bg-white shadow-none sm:hidden"
          />
        </div>
        <Button
          variant="dark"
          size="lg"
          className="h-13 w-full text-base font-bold sm:flex-1"
          disabled={!selectedVariant || outOfStock || cart.isAdding}
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <WishlistButton
          productId={product.id}
          className="hidden cursor-pointer static top-auto right-auto z-auto size-13 shrink-0 rounded-none border border-border bg-white shadow-none sm:flex"
        />
      </div>

      <Button
        size="lg"
        variant="outline"
        className="h-13 w-full text-base font-bold border-1 border-brand-10"
        disabled={!selectedVariant || outOfStock || cart.isAdding}
        onClick={handleBuyNow}
      >
        Mua ngay
      </Button>
    </div>
  );
}
