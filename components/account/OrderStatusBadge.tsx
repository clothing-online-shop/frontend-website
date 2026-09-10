import type { OrderStatus } from "@/lib/shared-types";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_BADGE_CLASS,
  ORDER_STATUS_GROUP_LABEL,
  ORDER_STATUS_LABEL,
} from "@/lib/orderStatus";

// Badge trạng thái đơn — dùng chung cho danh sách (nhãn nhóm) và trang chi tiết (`detailed`,
// nhãn chi tiết). Cùng 1 bộ màu ở cả 2 nơi.
export function OrderStatusBadge({
  status,
  detailed = false,
  className,
}: {
  status: OrderStatus;
  detailed?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 px-2.5 py-1.25 text-size-12 font-semibold",
        ORDER_STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      {detailed ? ORDER_STATUS_LABEL[status] : ORDER_STATUS_GROUP_LABEL[status]}
    </span>
  );
}
