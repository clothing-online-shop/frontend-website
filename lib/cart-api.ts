import { apiClient } from "@/lib/api-client";

// Chỉ addCartItem() cho nút "Mua lại". Giỏ hàng đầy đủ (cart/checkout) vẫn chờ Sprint 3.
export async function addCartItem(productVariantId: string, quantity: number): Promise<void> {
  await apiClient.post("/cart/items", { productVariantId, quantity });
}
