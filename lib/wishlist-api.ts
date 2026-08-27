import { apiClient } from "@/lib/api-client";
import type { WishlistItem } from "@/lib/shared-types";

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data } = await apiClient.get<WishlistItem[]>("/wishlist");
  return data;
}

export async function addWishlistItem(productId: string): Promise<WishlistItem> {
  const { data } = await apiClient.post<WishlistItem>("/wishlist", { productId });
  return data;
}

export async function removeWishlistItem(productId: string): Promise<void> {
  await apiClient.delete(`/wishlist/${productId}`);
}
