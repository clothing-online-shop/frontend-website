import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/lib/shared-types";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: ProductListItem }) {
  const outOfStock = product.totalStock <= 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-secondary">
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
            className="absolute top-3 left-3 bg-background/90 text-foreground"
          >
            Hết hàng
          </Badge>
        ) : null}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm text-foreground">{product.name}</h3>
        <p className="text-sm font-medium text-foreground">
          {formatPrice(product.basePrice)}
        </p>
      </div>
    </Link>
  );
}
