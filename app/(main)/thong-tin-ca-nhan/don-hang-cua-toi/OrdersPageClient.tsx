"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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

  // queryKey chỉ phụ thuộc tab.key (không phải cả object tab.statuses) — đổi tab luôn kéo
  // theo đổi key ("my-orders" là prefix chung, xem CancelOrderDialog invalidate theo prefix
  // này để mọi tab tự refetch sau khi hủy 1 đơn, không chỉ tab đang mở).
  const ordersQuery = useInfiniteQuery({
    queryKey: ["my-orders", tab.key],
    queryFn: ({ pageParam }) =>
      listMyOrders({ statuses: tab.statuses, page: pageParam, limit: PAGE_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
  });

  const orders = ordersQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const total = ordersQuery.data?.pages[0]?.meta.total ?? 0;
  const remaining = Math.min(PAGE_LIMIT, total - orders.length);

  return (
    <div>
      <h1 className="font-heading text-size-24 font-normal text-brand-10 sm:text-size-28">
        Đơn hàng của tôi
      </h1>

      <div className="mt-5 flex gap-1 border-b border-[#EDEBE8] ml-3">
        {ORDER_LIST_TABS.map((t) => (
          <p
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "cursor-pointer py-2.5 px-4 text-size-13 font-semibold border-b-2",
              t.key === activeTab
                ? "text-[#1E1A15] border-[#8B5339]"
                : "text-[#76706A] border-transparent",
            )}
          >
            {t.label}
          </p>
        ))}
      </div>

      <div>
        {ordersQuery.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-neutral-E0DDDA py-24 text-center">
            <p className="text-neutral-68625C">Chưa có đơn hàng nào ở mục này.</p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} onCancelClick={setCancelTarget} />)
        )}
      </div>

      {ordersQuery.hasNextPage ? (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="w-[225px] border-[1.5px] border-brand-10 bg-white p-6 text-size-14 font-semibold text-brand-10"
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
