"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { addWishlistItem, getWishlist, removeWishlistItem } from "@/lib/wishlist-api";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const WISHLIST_KEY = ["wishlist"];

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: getWishlist,
    enabled: !!user,
  });

  const isWishlisted = wishlistQuery.data?.some((item) => item.productId === productId) ?? false;

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isWishlisted) {
        await removeWishlistItem(productId);
      } else {
        await addWishlistItem(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
    },
    onError: () => toast.error("Có lỗi xảy ra, vui lòng thử lại."),
  });

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }
    toggleMutation.mutate();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggleMutation.isPending}
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
