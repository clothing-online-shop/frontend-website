import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

// subtotal = tổng tiền của các sản phẩm ĐANG được chọn để thanh toán (không phải cả giỏ) —
// phải khớp với số hiển thị ở CartSummary, nếu không sẽ mâu thuẫn ngay trên cùng 1 màn hình.
export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualifies = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
      <p className="shrink-0 text-sm text-muted-foreground">
        {qualifies
          ? "Đơn của bạn đã được miễn phí vận chuyển"
          : `Mua thêm ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} để được miễn phí vận chuyển`}
      </p>
      <div className="h-2 w-[180px] bg-secondary">
        <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
