// Bảng mã màu hiển thị cho tên màu tiếng Việt dùng trong variant sản phẩm. Dùng chung cho
// ProductCard, ProductFilters, ProductVariantPicker để không lặp lại map này ở từng nơi —
// tên màu nào không có trong bảng thì getColorSwatch() trả về màu xám mặc định, nên mở
// rộng bảng này khi thấy màu mới xuất hiện trong data thật.
export const COLOR_SWATCHES: Record<string, string> = {
  Đen: "#1a1a1a",
  Trắng: "#ffffff",
  Xám: "#9c9691",
  Xanh: "#3b5fa0",
  "Xanh khói": "#7a8b8c",
  Nâu: "#8b5339",
  "Nâu đất": "#6b4226",
  Kem: "#f0e6d6",
  "Kem nhạt": "#f5ecdf",
  Be: "#e2d0c4",
  Đỏ: "#b3261e",
  Hồng: "#e8b4bc",
  Vàng: "#e0b84b",
};

export function getColorSwatch(color: string): string {
  return COLOR_SWATCHES[color] ?? "#cccccc";
}
