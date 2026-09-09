import { apiClient } from "@/lib/api-client";

// Chỉ 1 hàm addCartItem() — đủ dùng cho nút "Mua lại" ở trang "Đơn hàng của tôi". Giỏ hàng
// thật (trang /cart, checkout, ProductVariantPicker "Thêm vào giỏ"...) vẫn đang là placeholder
// chờ Sprint 3 (xem store/cart-store.ts), không mở rộng thêm ở đây để tránh lấn phạm vi.
export async function addCartItem(productVariantId: string, quantity: number): Promise<void> {
  await apiClient.post("/cart/items", { productVariantId, quantity });
}
