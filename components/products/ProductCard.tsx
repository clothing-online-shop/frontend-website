import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/lib/shared-types";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { resolveColorHex } from "@/lib/color-swatches";
import { WishlistButton } from "@/components/products/WishlistButton";

export function ProductCard({
  product,
  colorHexMap,
}: {
  product: ProductListItem;
  // Map tên màu -> hex thật, do trang cha (đã fetch GET /colors) truyền xuống — ProductCard
  // vẫn là Server Component (không tự fetch được), thiếu prop này thì rơi về bảng tĩnh
  // getColorSwatch() qua resolveColorHex(). Xem ProductsPageClient.tsx (nơi fetch + truyền).
  colorHexMap?: Record<string, string>;
}) {
  const outOfStock = product.totalStock <= 0;
  const hasDiscount = product.salePrice != null && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  return (
    <div className="group bg-white">
      <div className="relative aspect-3/4 overflow-hidden bg-secondary">
        <Link href={`/san-pham/${product.slug}`} className="absolute inset-0 block">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
        </Link>
        {outOfStock ? (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 rounded-sm bg-background/90 text-foreground"
          >
            Hết hàng
          </Badge>
        ) : hasDiscount ? (
          <Badge className="absolute top-2 left-2 rounded-sm bg-brand-10 font-bold text-primary-foreground">
            -{discountPercent}%
          </Badge>
        ) : null}
        <WishlistButton productId={product.id} />
      </div>
      <Link href={`/san-pham/${product.slug}`} className="block space-y-1.5 p-4">
        {product.brandName && (
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {product.brandName}
          </p>
        )}
        <h3 className="line-clamp-1 text-size-16 text-foreground text-brand-10 font-semibold">{product.name}</h3>

        {hasDiscount ? (
          <div className="flex items-center gap-2">
            <p className="text-size-16 font-bold text-brand-10">{formatPrice(product.salePrice!)}</p>
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.basePrice)}
            </p>
          </div>
        ) : (
          <p className="text-sm font-bold text-foreground">{formatPrice(product.basePrice)}</p>
        )}

        {(product.colors.length > 0 || product.sizes.length > 0) && (
          <div className="flex items-center justify-between">
            {product.colors.length > 0 ? (
              <div className="flex items-center gap-1">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="size-3.5 rounded-full border border-border"
                    style={{ backgroundColor: resolveColorHex(color, colorHexMap) }}
                  />
                ))}
              </div>
            ) : (
              <span />
            )}
            {product.sizes.length > 0 ? (
              <p className="text-xs text-muted-foreground">{product.sizes.join(" · ")}</p>
            ) : null}
          </div>
        )}
      </Link>
    </div>
  );
}
