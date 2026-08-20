"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCountdown } from "@/hooks/useCountdown";
import type { MockFlashSaleProduct } from "@/lib/home-mock";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const FLASH_SALE_DURATION_MS = 6 * 60 * 60 * 1000;

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function FlashSaleSection({ products }: { products: MockFlashSaleProduct[] }) {
  const [endsAt] = useState(() => Date.now() + FLASH_SALE_DURATION_MS);
  const { hours, minutes, seconds, isOver } = useCountdown(endsAt);

  if (isOver || products.length === 0) return null;

  return (
    <section className="bg-accent-soft">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-extrabold text-primary uppercase">Flash Sale</h2>
          <div className="flex items-center gap-1.5 bg-foreground px-3 py-1.5 text-background">
            <span className="text-xs">Kết thúc sau</span>
            <span className="flex items-center gap-1 font-mono text-sm tabular-nums">
              <span className="bg-primary px-1.5 py-0.5">{pad(hours)}</span>
              <span>:</span>
              <span className="bg-primary px-1.5 py-0.5">{pad(minutes)}</span>
              <span>:</span>
              <span className="bg-primary px-1.5 py-0.5">{pad(seconds)}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => {
            const discountPercent = Math.round(
              ((product.basePrice - product.salePrice) / product.basePrice) * 100,
            );
            return (
              <Link key={product.id} href={`/san-pham/${product.slug}`} className="group block">
                <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute top-2 left-2 rounded-sm bg-primary font-bold text-primary-foreground">
                    -{discountPercent}%
                  </Badge>
                </div>
                <div className="mt-3 space-y-1.5">
                  <h3 className="line-clamp-1 text-sm text-foreground">{product.name}</h3>
                  <div className="flex items-center gap-1.5">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${product.soldPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Đã bán {product.soldPercent}%</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
