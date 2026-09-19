"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { getWishlist, removeWishlistItem } from "@/lib/wishlist-api";
import { formatPrice } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

// Cùng queryKey với WishlistButton (components/products) — bỏ tim ở đây thì badge header và
// nút tim ở ProductCard nơi khác cũng tự cập nhật theo, không cần refresh trang.
const WISHLIST_KEY = ["wishlist"];

export function WishlistPageClient() {
  const queryClient = useQueryClient();
  const wishlistQuery = useQuery({ queryKey: WISHLIST_KEY, queryFn: getWishlist });

  const removeMutation = useMutation({
    mutationFn: removeWishlistItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
    onError: () => toast.error("Có lỗi xảy ra, vui lòng thử lại."),
  });

  return (
    <div>
      <h1 className="font-heading text-size-24 font-normal text-brand-10 sm:text-size-28">
        Sản phẩm yêu thích
      </h1>

      {wishlistQuery.isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-3/4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : !wishlistQuery.data || wishlistQuery.data.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center border border-dashed border-border py-16 text-center sm:py-24">
          <p className="text-muted-foreground">Chưa có sản phẩm yêu thích nào.</p>
          <Link href="/san-pham" className="mt-3 text-sm font-semibold text-primary hover:underline">
            Khám phá sản phẩm →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {wishlistQuery.data.map((item) => (
            <div key={item.id} className="group bg-white">
              <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                <Link href={`/san-pham/${item.product.slug}`} className="absolute inset-0 block">
                  {item.product.thumbnail ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="(min-width: 1280px) 260px, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => removeMutation.mutate(item.productId)}
                  disabled={removeMutation.isPending}
                  aria-label="Bỏ khỏi yêu thích"
                  className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:text-primary disabled:opacity-60"
                >
                  <Heart className="size-4 fill-primary text-primary" />
                </button>
              </div>
              <Link href={`/san-pham/${item.product.slug}`} className="block space-y-1.5 p-4">
                <h3 className="line-clamp-1 text-size-16 font-semibold text-brand-10">{item.product.name}</h3>
                {item.product.salePrice != null && item.product.salePrice < item.product.basePrice ? (
                  <div className="flex items-center gap-2">
                    <p className="text-size-16 font-bold text-brand-10">{formatPrice(item.product.salePrice)}</p>
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(item.product.basePrice)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-foreground">{formatPrice(item.product.basePrice)}</p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
