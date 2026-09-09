"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/error";
import { addCartItem } from "@/lib/cart-api";
import { ORDER_STATUS_BADGE_CLASS, ORDER_STATUS_LABEL } from "@/lib/orderStatus";


export function OrderCard({
  order,
  onCancelClick,
}: {
  order: Order;
  onCancelClick: (order: Order) => void;
}) {
  const classNameBtn ='h-9.5 border-[#D0CDCA] bg-white text-size-13 font-semibold text-[#000000]'
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


  return (
    <div className="border-b border-b-[#F1EEEB] bg-white p-4 sm:px-6 sm:py-5.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-3.5 items-center justify-center">
          <span className="font-semibold text-size-14 text-[#1E1A15]">{order.orderCode}</span>
          <span className="text-size-13 text-[#76706A]">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <span
          className={`px-2.5 py-1.25 text-size-12 font-semibold ${ORDER_STATUS_BADGE_CLASS[order.status]}`}
        >
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="relative w-13 h-16.5 shrink-0 overflow-hidden bg-secondary"
              >
                {item.thumbnail ? (
                  <Image src={item.thumbnail} alt={item.productName} fill sizes="56px" className="object-cover" />
                ) : null}
              </div>
            ))}
          </div>
          <span className="text-size-13 text-[#5A544E]">{order.items.length} sản phẩm</span>
        </div>
        <span className="font-bold text-size-16 text-[#1E1A15]">{formatPrice(order.totalAmount)}</span>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {order.status === "PENDING" ? (
          <Button variant="outline" className={classNameBtn} onClick={() => onCancelClick(order)}>
            Hủy đơn
          </Button>
        ) : null}
        <Button 
          variant="outline"
          disabled={reorderMutation.isPending}
          className={classNameBtn}
          onClick={() => reorderMutation.mutate()}
        >
          {reorderMutation.isPending ? "Đang thêm..." : "Mua lại"}
        </Button>
        <Button variant="dark" className='text-white text-size-13 bg-[#1E1A15] h-9.5' nativeButton={false} render={<Link href={`/thong-tin-ca-nhan/don-hang-cua-toi/${order.orderCode}`} />}>
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
