"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { OrderSummaryCard } from "@/components/account/OrderSummaryCard";
import { StatusPage } from "@/components/errors/StatusPage";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrder } from "@/lib/orders-api";
import { getErrorMessage } from "@/lib/error";

// Tách khỏi page.tsx để không gọi hook trong render-prop của AccountLayout (Rules of Hooks).
export function OrderDetailContent({ orderCode }: { orderCode: string }) {
  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ["order", orderCode],
    queryFn: () => getOrder(orderCode),
  });

  if (isError || (!isLoading && !order)) {
    return (
      <StatusPage title="Không tìm thấy đơn hàng" description={getErrorMessage(error)} />
    );
  }

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
        {isLoading || !order ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <OrderSummaryCard order={order} />
        )}
      </div>
    </div>
  );
}
