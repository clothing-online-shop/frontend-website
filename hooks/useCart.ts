"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addCartItem, getMyCart, removeCartItem, updateCartItem } from "@/lib/cart-api";
import { getErrorMessage } from "@/lib/error";
import type { CartResponse } from "@/lib/shared-types";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore, type GuestCartItem } from "@/store/cart-store";

export const CART_QUERY_KEY = ["cart"] as const;

export interface UnifiedCartItem {
  id: string;
  productVariantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  thumbnail: string | null;
  size: string;
  color: string;
  price: number;
  lineTotal: number;
  stockQuantity: number;
  quantity: number;
}

export interface AddCartItemInput {
  productVariantId: string;
  quantity: number;
  snapshot: {
    productId: string;
    productSlug: string;
    productName: string;
    thumbnail: string | null;
    size: string;
    color: string;
    price: number;
    stockQuantity: number;
  };
}

export interface UseCartResult {
  items: UnifiedCartItem[];
  itemCount: number;
  subtotal: number;
  isGuest: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  addItem: (input: AddCartItemInput) => void;
  isAdding: boolean;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  pendingItemId: string | null;
}

function serverItemToUnified(item: CartResponse["items"][number]): UnifiedCartItem {
  return {
    id: item.id,
    productVariantId: item.productVariantId,
    productId: item.product.id,
    productSlug: item.product.slug,
    productName: item.product.name,
    thumbnail: item.product.thumbnail,
    size: item.size,
    color: item.color,
    price: item.price,
    lineTotal: item.lineTotal,
    stockQuantity: item.stockQuantity,
    quantity: item.quantity,
  };
}

function guestItemToUnified(item: GuestCartItem): UnifiedCartItem {
  return {
    id: item.id,
    productVariantId: item.productVariantId,
    productId: item.productId,
    productSlug: item.productSlug,
    productName: item.productName,
    thumbnail: item.thumbnail,
    size: item.size,
    color: item.color,
    price: item.price,
    lineTotal: item.price * item.quantity,
    stockQuantity: item.stockQuantity,
    quantity: item.quantity,
  };
}

// Giao diện DUY NHẤT cho "giỏ hàng hiện tại" — trang /cart, badge ở Header, và nút thêm vào
// giỏ ở trang chi tiết sản phẩm đều dùng hook này thay vì tự quyết định đọc React Query hay
// zustand. Đã đăng nhập -> nguồn thật là React Query (server); chưa đăng nhập -> nguồn thật
// là store/cart-store.ts (client-authored, xem comment ở đó).
export function useCart(): UseCartResult {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const authHasHydrated = useAuthStore((state) => state.hasHydrated);

  const guestItems = useCartStore((state) => state.items);
  const guestHasHydrated = useCartStore((state) => state.hasHydrated);
  const guestAddItem = useCartStore((state) => state.addItem);
  const guestUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const guestRemoveItem = useCartStore((state) => state.removeItem);

  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getMyCart,
    enabled: !!user,
  });

  // 3 mutation đều trả về CartResponse mới nhất -> setQueryData thẳng thay vì
  // invalidateQueries, tránh 1 vòng refetch + nháy loading không cần thiết.
  const addMutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      toast.success("Đã thêm vào giỏ hàng.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, { quantity }),
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const items = useMemo<UnifiedCartItem[]>(() => {
    // Chưa biết chắc đã đăng nhập hay chưa (persist rehydrate chưa xong) -> đừng vội kết
    // luận là giỏ khách trống, đợi 1 nhịp thay vì nháy rỗng rồi mới hiện đúng.
    if (!authHasHydrated) return [];
    if (user) return (cartQuery.data?.items ?? []).map(serverItemToUnified);
    if (!guestHasHydrated) return [];
    return guestItems.map(guestItemToUnified);
  }, [authHasHydrated, user, cartQuery.data, guestHasHydrated, guestItems]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  function addItem(input: AddCartItemInput) {
    if (user) {
      addMutation.mutate({ productVariantId: input.productVariantId, quantity: input.quantity });
      return;
    }
    guestAddItem({ productVariantId: input.productVariantId, ...input.snapshot }, input.quantity);
    toast.success("Đã thêm vào giỏ hàng.");
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (user) {
      updateMutation.mutate({ itemId, quantity });
      return;
    }
    guestUpdateQuantity(itemId, quantity);
  }

  function removeItem(itemId: string) {
    if (user) {
      removeMutation.mutate(itemId);
      return;
    }
    guestRemoveItem(itemId);
  }

  const pendingItemId = updateMutation.isPending
    ? (updateMutation.variables?.itemId ?? null)
    : removeMutation.isPending
      ? (removeMutation.variables ?? null)
      : null;

  return {
    items,
    itemCount,
    subtotal,
    isGuest: !user,
    isLoading: !authHasHydrated || (user ? cartQuery.isLoading : !guestHasHydrated),
    isError: !!user && cartQuery.isError,
    refetch: () => void cartQuery.refetch(),
    addItem,
    isAdding: addMutation.isPending,
    updateQuantity,
    removeItem,
    pendingItemId,
  };
}
