// Định danh khách vãng lai (chưa đăng nhập) — BE (search-history, recently-viewed...) dùng
// header X-Guest-Id để gộp dữ liệu theo từng trình duyệt khi chưa có user.id. Sinh 1 lần,
// lưu localStorage để giữ nguyên qua các lần ghé lại — KHÔNG sinh mới mỗi request (sẽ làm
// BE tưởng đây là khách vãng lai mới, mất hết lịch sử của lần trước).
const GUEST_ID_KEY = "clothing-shop-guest-id";

export function getGuestId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.localStorage.getItem(GUEST_ID_KEY);
    if (existing) return existing;

    const generated = crypto.randomUUID();
    window.localStorage.setItem(GUEST_ID_KEY, generated);
    return generated;
  } catch {
    // Trình duyệt chặn localStorage (chế độ ẩn danh nghiêm ngặt...) — bỏ qua, coi như
    // không có định danh, các API cần identity sẽ tự báo lỗi thiếu userId/guestId thay vì
    // crash cả trang.
    return null;
  }
}
