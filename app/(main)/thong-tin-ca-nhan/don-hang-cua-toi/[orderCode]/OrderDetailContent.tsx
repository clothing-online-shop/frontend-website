"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { OrderSummaryCard } from "@/components/account/OrderSummaryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrder } from "@/lib/orders-api";
import { getErrorMessage } from "@/lib/error";

// Tách riêng khỏi page.tsx (thay vì gọi useQuery ngay trong render-prop của AccountLayout) —
// children của AccountLayout chỉ nên render component thật, không tự gọi hook, giữ đúng quy
// tắc Rules of Hooks (xem cách ProfileForm.tsx được dùng làm mẫu).
export function OrderDetailContent({ orderCode }: { orderCode: string }) {
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderCode],
    queryFn: () => getOrder(orderCode),
  });

  return (
    <div>
      <Link
        href="/thong-tin-ca-nhan/don-hang-cua-toi"
        className="inline-flex items-center gap-1 text-size-14 text-neutral-68625C hover:text-brand-10"
      >
        <ChevronLeft className="size-4" />
        Quay lại danh sách đơn hàng
      </Link>

      <h1 className="mt-3 font-heading text-size-24 font-normal text-brand-10 sm:text-size-28">
        Chi tiết đơn hàng {orderCode}
      </h1>

      <div className="mt-5">
        {isLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : isError || !order ? (
          <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
        ) : (
          <OrderSummaryCard order={order} />
        )}
      </div>
    </div>
  );
}
