"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import type { ProductDetail } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { getColors } from "@/lib/colors-api";
import { resolveColorHex } from "@/lib/color-swatches";
import { cn } from "@/lib/utils";
import { QuantityStepper } from "@/components/products/QuantityStepper";
import { SizeGuideDialog } from "@/components/products/SizeGuideDialog";
import { WishlistButton } from "@/components/products/WishlistButton";

export function ProductVariantPicker({
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

  const { data: colorsData } = useQuery({ queryKey: ["colors"], queryFn: getColors });
  const colorHexMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of colorsData ?? []) map[c.name] = c.hexCode;
    return map;
  }, [colorsData]);

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    (initialColor && colors.includes(initialColor) ? initialColor : colors[0]) ?? null,
  );
  const [skuCopied, setSkuCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);

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

  function colorSwatchImage(color: string): string | null {
    return product.variants.find((v) => v.color === color && v.imageUrl)?.imageUrl ?? null;
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    // Sprint 3 sẽ nối API giỏ hàng thật — hiện tại chưa có store giỏ hàng thật (xem
    // store/cart-store.ts), chỉ báo xác nhận luồng chọn variant.
    toast.success(
      `Đã chọn ${quantity} x ${selectedVariant.color} - ${selectedVariant.size}. Giỏ hàng sẽ sớm ra mắt!`,
    );
  }

  function handleBuyNow() {
    if (!selectedVariant) return;
    // Cùng lý do handleAddToCart() — chưa có checkout thật để chuyển sang, tạm toast xác
    // nhận luồng chọn variant.
    toast.success(`Đã chọn ${quantity} x ${selectedVariant.color} - ${selectedVariant.size}. Sắp ra mắt!`);
  }

  async function handleCopySku() {
    if (!selectedVariant) return;
    await navigator.clipboard.writeText(selectedVariant.sku);
    setSkuCopied(true);
    setTimeout(() => setSkuCopied(false), 1500);
  }

  const hasDiscount = product.salePrice != null && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;
  const displayPrice = selectedVariant?.price ?? product.salePrice ?? product.basePrice;
  const outOfStock = selectedVariant ? selectedVariant.stockQuantity <= 0 : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {product.brandName ? <span className="uppercase">{product.brandName}</span> : null}
        {product.brandName && selectedVariant ? <span>·</span> : null}
        {selectedVariant ? (
          <button
            type="button"
            onClick={handleCopySku}
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <span>
              SKU: <span className="font-medium text-foreground">{selectedVariant.sku}</span>
            </span>
            {skuCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <p className={cn("text-2xl font-extrabold", hasDiscount ? "text-primary" : "text-foreground")}>
          {formatPrice(displayPrice)}
        </p>
        {hasDiscount ? (
          <>
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.basePrice)}
            </p>
            <Badge className="rounded-sm bg-brand-10 font-bold text-primary-foreground">
              -{discountPercent}%
            </Badge>
          </>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">
          Màu sắc{selectedColor ? `: ${selectedColor}` : ""}
        </p>
        <div className="flex gap-2">
          {colors.map((color) => {
            const swatchImage = colorSwatchImage(color);
            return (
              <button
                key={color}
                type="button"
                disabled={!isColorAvailable(color)}
                onClick={() => setSelectedColor(color)}
                aria-label={color}
                className={cn(
                  "relative size-12 overflow-hidden rounded-sm border-2 transition-all disabled:cursor-not-allowed disabled:opacity-30",
                  selectedColor === color ? "border-primary" : "border-border",
                )}
                style={swatchImage ? undefined : { backgroundColor: resolveColorHex(color, colorHexMap) }}
              >
                {swatchImage ? (
                  <Image src={swatchImage} alt={color} fill sizes="48px" className="object-cover" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </p>
          <SizeGuideDialog />
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={!isSizeAvailable(size)}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground/50 disabled:line-through",
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary",
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
            : `Còn ${selectedVariant.stockQuantity} sản phẩm · size ${selectedVariant.size}`}
      </p>

      <div className="flex items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} max={selectedVariant?.stockQuantity} />
        <Button
          size="lg"
          className="flex-1 text-base font-bold"
          disabled={!selectedVariant || outOfStock}
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <WishlistButton
          productId={product.id}
          className="static top-auto right-auto z-auto size-11 rounded-sm border border-border bg-transparent shadow-none"
        />
      </div>

      <Button
        size="lg"
        variant="outline"
        className="w-full text-base font-bold"
        disabled={!selectedVariant || outOfStock}
        onClick={handleBuyNow}
      >
        Mua ngay
      </Button>
    </div>
  );
}
