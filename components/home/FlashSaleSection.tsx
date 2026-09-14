"use client";

import Image from "next/image";
import Link from "next/link";
import { useCountdown } from "@/hooks/useCountdown";
import type { ActiveFlashSale } from "@/lib/shared-types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

// Chỉ highlight 4 sản phẩm đầu (giống dãy sản phẩm nổi bật khác trên trang chủ) — API có thể
// trả nhiều hơn, phần còn lại xem qua link "Xem tất cả".
const HIGHLIGHT_LIMIT = 4;

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-14 flex-col items-center gap-0.5 bg-background p-2.5 text-foreground">
      <span className="text-lg leading-none font-bold tabular-nums">{pad(value)}</span>
      <span className="text-[10px] leading-none font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

export function FlashSaleSection({ flashSale }: { flashSale: ActiveFlashSale | null }) {
  const endsAt = flashSale ? new Date(flashSale.endDate).getTime() : 0;
  const { hours, minutes, seconds, isOver } = useCountdown(endsAt);

  if (!flashSale || isOver || flashSale.products.length === 0) return null;

  const products = flashSale.products.slice(0, HIGHLIGHT_LIMIT);

  return (
    <section id="flash-sale" className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-size-12 font-semibold tracking-[0.16em] text-background/60 uppercase">
                Kết thúc sau
              </p>
              <h2 className="font-heading text-size-30 font-normal text-background">Flash Sale</h2>
            </div>

            <div className="flex items-center gap-2">
              <CountdownBox value={hours} label="Giờ" />
              <CountdownBox value={minutes} label="Phút" />
              <CountdownBox value={seconds} label="Giây" />
            </div>

            <p className="hidden text-sm text-background/70 md:block">
              Giảm tới 50%, hết số lượng tự về giá gốc
            </p>
          </div>

          <Link
            href="/san-pham"
            className="text-sm font-bold text-background hover:text-primary hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((product) => {
            const discountPercent = Math.round(
              ((product.basePrice - product.salePrice) / product.basePrice) * 100,
            );
            return (
              <Link key={product.id} href={`/san-pham/${product.slug}`} className="group block bg-background">
                <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                  {product.thumbnail && (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      sizes="(min-width: 640px) 25vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <Badge className="p-2 absolute top-2 left-2 rounded-sm bg-primary font-bold text-primary-foreground">
                    -{discountPercent}%
                  </Badge>
                </div>
                <div className="space-y-2 p-3">
                  <h3 className="font-semibold line-clamp-1 text-sm text-foreground">{product.name}</h3>
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
                  <p className="text-xs text-muted-foreground">Đã bán {product.soldCount} sản phẩm</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
