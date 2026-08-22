"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPage } from "@/components/errors/StatusPage";
import { verifyVnpayReturn, initiateVnpayPayment } from "@/lib/payments-api";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/store/auth-store";

export function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [retryError, setRetryError] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated && !user) router.push("/login");
  }, [hasHydrated, user, router]);

  // vnp_TxnRef là dấu hiệu chắc chắn đây là 1 lần VNPay redirect về (không phải khách tự
  // gõ URL trống) — chỉ gọi verify khi có field này.
  const hasVnpayQuery = !!searchParams.get("vnp_TxnRef");
  const query = Object.fromEntries(searchParams.entries());

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["vnpay-return", query],
    queryFn: () => verifyVnpayReturn(query),
    enabled: hasVnpayQuery && !!user,
  });

  const retryMutation = useMutation({
    mutationFn: (orderId: string) => initiateVnpayPayment(orderId),
    onSuccess: (data) => {
      window.location.href = data.paymentUrl;
    },
    onError: (err) => setRetryError(getErrorMessage(err)),
  });

  if (!hasVnpayQuery) {
    return (
      <StatusPage
        title="Không tìm thấy giao dịch"
        description="Thiếu thông tin giao dịch VNPay trong đường dẫn."
      />
    );
  }

  if (!hasHydrated || !user || isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-muted-foreground">
        Đang xác nhận kết quả thanh toán...
      </div>
    );
  }

  if (isError || !result) {
    return <StatusPage title="Có lỗi xảy ra" description={getErrorMessage(error)} />;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      {result.success ? (
        <>
          <CheckCircle2 className="mx-auto size-14 text-primary" />
          <h1 className="mt-4 font-heading text-2xl font-extrabold uppercase">
            Thanh toán thành công
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Đơn hàng <span className="font-bold text-foreground">{result.orderCode}</span> đã
            được thanh toán.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              nativeButton={false}
              render={<Link href={`/order/success?orderId=${result.orderId ?? ""}`} />}
            >
              Xem chi tiết đơn hàng
            </Button>
          </div>
        </>
      ) : (
        <>
          <XCircle className="mx-auto size-14 text-destructive" />
          <h1 className="mt-4 font-heading text-2xl font-extrabold uppercase">
            Thanh toán thất bại
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
          {result.orderCode ? (
            <p className="mt-1 text-sm">
              Mã đơn hàng: <span className="font-bold">{result.orderCode}</span>
            </p>
          ) : null}
          {retryError ? <p className="mt-3 text-sm text-destructive">{retryError}</p> : null}
          <div className="mt-8 flex justify-center gap-4">
            <Button nativeButton={false} variant="outline" render={<Link href="/san-pham" />}>
              Về trang sản phẩm
            </Button>
            {result.orderId ? (
              <Button
                onClick={() => retryMutation.mutate(result.orderId!)}
                disabled={retryMutation.isPending}
              >
                {retryMutation.isPending ? "Đang xử lý..." : "Thanh toán lại"}
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
