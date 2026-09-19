"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { getWishlist } from "@/lib/wishlist-api";
import { useAuthStore } from "@/store/auth-store";
import { WISHLIST_KEY, useWishlistActions } from "@/hooks/useWishlistActions";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const user = useAuthStore((state) => state.user);
  const { add, remove, requireLogin, isPending } = useWishlistActions();

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: getWishlist,
    enabled: !!user,
  });

  const isWishlisted = wishlistQuery.data?.some((item) => item.productId === productId) ?? false;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      requireLogin();
      return;
    }
    if (isWishlisted) remove.mutate(productId);
    else add.mutate(productId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isWishlisted ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      aria-pressed={isWishlisted}
      className={cn(
        "absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:text-primary disabled:opacity-60",
        className,
      )}
    >
      <Heart className={cn("size-4", isWishlisted && "fill-primary text-primary")} />
    </button>
  );
}
