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

export interface OrderListTab {
  key: string;
  label: string;
  statuses?: OrderStatus[];
}

export const ORDER_LIST_TABS: OrderListTab[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận", statuses: ["PENDING"] },
  { key: "preparing", label: "Chờ lấy hàng", statuses: ["CONFIRMED", "PACKING"] },
  { key: "shipping", label: "Đang giao", statuses: ["HANDED_OVER", "SHIPPING"] },
  { key: "completed", label: "Hoàn thành", statuses: ["COMPLETED"] },
  { key: "cancelled", label: "Đã hủy", statuses: ["CANCELLED"] },
];

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-[#EFE8E1] text-[#784900]",
  CONFIRMED: "bg-[#EFE8E1] text-[#784900]",
  PACKING: "bg-[#EFE8E1] text-[#784900]",
  HANDED_OVER: "bg-[#EFE8E1] text-[#784900]",
  SHIPPING: "bg-[#EFE8E1] text-[#784900]",
  COMPLETED: "bg-[#E4EBE6] text-[#23643F]",
  CANCELLED: "bg-[#F6E7E6] text-[#A03F3C]",
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
