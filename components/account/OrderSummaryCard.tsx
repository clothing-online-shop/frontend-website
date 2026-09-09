import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/shared-types";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/orderStatus";

// Card tóm tắt 1 đơn hàng — dùng chung ở trang "Đặt hàng thành công" (order/success) và
// trang chi tiết đơn trong "Đơn hàng của tôi" (account/orders/[orderCode]). Chỉ tóm tắt
// (địa chỉ/thanh toán/tổng tiền), KHÔNG liệt kê từng sản phẩm trong đơn — quyết định tạm thời
// (v1), danh sách sản phẩm trong đơn để làm sau khi cần trang chi tiết đầy đủ hơn.
export function OrderSummaryCard({ order }: { order: Order }) {
  return (
    <Card>
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
  );
}
