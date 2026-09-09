import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

// subtotal = tổng tiền của các sản phẩm ĐANG được chọn để thanh toán (không phải cả giỏ) —
// phải khớp với số hiển thị ở CartSummary, nếu không sẽ mâu thuẫn ngay trên cùng 1 màn hình.
export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualifies = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-brand-10" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {qualifies
          ? "Đơn của bạn đã được miễn phí vận chuyển"
          : `Mua thêm ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} để được miễn phí vận chuyển`}
      </p>
    </div>
  );
}
