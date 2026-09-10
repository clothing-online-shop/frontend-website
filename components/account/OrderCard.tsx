"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/error";
import { addCartItem } from "@/lib/cart-api";
import { ORDER_STATUS_BADGE_CLASS, ORDER_STATUS_GROUP_LABEL } from "@/lib/orderStatus";

// Số ảnh sản phẩm hiện tối đa trên 1 dòng — phần dư gộp vào ô "+N" để card không bị vỡ layout
// khi đơn có nhiều sản phẩm (nhất là ở mobile, khung hẹp).
const MAX_THUMBNAILS = 3;

// Nút phụ (Hủy đơn / Mua lại): full-width ở mobile để dễ bấm, về chiều rộng tự nhiên từ sm.
const SECONDARY_BTN =
  "h-9.5 w-full border-neutral-D0CDCA bg-white text-size-13 font-semibold text-brand-10 sm:w-auto";

export function OrderCard({
  order,
  onCancelClick,
}: {
  order: Order;
  onCancelClick: (order: Order) => void;
}) {
  // Thêm lại từng dòng của đơn cũ vào giỏ hàng — bỏ qua (không chặn cả loạt) những dòng lỗi
  // (sản phẩm/biến thể đã ngừng bán hoặc hết hàng), báo tổng kết cho người dùng biết rõ đã
  // thêm được bao nhiêu trên tổng số, thay vì im lặng thành công/thất bại toàn bộ.
  const reorderMutation = useMutation({
    mutationFn: async () => {
      const results = await Promise.allSettled(
        order.items.map((item) => addCartItem(item.productVariantId, item.quantity)),
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      return { succeeded, total: order.items.length };
    },
    onSuccess: ({ succeeded, total }) => {
      if (succeeded === total) {
        toast.success(`Đã thêm ${succeeded} sản phẩm vào giỏ hàng.`);
      } else if (succeeded > 0) {
        toast.warning(`Đã thêm ${succeeded}/${total} sản phẩm — số còn lại hiện đã hết hàng.`);
      } else {
        toast.error("Không thêm được sản phẩm nào — đơn hàng đã hết hàng hoặc ngừng bán.");
      }
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const extraCount = order.items.length - MAX_THUMBNAILS;

  return (
    <div className="border-b border-b-neutral-F1EEEB bg-white py-4 sm:py-5.5">
      {/* Header: mã đơn + ngày bên trái (tự xuống dòng khi khung hẹp), badge trạng thái ghim
          góc phải, không bị đẩy xuống dòng riêng. */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-size-14 text-brand-10">{order.orderCode}</span>
          <span className="text-size-13 text-neutral-76706A">{formatDate(order.createdAt)}</span>
        </div>
        <span
          className={cn(
            "shrink-0 px-2.5 py-1.25 text-size-12 font-semibold",
            ORDER_STATUS_BADGE_CLASS[order.status],
          )}
        >
          {ORDER_STATUS_GROUP_LABEL[order.status]}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex gap-2">
            {order.items.slice(0, MAX_THUMBNAILS).map((item) => (
              <div
                key={item.id}
                className="relative h-14 w-11 shrink-0 overflow-hidden bg-secondary sm:h-16.5 sm:w-13"
              >
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.productName}
                    fill
                    sizes="52px"
                    className="object-cover"
                  />
                ) : null}
              </div>
            ))}
            {extraCount > 0 ? (
              <div className="flex h-14 w-11 shrink-0 items-center justify-center bg-secondary text-size-13 text-neutral-76706A sm:h-16.5 sm:w-13">
                +{extraCount}
              </div>
            ) : null}
          </div>
          <span className="shrink-0 text-size-13 text-neutral-33">{order.items.length} sản phẩm</span>
        </div>
        <span className="shrink-0 font-bold text-size-16 text-brand-10">
          {formatPrice(order.totalAmount)}
        </span>
      </div>

      {/* Nút: stack dọc full-width ở mobile, về hàng ngang căn phải từ sm. */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        {order.status === "PENDING" ? (
          <Button variant="outline" className={SECONDARY_BTN} onClick={() => onCancelClick(order)}>
            Hủy đơn
          </Button>
        ) : null}
        <Button
          variant="outline"
          disabled={reorderMutation.isPending}
          className={SECONDARY_BTN}
          onClick={() => reorderMutation.mutate()}
        >
          {reorderMutation.isPending ? "Đang thêm..." : "Mua lại"}
        </Button>
        <Button
          variant="dark"
          className="h-9.5 w-full bg-brand-10 text-size-13 text-white sm:w-auto"
          nativeButton={false}
          render={<Link href={`/thong-tin-ca-nhan/don-hang-cua-toi/${order.orderCode}`} />}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
