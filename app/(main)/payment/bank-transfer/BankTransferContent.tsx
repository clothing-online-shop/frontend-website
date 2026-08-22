"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPage } from "@/components/errors/StatusPage";
import { initiateBankTransfer } from "@/lib/payments-api";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/store/auth-store";

function InfoRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="text-right text-sm font-bold hover:underline"
      >
        {copied ? "Đã sao chép" : value}
      </button>
    </div>
  );
}

export function BankTransferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !user) router.push("/login");
  }, [hasHydrated, user, router]);

  const {
    data: info,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bank-transfer", orderId],
    queryFn: () => initiateBankTransfer(orderId),
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
        Đang tải thông tin chuyển khoản...
      </div>
    );
  }

  if (isError || !info) {
    return <StatusPage title="Có lỗi xảy ra" description={getErrorMessage(error)} />;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <Landmark className="size-14 text-primary" />
        <h1 className="mt-4 font-heading text-2xl font-extrabold uppercase">
          Chuyển khoản ngân hàng
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vui lòng chuyển khoản đúng số tiền và nội dung bên dưới. Đơn hàng sẽ được xử lý sau khi
          chúng tôi xác nhận đã nhận được tiền.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Thông tin chuyển khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow label="Ngân hàng" value={info.bankName} />
          <InfoRow label="Số tài khoản" value={info.bankAccountNumber} />
          <InfoRow label="Chủ tài khoản" value={info.bankAccountName} />
          <InfoRow label="Nội dung chuyển khoản" value={info.transferContent} />
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Số tiền</span>
            <span className="text-lg font-bold text-primary">{formatPrice(info.amount)}</span>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Lưu ý: nhập đúng nội dung chuyển khoản (mã đơn hàng) để hệ thống đối soát chính xác.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Button
          nativeButton={false}
          render={<Link href={`/order/success?orderId=${orderId}`} />}
        >
          Tôi đã chuyển khoản
        </Button>
      </div>
    </div>
  );
}
