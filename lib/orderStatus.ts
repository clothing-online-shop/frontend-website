import type { CheckoutPaymentMethod, OrderStatus, PaymentStatus } from "@/lib/shared-types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PACKING: "Đang đóng gói",
  HANDED_OVER: "Đã bàn giao vận chuyển",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

// Cấu hình tab cho trang "Đơn hàng của tôi" — mỗi tab gộp nhiều OrderStatus thật thành 1
// nhóm hiển thị (BE có 7 trạng thái chi tiết, UI chỉ cần 4 nhóm + "Tất cả"). `statuses`
// undefined = không lọc (tab "Tất cả"). Dùng chung cho cả tab bar và query param gửi lên
// GET /orders?status=...
export interface OrderListTab {
  key: string;
  label: string;
  statuses?: OrderStatus[];
}

export const ORDER_LIST_TABS: OrderListTab[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận", statuses: ["PENDING"] },
  {
    key: "shipping",
    label: "Đang giao",
    statuses: ["CONFIRMED", "PACKING", "HANDED_OVER", "SHIPPING"],
  },
  { key: "completed", label: "Hoàn thành", statuses: ["COMPLETED"] },
  { key: "cancelled", label: "Đã hủy", statuses: ["CANCELLED"] },
];

// Màu badge trạng thái ở trang "Đơn hàng của tôi" — theo nhóm (không phải theo từng
// OrderStatus riêng lẻ) để khớp đúng 4 nhóm hiển thị của ORDER_LIST_TABS phía trên.
export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-[#EFE8E1] text-[#784900]",
  CONFIRMED: "bg-[#EFE8E1] text-[#784900]",
  PACKING: "bg-[#EFE8E1] text-[#784900]",
  HANDED_OVER: "bg-[#EFE8E1] text-[#784900]",
  SHIPPING: "bg-[#EFE8E1] text-[#784900]",
  COMPLETED: "bg-[#EFE8E1] text-[#784900]",
  CANCELLED: "bg-[#EFE8E1] text-[#784900]",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
  FAILED: "Thất bại",
};

export const PAYMENT_METHOD_LABEL: Record<CheckoutPaymentMethod, string> = {
  COD: "Thanh toán khi nhận hàng",
  VNPAY: "VNPay",
  MOMO: "Ví MoMo",
  STRIPE: "Thẻ quốc tế (Stripe)",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
};
