const GUEST_ID_KEY = "clothing-shop-guest-id";

// Sinh 1 lần, lưu localStorage — cần cho header X-Guest-Id mà backend-user yêu cầu ở API
// /recently-viewed khi khách chưa đăng nhập (xem
// backend-user/src/modules/recently-viewed/recently-viewed.controller.ts). Chỉ gọi được ở
// client (localStorage) — không dùng trong Server Component.
export function getGuestId(): string {
  const existing = localStorage.getItem(GUEST_ID_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(GUEST_ID_KEY, id);
  return id;
}
