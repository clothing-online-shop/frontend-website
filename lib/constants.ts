// Ngưỡng miễn phí vận chuyển hiển thị ở trang giỏ hàng — chưa có cấu hình thật từ BE (BE chỉ
// tính phí ship thật qua GET /shipping/fee, cần addressId chưa có ở bước giỏ hàng). Hardcode
// tạm ở FE; cần đồng bộ nếu sau này có cấu hình ngưỡng thật từ CMS.
export const FREE_SHIPPING_THRESHOLD = 500_000;

// Ngưỡng hiển thị "Còn N sản phẩm trong kho" thay vì "Còn hàng" ở dòng giỏ hàng — khớp ngưỡng
// mặc định bên backend-cms (GET /inventory/settings).
export const LOW_STOCK_THRESHOLD = 5;

// Nhãn tình trạng tồn kho dùng chung (badge cạnh đánh giá, dòng dưới ô chọn size, dòng giỏ hàng,
// thẻ sản phẩm) — trước đây mỗi nơi tự gõ lại chữ, dễ lệch wording khi đổi.
export const STOCK_LABEL = {
  inStock: "Còn hàng",
  outOfStock: "Hết hàng",
} as const;

// Trần của bộ lọc "Khoảng giá" ở trang sản phẩm (thanh trượt + ô nhập) — dùng chung để
// ProductFilters (tính chip/xóa lọc) và PriceRangeFilter không lệch nhau.
export const PRICE_FILTER_MAX = 2_000_000;
