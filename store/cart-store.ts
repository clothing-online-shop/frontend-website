import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Snapshot đủ để vẽ 1 dòng giỏ hàng KHÔNG cần fetch thêm gì — khách chưa đăng nhập không có
// giỏ hàng thật ở server để tham chiếu, nên đây là state DO CLIENT TỰ TẠO (client-authored),
// không phải cache của 1 lần fetch — đây là lý do duy nhất được phép "lệch" khỏi quy tắc
// "zustand không cache dữ liệu server" trong CLAUDE.md. price/stockQuantity có thể cũ đi
// trong lúc nằm ở localStorage — được tái xác nhận thật sự ngay khi merge vào giỏ hàng server
// lúc đăng nhập (POST /cart/merge) và lại 1 lần nữa ở bước checkout (POST /cart/validate).
export interface GuestCartItem {
  id: string; // local id (`guest-${uuid}`) — KHÔNG phải CartItem id thật của backend
  productVariantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  thumbnail: string | null;
  size: string;
  color: string;
  price: number;
  stockQuantity: number;
  quantity: number;
}

type GuestItemSnapshot = Omit<GuestCartItem, "id" | "quantity">;

interface CartState {
  items: GuestCartItem[];
  // persist rehydrate từ localStorage là bất đồng bộ (chạy sau lần render đầu) — thiếu cờ
  // này, useCart sẽ có 1 nhịp tưởng giỏ hàng khách đang trống dù thật ra chưa kịp đọc xong.
  hasHydrated: boolean;
  addItem: (snapshot: GuestItemSnapshot, quantity: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      addItem: (snapshot, quantity) => {
        const existing = get().items.find(
          (item) => item.productVariantId === snapshot.productVariantId,
        );
        if (existing) {
          const nextQuantity = Math.min(
            existing.quantity + quantity,
            snapshot.stockQuantity,
          );
          set({
            items: get().items.map((item) =>
              item.id === existing.id ? { ...item, ...snapshot, quantity: nextQuantity } : item,
            ),
          });
          return;
        }
        set({
          items: [
            ...get().items,
            {
              ...snapshot,
              id: `guest-${crypto.randomUUID()}`,
              quantity: Math.min(quantity, snapshot.stockQuantity),
            },
          ],
        });
      },
      updateQuantity: (id, quantity) =>
        set({ items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)) }),
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "clothing-shop-guest-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Bọc trong typeof window !== "undefined" giống store/auth-store.ts — module này cũng bị
// import ở server (qua hooks/useCart.ts), lúc đó .persist là no-op và gọi thẳng
// onFinishHydration() sẽ throw, sập cả SSR.
if (typeof window !== "undefined") {
  useCartStore.persist.onFinishHydration(() => {
    useCartStore.setState({ hasHydrated: true });
  });
  if (useCartStore.persist.hasHydrated()) {
    useCartStore.setState({ hasHydrated: true });
  }
}
