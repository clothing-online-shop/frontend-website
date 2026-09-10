"use client";

import { useState } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { Order } from "@/lib/shared-types";
import { listMyOrders } from "@/lib/orders-api";
import { ORDER_LIST_TABS } from "@/lib/orderStatus";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/account/OrderCard";
import { CancelOrderDialog } from "@/components/account/CancelOrderDialog";
import { cn } from "@/lib/utils";

const PAGE_LIMIT = 5;

export function OrdersPageClient() {
  const [activeTab, setActiveTab] = useState<string>(ORDER_LIST_TABS[0].key);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const tab = ORDER_LIST_TABS.find((t) => t.key === activeTab) ?? ORDER_LIST_TABS[0];

  // queryKey prefix "my-orders" dùng chung để CancelOrderDialog invalidate mọi tab 1 lần.
  // keepPreviousData: đổi sang tab chưa có cache thì giữ danh sách cũ (mờ đi) thay vì sụp về
  // skeleton — tránh giật layout.
  const ordersQuery = useInfiniteQuery({
    queryKey: ["my-orders", tab.key],
    queryFn: ({ pageParam }) =>
      listMyOrders({ statuses: tab.statuses, page: pageParam, limit: PAGE_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  const orders = ordersQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const total = ordersQuery.data?.pages[0]?.meta.total ?? 0;
  const remaining = Math.min(PAGE_LIMIT, total - orders.length);
  const isSwitchingTab = ordersQuery.isPlaceholderData;

  return (
    <div>
      <h1 className="font-heading text-size-24 font-normal text-brand-10 sm:text-size-28">
        Đơn hàng của tôi
      </h1>

      {/* 6 tab cuộn ngang trên màn hẹp, không wrap để giữ đường gạch chân liền mạch. */}
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-neutral-EDEBE8">
        {ORDER_LIST_TABS.map((t) => (
          <p
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "shrink-0 cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-size-13 font-semibold sm:px-4",
              t.key === activeTab
                ? "border-brand-38 text-brand-10"
                : "border-transparent text-neutral-76706A",
            )}
          >
            {t.label}
          </p>
        ))}
      </div>

      <div
        className={cn(
          "min-h-60 transition-opacity duration-150",
          isSwitchingTab && "pointer-events-none opacity-50",
        )}
      >
        {ordersQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-neutral-E0DDDA py-16 text-center sm:py-24">
            <p className="text-neutral-68625C">Chưa có đơn hàng nào ở mục này.</p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} onCancelClick={setCancelTarget} />)
        )}
      </div>

      {ordersQuery.hasNextPage && !isSwitchingTab ? (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="w-full border-[1.5px] border-brand-10 bg-white p-6 text-size-14 font-semibold text-brand-10 sm:w-56.25"
            onClick={() => ordersQuery.fetchNextPage()}
            disabled={ordersQuery.isFetchingNextPage}
          >
            {ordersQuery.isFetchingNextPage ? "Đang tải..." : `Xem thêm ${remaining} đơn hàng`}
          </Button>
        </div>
      ) : null}

      <CancelOrderDialog order={cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)} />
    </div>
  );
}
