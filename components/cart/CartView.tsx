"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { getErrorMessage } from "@/lib/error";
import type { VoucherValidationResult } from "@/lib/shared-types";
import { validateVoucher } from "@/lib/vouchers-api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";

export function CartView() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const cart = useCart();

  // Chọn theo productVariantId (không phải item.id) — khách chưa đăng nhập có id local
  // (guest-...) sẽ đổi thành id thật của server ngay khi merge lúc đăng nhập, nhưng
  // productVariantId không đổi, nên trạng thái chọn "sống sót" qua bước merge miễn phí.
  const [selectedVariantIds, setSelectedVariantIds] = useState<Set<string>>(new Set());
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherValidationResult | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Id lần đầu xuất hiện -> mặc định chọn. Id đã thấy trước đó -> giữ nguyên trạng thái chọn
  // cũ (kể cả khi vừa bỏ chọn). Id không còn trong giỏ -> tự rớt khỏi tập hợp.
  //
  // Cố tình KHÔNG mutate seenIdsRef bên trong updater truyền cho setSelectedVariantIds — React
  // (StrictMode, bật mặc định) gọi updater 2 lần lúc dev để phát hiện side effect không thuần,
  // nên nếu ref bị đổi ngay trong đó thì lần gọi thứ 2 sẽ đọc nhầm ref đã đổi của lần 1, khiến
  // item mới luôn bị tính là "đã thấy" và không được tự chọn ngay từ đầu.
  useEffect(() => {
    const currentIds = cart.items.map((item) => item.productVariantId);
    const previouslySeen = seenIdsRef.current;
    setSelectedVariantIds(
      (prev) => new Set(currentIds.filter((id) => prev.has(id) || !previouslySeen.has(id))),
    );
    seenIdsRef.current = new Set(currentIds);
  }, [cart.items]);

  const voucherMutation = useMutation({
    mutationFn: validateVoucher,
    onSuccess: (data) => setAppliedVoucher(data),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const selectedItems = cart.items.filter((item) => selectedVariantIds.has(item.productVariantId));
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = appliedVoucher?.discountAmount ?? 0;
  const total = Math.max(0, selectedSubtotal - discount);
  const isAllSelected = cart.items.length > 0 && selectedItems.length === cart.items.length;

  function toggleOne(variantId: string) {
    setAppliedVoucher(null);
    setSelectedVariantIds((prev) => {
      const next = new Set(prev);
      if (next.has(variantId)) next.delete(variantId);
      else next.add(variantId);
      return next;
    });
  }

  function toggleAll() {
    setAppliedVoucher(null);
    setSelectedVariantIds(
      isAllSelected ? new Set() : new Set(cart.items.map((item) => item.productVariantId)),
    );
  }

  function handleApplyVoucher(code: string) {
    if (!user) {
      toast.error("Vui lòng đăng nhập để áp dụng mã giảm giá.");
      router.push("/login");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm.");
      return;
    }
    voucherMutation.mutate({ code, cartItemIds: selectedItems.map((item) => item.id) });
  }

  function handleCheckout() {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tiến hành thanh toán.");
      router.push("/login");
      return;
    }
    const ids = selectedItems.map((item) => item.id);
    router.push(`/checkout?items=${ids.join(",")}`);
  }

  if (cart.isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-16">
        <h1 className="font-heading mb-8 text-size-28 sm:text-size-38">Giỏ hàng</h1>
        <CartSkeleton />
      </div>
    );
  }

  if (cart.isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-16 text-center">
        <h1 className="mb-4 text-size-28 font-heading sm:text-size-38">Giỏ hàng</h1>
        <p className="text-muted-foreground">Không thể tải giỏ hàng, vui lòng thử lại.</p>
        <Button variant="outline" className="mt-4" onClick={() => cart.refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-16">
        <h1 className="font-heading text-size-28 sm:text-size-38">Giỏ hàng</h1>
        <EmptyCartState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-16">
      <h1 className="font-heading text-size-28 sm:text-size-38">Giỏ hàng</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="bg-white p-6">
          <FreeShippingBar subtotal={selectedSubtotal} />

          <label className="flex items-center gap-2 py-4 text-sm">
            <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
            Chọn tất cả ({cart.items.length})
          </label>

          <div className="border-t border-border">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                checked={selectedVariantIds.has(item.productVariantId)}
                onCheckedChange={() => toggleOne(item.productVariantId)}
                onQuantityChange={(quantity) => cart.updateQuantity(item.id, quantity)}
                onRemove={() => cart.removeItem(item.id)}
                isPending={cart.pendingItemId === item.id}
              />
            ))}
          </div>

          <Link href="/san-pham" className="mt-6 inline-block text-sm underline underline-offset-2 text-primary font-semibold">
            ← Tiếp tục mua sắm
          </Link>
        </div>

        <CartSummary
          itemCount={selectedItems.length}
          subtotal={selectedSubtotal}
          discount={discount}
          total={total}
          appliedVoucherCode={appliedVoucher?.code ?? null}
          onApplyVoucher={handleApplyVoucher}
          isApplyingVoucher={voucherMutation.isPending}
          onCheckout={handleCheckout}
          canCheckout={selectedItems.length > 0}
        />
      </div>
    </div>
  );
}
