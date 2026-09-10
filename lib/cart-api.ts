import { apiClient } from "@/lib/api-client";
import type {
  AddCartItemPayload,
  CartResponse,
  MergeCartPayload,
  MergeCartResult,
  UpdateCartItemPayload,
} from "@/lib/shared-types";

export async function getMyCart(): Promise<CartResponse> {
  const { data } = await apiClient.get<CartResponse>("/cart");
  return data;
}

export async function addCartItem(payload: AddCartItemPayload): Promise<CartResponse> {
  const { data } = await apiClient.post<CartResponse>("/cart/items", payload);
  return data;
}

export async function updateCartItem(
  itemId: string,
  payload: UpdateCartItemPayload,
): Promise<CartResponse> {
  const { data } = await apiClient.patch<CartResponse>(`/cart/items/${itemId}`, payload);
  return data;
}

export async function removeCartItem(itemId: string): Promise<CartResponse> {
  const { data } = await apiClient.delete<CartResponse>(`/cart/items/${itemId}`);
  return data;
}

export async function mergeCart(payload: MergeCartPayload): Promise<MergeCartResult> {
  const { data } = await apiClient.post<MergeCartResult>("/cart/merge", payload);
  return data;
}

// Chưa có nơi gọi (trang giỏ hàng không cần) — trang checkout (Sprint sau) sẽ gọi trước khi
// đặt hàng để tái xác nhận tồn kho, xem cart.controller.ts.
export async function validateCart(): Promise<MergeCartResult> {
  const { data } = await apiClient.post<MergeCartResult>("/cart/validate");
  return data;
}
