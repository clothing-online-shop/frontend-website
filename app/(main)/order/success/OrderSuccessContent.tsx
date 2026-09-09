"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPage } from "@/components/errors/StatusPage";
import { OrderSummaryCard } from "@/components/account/OrderSummaryCard";
import { getOrder } from "@/lib/orders-api";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/store/auth-store";

export function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode") ?? "";
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !user) router.push("/login");
  }, [hasHydrated, user, router]);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderCode],
    queryFn: () => getOrder(orderCode),
    enabled: !!orderCode && !!user,
  });

  if (!orderCode) {
    return (
      <StatusPage
        title="Không tìm thấy đơn hàng"
        description="Thiếu thông tin đơn hàng trong đường dẫn."
      />
    );
  }

  if (!hasHydrated || !user || isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (isError || !order) {
    return <StatusPage title="Không tìm thấy đơn hàng" description={getErrorMessage(error)} />;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="size-14 text-primary" />
        <h1 className="mt-4 font-heading text-2xl font-extrabold uppercase">
          Đặt hàng thành công
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
        </p>
        <p className="mt-1 text-lg font-bold">{order.orderCode}</p>
      </div>

      <div className="mt-8">
        <OrderSummaryCard order={order} />
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button nativeButton={false} variant="outline" render={<Link href="/san-pham" />}>
          Tiếp tục mua sắm
        </Button>
        <Button nativeButton={false} render={<Link href="/thong-tin-ca-nhan/don-hang-cua-toi" />}>
          Xem đơn hàng của tôi
        </Button>
      </div>
    </div>
  );
}
