import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/lib/shared-types";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { getColorSwatch } from "@/lib/color-swatches";

export function ProductCard({ product }: { product: ProductListItem }) {
  const outOfStock = product.totalStock <= 0;
  const hasDiscount = product.salePrice != null && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden bg-secondary">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
        {outOfStock ? (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 rounded-sm bg-background/90 text-foreground"
          >
            Hết hàng
          </Badge>
        ) : hasDiscount ? (
          <Badge className="absolute top-2 left-2 rounded-sm bg-primary font-bold text-primary-foreground">
            -{discountPercent}%
          </Badge>
        ) : null}
      </div>
      <div className="mt-3 space-y-1.5">
        <h3 className="line-clamp-1 text-sm text-foreground">{product.name}</h3>

        {product.colors && product.colors.length > 0 ? (
          <div className="flex items-center gap-1">
            {product.colors.map((color) => (
              <span
                key={color}
                className="size-3.5 rounded-full border border-border"
                style={{ backgroundColor: getColorSwatch(color) }}
              />
            ))}
          </div>
        ) : null}

        {hasDiscount ? (
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-primary">{formatPrice(product.salePrice!)}</p>
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.basePrice)}
            </p>
          </div>
        ) : (
          <p className="text-sm font-bold text-foreground">{formatPrice(product.basePrice)}</p>
        )}
      </div>
    </Link>
  );
}
