"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getRecentlyViewed } from "@/lib/recently-viewed-api";
import { formatPrice } from "@/lib/format";

export function RecentlyViewedSection({ excludeProductId }: { excludeProductId: string }) {
  const { data } = useQuery({ queryKey: ["recently-viewed"], queryFn: getRecentlyViewed });
  const items = (data ?? []).filter((item) => item.productId !== excludeProductId);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 font-heading text-2xl font-extrabold uppercase">Đã xem gần đây</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/san-pham/${item.product.slug}`}
            className="flex items-center gap-3"
          >
            <div className="relative size-15 shrink-0 overflow-hidden bg-secondary">
              {item.product.thumbnail ? (
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm text-foreground">{item.product.name}</p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {formatPrice(item.product.salePrice ?? item.product.basePrice)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
