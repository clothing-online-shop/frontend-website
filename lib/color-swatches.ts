// Bảng mã màu hiển thị cho tên màu tiếng Việt dùng trong variant sản phẩm — khớp với
// danh sách màu thật đang seed ở backend (Đen/Trắng/Xanh). Dùng chung cho ProductCard,
// ProductFilters, ProductVariantPicker để không lặp lại map này ở từng nơi.
export const COLOR_SWATCHES: Record<string, string> = {
  Đen: "#1a1a1a",
  Trắng: "#ffffff",
  Xanh: "#3b5fa0",
};

export function getColorSwatch(color: string): string {
  return COLOR_SWATCHES[color] ?? "#cccccc";
}
