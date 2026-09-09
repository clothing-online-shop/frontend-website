"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

export function CartSummary({
  itemCount,
  subtotal,
  discount,
  total,
  appliedVoucherCode,
  onApplyVoucher,
  isApplyingVoucher,
  onCheckout,
  canCheckout,
}: {
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedVoucherCode: string | null;
  onApplyVoucher: (code: string) => void;
  isApplyingVoucher: boolean;
  onCheckout: () => void;
  canCheckout: boolean;
}) {
  const [code, setCode] = useState("");

  return (
    <div className="h-fit border border-border bg-card p-6">
      <h2 className="text-lg font-bold uppercase">Tạm tính</h2>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Mã giảm giá"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-10"
        />
        <Button
          type="button"
          variant="outline"
          className="h-10"
          disabled={!code.trim() || isApplyingVoucher}
          onClick={() => onApplyVoucher(code.trim())}
        >
          Áp dụng
        </Button>
      </div>
      {appliedVoucherCode ? (
        <p className="mt-2 text-sm text-primary">Đã áp dụng mã {appliedVoucherCode}</p>
      ) : null}

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Tiền hàng ({itemCount} sản phẩm)</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Giảm giá</dt>
          <dd className={discount > 0 ? "text-destructive" : undefined}>
            {discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Phí vận chuyển</dt>
          <dd className="text-muted-foreground">Tính ở bước sau</dd>
        </div>
      </dl>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">Tổng cộng</p>
        <p className="text-xl font-extrabold">{formatPrice(total)}</p>
      </div>

      <Button
        variant="dark"
        className="mt-6 h-13 w-full text-base font-bold"
        disabled={!canCheckout}
        onClick={onCheckout}
      >
        Tiến hành thanh toán
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Tồn kho được kiểm tra lại trước khi vào bước thanh toán.
      </p>
    </div>
  );
}
