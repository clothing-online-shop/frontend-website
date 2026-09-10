"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import type { ProductDetail } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { getColors } from "@/lib/colors-api";
import { resolveColorHex } from "@/lib/color-swatches";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
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
  const router = useRouter();
  const cart = useCart();

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

  function handleAddToCart() {
    if (!selectedVariant) return;
    cart.addItem({
      productVariantId: selectedVariant.id,
      quantity,
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
              onClick={() => setSelectedColor(color)}
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
              onClick={() => setSelectedSize(size)}
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
            ? "Hết hàng"
            : `Còn ${selectedVariant.stockQuantity} sản phẩm · size ${selectedVariant.size}`}
      </p>

      <div className="flex items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} max={selectedVariant?.stockQuantity} />
        <Button
          variant="dark"
          size="lg"
          className="h-13 flex-1 text-base font-bold"
          disabled={!selectedVariant || outOfStock || cart.isAdding}
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <WishlistButton
          productId={product.id}
          className="cursor-pointer static top-auto right-auto z-auto size-13 rounded-none border border-border bg-white shadow-none"
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
