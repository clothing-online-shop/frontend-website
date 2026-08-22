"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPage } from "@/components/errors/StatusPage";
import { getOrder } from "@/lib/orders-api";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/error";
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/orderStatus";
import { useAuthStore } from "@/store/auth-store";

export function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
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
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId && !!user,
  });

  if (!orderId) {
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
        <p className="mt-1 font-heading text-lg font-bold">{order.orderCode}</p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Chi tiết đơn hàng
            <Badge variant="secondary">{ORDER_STATUS_LABEL[order.status]}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-muted-foreground">Địa chỉ giao hàng</span>
            <span className="text-right">{order.shippingAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phương thức thanh toán</span>
            <span>
              {PAYMENT_METHOD_LABEL[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABEL] ??
                order.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Trạng thái thanh toán</span>
            <span>{PAYMENT_STATUS_LABEL[order.paymentStatus]}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-bold">
            <span>Tổng tiền</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center gap-4">
        <Button nativeButton={false} variant="outline" render={<Link href="/san-pham" />}>
          Tiếp tục mua sắm
        </Button>
        <Button nativeButton={false} render={<Link href="/account" />}>
          Xem đơn hàng của tôi
        </Button>
      </div>
    </div>
  );
}
