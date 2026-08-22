import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/lib/shared-types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  // persist rehydrate từ localStorage là bất đồng bộ (chạy sau lần render đầu, kể cả với
  // localStorage vốn đọc đồng bộ) — thiếu cờ này, mọi page guard kiểu "useEffect(() => {
  // if (!user) router.push('/login') })" sẽ đá nhầm user ĐÃ đăng nhập về /login mỗi khi
  // vào thẳng URL (F5, mở link mới, VNPay redirect full-page về /payment/return) vì lúc
  // effect chạy lần đầu, rehydrate còn chưa kịp nạp lại user từ localStorage.
  hasHydrated: boolean;
  setSession: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setSession: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "clothing-shop-auth" },
  ),
);

// Module này bị import cả ở server (SSR pass của Next.js đi qua lib/api-client.ts →
// store/auth-store.ts dù chỉ dùng ở client component) — trên server không có
// window/localStorage nên zustand KHÔNG gắn `.persist` vào store (persist trở thành no-op),
// gọi `.persist.onFinishHydration` trực tiếp ở top-level sẽ throw TypeError ngay lúc
// module evaluate, sập toàn bộ SSR (đã tự tay verify qua log server: mọi route liên quan
// đều 500). Chỉ đăng ký khi chắc chắn đang chạy trong trình duyệt.
if (typeof window !== "undefined") {
  useAuthStore.persist.onFinishHydration(() => {
    useAuthStore.setState({ hasHydrated: true });
  });
  if (useAuthStore.persist.hasHydrated()) {
    useAuthStore.setState({ hasHydrated: true });
  }
}
