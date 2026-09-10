import type { CheckoutPaymentMethod, OrderStatus, PaymentStatus } from "@/lib/shared-types";

// Nhãn CHI TIẾT từng trạng thái — dùng ở trang chi tiết đơn (account/orders/[orderCode]),
// trang "Đặt hàng thành công", lịch sử trạng thái... những nơi khách xem sâu, cần granular.
// KHÔNG dùng cho badge ở danh sách đơn (xem ORDER_STATUS_GROUP_LABEL bên dưới).
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PACKING: "Đang đóng gói",
  HANDED_OVER: "Đã bàn giao vận chuyển",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
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

// Nhãn NHÓM — badge ở danh sách đơn hiện đúng nhãn của tab chứa nó ("Chờ lấy hàng", "Đang
// giao"...) thay vì nhãn chi tiết ("Đã xác nhận", "Đang đóng gói"), để tab và badge luôn
// khớp nhau, khách không thấy lệch. Derive thẳng từ ORDER_LIST_TABS (1 nguồn sự thật: đổi
// cách gộp tab thì nhãn badge tự đổi theo). Mọi OrderStatus đều thuộc đúng 1 tab.
export const ORDER_STATUS_GROUP_LABEL: Record<OrderStatus, string> = (() => {
  const map = {} as Record<OrderStatus, string>;
  for (const tab of ORDER_LIST_TABS) {
    for (const status of tab.statuses ?? []) map[status] = tab.label;
  }
  return map;
})();

// Màu token định nghĩa ở app/globals.css (--order-progress-*/--order-done-*/--order-cancel-*).
// 5 trạng thái "đang chạy" (PENDING→SHIPPING) dùng chung 1 tông nâu nhạt.
const PROGRESS_BADGE = "bg-order-progress-bg text-order-progress-fg";

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING: PROGRESS_BADGE,
  CONFIRMED: PROGRESS_BADGE,
  PACKING: PROGRESS_BADGE,
  HANDED_OVER: PROGRESS_BADGE,
  SHIPPING: PROGRESS_BADGE,
  COMPLETED: "bg-order-done-bg text-order-done-fg",
  CANCELLED: "bg-order-cancel-bg text-order-cancel-fg",
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
