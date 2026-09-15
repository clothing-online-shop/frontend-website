import type { Order, OrderItem, OrderStatus, PaginatedResult, PaymentStatus } from "@/lib/shared-types";
import type { ListMyOrdersParams } from "@/lib/orders-api";

// Mock cho trang "Đơn hàng của tôi" — CHỈ dùng tạm vì chưa có luồng tạo đơn hàng thật để
// sinh dữ liệu test. Xoá file này + đổi lại queryFn trong OrdersPageClient.tsx về
// listMyOrders() thật khi BE/luồng đặt hàng đã có đơn thật để hiển thị.

// Ảnh thật (quần áo) từ Unsplash thay vì picsum.photos/seed — picsum trả ảnh ngẫu nhiên bất
// kỳ chủ đề gì (phong cảnh, đồ vật...), không phù hợp để mô phỏng ảnh sản phẩm thời trang.
const MOCK_PRODUCTS: Array<{ name: string; size: string; color: string; price: number; image: string }> = [
  {
    name: "Áo sơ mi lụa tay dài",
    size: "M",
    color: "Trắng ngà",
    price: 450000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
  },
  {
    name: "Quần âu ống suông",
    size: "L",
    color: "Be",
    price: 550000,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop",
  },
  {
    name: "Chân váy midi xếp ly",
    size: "S",
    color: "Đen",
    price: 380000,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop",
  },
  {
    name: "Áo khoác blazer dáng rộng",
    size: "M",
    color: "Nâu đất",
    price: 890000,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=400&fit=crop",
  },
  {
    name: "Đầm suông tay ngắn",
    size: "M",
    color: "Xanh rêu",
    price: 620000,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=400&fit=crop",
  },
  {
    name: "Áo len cổ lọ",
    size: "L",
    color: "Kem",
    price: 420000,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=400&fit=crop",
  },
];

function makeItem(orderCode: string, index: number): OrderItem {
  const product = MOCK_PRODUCTS[index % MOCK_PRODUCTS.length];
  return {
    id: `${orderCode}-item-${index}`,
    productVariantId: `${orderCode}-variant-${index}`,
    productName: product.name,
    variantSku: `SKU-${orderCode}-${index}`,
    size: product.size,
    color: product.color,
    thumbnail: product.image,
    quantity: 1,
    priceAtPurchase: product.price,
  };
}

interface MockOrderSpec {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  itemCount: number;
  daysAgo: number;
  codeSuffix: string;
}

// 3 đơn/nhóm trạng thái x 5 nhóm (khớp 5 tab lẻ trong ORDER_LIST_TABS, không tính tab "Tất
// cả") = 15 đơn — đúng số lượng tab "Tất cả" cần hiển thị.
const MOCK_ORDER_SPECS: MockOrderSpec[] = [
  // Chờ xác nhận (PENDING)
  { status: "PENDING", paymentStatus: "UNPAID", itemCount: 1, daysAgo: 0, codeSuffix: "GUZDUG" },
  { status: "PENDING", paymentStatus: "UNPAID", itemCount: 2, daysAgo: 1, codeSuffix: "VLD3D7" },
  { status: "PENDING", paymentStatus: "PAID", itemCount: 1, daysAgo: 1, codeSuffix: "EPTDQU" },
  // Chờ lấy hàng (CONFIRMED, PACKING)
  { status: "CONFIRMED", paymentStatus: "PAID", itemCount: 3, daysAgo: 2, codeSuffix: "A1B2C3" },
  { status: "CONFIRMED", paymentStatus: "UNPAID", itemCount: 1, daysAgo: 3, codeSuffix: "D4E5F6" },
  { status: "PACKING", paymentStatus: "PAID", itemCount: 2, daysAgo: 3, codeSuffix: "G7H8I9" },
  // Đang giao (HANDED_OVER, SHIPPING)
  { status: "HANDED_OVER", paymentStatus: "PAID", itemCount: 2, daysAgo: 4, codeSuffix: "J1K2L3" },
  { status: "SHIPPING", paymentStatus: "PAID", itemCount: 1, daysAgo: 5, codeSuffix: "M4N5O6" },
  { status: "SHIPPING", paymentStatus: "UNPAID", itemCount: 3, daysAgo: 5, codeSuffix: "P7Q8R9" },
  // Hoàn thành (COMPLETED)
  { status: "COMPLETED", paymentStatus: "PAID", itemCount: 2, daysAgo: 7, codeSuffix: "S1T2U3" },
  { status: "COMPLETED", paymentStatus: "PAID", itemCount: 1, daysAgo: 9, codeSuffix: "V4W5X6" },
  { status: "COMPLETED", paymentStatus: "PAID", itemCount: 3, daysAgo: 12, codeSuffix: "Y7Z8A9" },
  // Đã hủy (CANCELLED)
  { status: "CANCELLED", paymentStatus: "REFUNDED", itemCount: 1, daysAgo: 6, codeSuffix: "B1C2D3" },
  { status: "CANCELLED", paymentStatus: "UNPAID", itemCount: 2, daysAgo: 8, codeSuffix: "E4F5G6" },
  { status: "CANCELLED", paymentStatus: "FAILED", itemCount: 3, daysAgo: 10, codeSuffix: "H7I8J9" },
];

function makeOrder(spec: MockOrderSpec, index: number): Order {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - spec.daysAgo);
  const dateCode = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  const orderCode = `DH${dateCode}${spec.codeSuffix}`;

  const items = Array.from({ length: spec.itemCount }, (_, i) => makeItem(orderCode, index * 10 + i));
  const totalAmount = items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

  return {
    id: `mock-${orderCode}`,
    userId: "mock-user",
    orderCode,
    status: spec.status,
    totalAmount,
    discountAmount: 0,
    shippingAddress: "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "COD",
    paymentStatus: spec.paymentStatus,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    items,
  };
}

const MOCK_ORDERS: Order[] = MOCK_ORDER_SPECS.map(makeOrder).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

// Ký hiệu y hệt listMyOrders() thật (lib/orders-api.ts) — lọc theo statuses rồi phân trang,
// để OrdersPageClient dùng được luôn mà không phải sửa gì khác ngoài chỗ gọi queryFn.
export function listMyOrdersMock(params: ListMyOrdersParams = {}): PaginatedResult<Order> {
  const { statuses, page = 1, limit = 5 } = params;
  const filtered = statuses?.length
    ? MOCK_ORDERS.filter((order) => statuses.includes(order.status))
    : MOCK_ORDERS;

  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    meta: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    },
  };
}
