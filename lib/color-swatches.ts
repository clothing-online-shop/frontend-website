// Backend giờ có bảng Color thật (name + hexCode, xem backend-user GET /colors và
// backend-cms — ProductVariant.color giờ là FK trỏ colors.name) nên đây không còn là
// nguồn hex chính: các component ở trong cây "use client" (ColorFilter, ProductVariantPicker,
// FlashSaleSection) tự fetch GET /colors và ưu tiên dùng hex thật qua resolveColorHex().
// Bảng tĩnh dưới đây chỉ còn là fallback cho 2 trường hợp: (1) ProductCard render từ 1
// Server Component không có sẵn map màu đã fetch (vd RecentlyViewedSection) — không có
// cách gọi GET /colors mà không biến nó thành client component; (2) lúc GET /colors ở
// client chưa load xong. Không cần mở rộng bảng này nữa khi thấy màu mới — cứ thêm màu ở
// CMS (trang Màu sắc) là đủ, FE tự có hex thật qua API.
export const COLOR_SWATCHES: Record<string, string> = {
  Đen: "#1a1a1a",
  Trắng: "#ffffff",
  Xám: "#9c9691",
  Ghi: "#9c9691",
  Xanh: "#3b5fa0",
  "Xanh dương": "#3b5fa0",
  "Xanh navy": "#1f2d50",
  "Xanh lá": "#4a7c4e",
  "Xanh rêu": "#6b7a4f",
  "Xanh ngọc": "#3f9c8a",
  "Xanh khói": "#7a8b8c",
  Nâu: "#8b5339",
  "Nâu đất": "#6b4226",
  "Nâu nhạt": "#a97d5d",
  Kem: "#f0e6d6",
  "Kem nhạt": "#f5ecdf",
  Be: "#e2d0c4",
  Đỏ: "#b3261e",
  "Đỏ đô": "#6e1e28",
  Hồng: "#e8b4bc",
  "Hồng nhạt": "#f2d3d8",
  Vàng: "#e0b84b",
  "Vàng đồng": "#b8860b",
  Cam: "#d97b3f",
  "Cam đất": "#b5622f",
  Tím: "#7d5ba6",
  "Tím than": "#3d3358",
  Bạc: "#c4c4c4",
  Rêu: "#6b7a4f",
};

function normalizeColorKey(color: string): string {
  return color.trim().toLowerCase();
}

const NORMALIZED_SWATCHES: Record<string, string> = Object.fromEntries(
  Object.entries(COLOR_SWATCHES).map(([name, hex]) => [normalizeColorKey(name), hex]),
);

export function getColorSwatch(color: string): string {
  return NORMALIZED_SWATCHES[normalizeColorKey(color)] ?? "#cccccc";
}

// Dùng ở nơi đã có sẵn map màu thật fetch từ GET /colors (xem lib/colors-api.ts) — ưu tiên
// hex thật, chỉ rơi về bảng tĩnh getColorSwatch() khi map chưa có (đang loading) hoặc màu
// không có trong đó (dữ liệu cũ/hiếm gặp).
export function resolveColorHex(color: string, hexMap?: Record<string, string>): string {
  return hexMap?.[color] ?? getColorSwatch(color);
}
