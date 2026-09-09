"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CART_QUERY_KEY } from "@/hooks/useCart";
import { mergeCart } from "@/lib/cart-api";
import { getErrorMessage } from "@/lib/error";
import type { CartAdjustmentReason } from "@/lib/shared-types";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

const ADJUSTMENT_REASON_LABEL: Record<CartAdjustmentReason, string> = {
  unavailable: "ngừng bán",
  out_of_stock: "hết hàng",
  capped: "không đủ số lượng, đã được điều chỉnh",
};

// Component "headless" (không render gì UI), gắn 1 lần ở app/providers.tsx — gộp 2 việc đồng
// bộ giỏ hàng theo trạng thái đăng nhập vào 1 chỗ duy nhất, thay vì phải nhớ gọi lại ở mọi nơi
// có thể dẫn tới đăng nhập (trang /login, đăng ký xong tự đăng nhập, redirect VNPay...):
//
// 1. Đăng nhập xong mà giỏ khách (localStorage) đang có hàng -> gộp vào giỏ hàng server thật
//    qua POST /cart/merge, rồi xóa giỏ khách.
// 2. Đổi tài khoản (logout rồi login tài khoản khác, không F5) -> xóa cache React Query của
//    giỏ hàng cũ, tránh nháy giỏ hàng của tài khoản trước lên màn hình 1 nhịp trước khi
//    GET /cart mới trả về (enabled: !!user chỉ tạm dừng refetch, không tự xóa data cũ).
export function CartSessionSync() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const authHasHydrated = useAuthStore((state) => state.hasHydrated);
  const guestItems = useCartStore((state) => state.items);
  const guestHasHydrated = useCartStore((state) => state.hasHydrated);

  const isMergingRef = useRef(false);
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authHasHydrated || !guestHasHydrated || !user || guestItems.length === 0) return;
    if (isMergingRef.current) return;

    isMergingRef.current = true;
    mergeCart({
      items: guestItems.map((item) => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
      })),
    })
      .then(({ cart, adjustments }) => {
        queryClient.setQueryData(CART_QUERY_KEY, cart);
        useCartStore.getState().clear();
        if (adjustments.length > 0) {
          const detail = adjustments.map((a) => ADJUSTMENT_REASON_LABEL[a.reason]).join(", ");
          toast.error(`Một số sản phẩm trong giỏ hàng đã thay đổi: ${detail}.`);
        }
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => {
        isMergingRef.current = false;
      });
  }, [authHasHydrated, guestHasHydrated, user, guestItems, queryClient]);

  useEffect(() => {
    if (!authHasHydrated) return;
    const currentId = user?.id ?? null;
    if (prevUserIdRef.current && currentId !== prevUserIdRef.current) {
      queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
    }
    prevUserIdRef.current = currentId;
  }, [authHasHydrated, user, queryClient]);

  return null;
}
