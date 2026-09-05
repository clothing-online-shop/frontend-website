import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
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
  // remember=true (mặc định, khớp hành vi cũ trước khi có checkbox "Ghi nhớ đăng nhập") →
  // lưu localStorage, sống qua cả lúc đóng hẳn trình duyệt. remember=false → lưu
  // sessionStorage, vẫn sống qua F5/điều hướng trong cùng tab nhưng mất khi đóng tab/trình
  // duyệt — đúng nghĩa "không ghi nhớ" thay vì chỉ là 1 checkbox trang trí không có tác dụng.
  setSession: (
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
    remember?: boolean,
  ) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const REMEMBER_FLAG_KEY = "clothing-shop-remember-me";

// Cờ "có ghi nhớ hay không" phải nằm ở 1 nơi CỐ ĐỊNH (luôn localStorage) để đọc được TRƯỚC
// khi biết nên đọc phần state thật (user/token) từ localStorage hay sessionStorage — nếu tự
// nó cũng nằm trong phần state persist thì rơi vào vòng lặp con-gà-quả-trứng (phải biết
// storage nào mới đọc được state, nhưng lại cần đọc state mới biết storage nào).
function readRememberFlag(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(REMEMBER_FLAG_KEY) !== "false";
}

function activeStorage(): Storage {
  return readRememberFlag() ? window.localStorage : window.sessionStorage;
}

// Cầu nối cho zustand persist — tự chọn localStorage/sessionStorage theo cờ ở trên cho MỌI
// lần đọc/ghi, không cố định 1 loại lúc module khởi tạo (khởi tạo chỉ chạy 1 lần, trong khi
// remember có thể đổi giữa các lần đăng nhập khác nhau trên cùng 1 trình duyệt).
const dynamicStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return activeStorage().getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    activeStorage().setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    // Xóa cả 2 nơi — logout phải sạch dù đăng nhập lúc đó chọn remember hay không.
    window.localStorage.removeItem(name);
    window.sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setSession: (user, accessToken, refreshToken, remember = true) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(REMEMBER_FLAG_KEY, String(remember));
        }
        set({ user, accessToken, refreshToken });
      },
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(REMEMBER_FLAG_KEY);
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    { name: "clothing-shop-auth", storage: createJSONStorage(() => dynamicStorage) },
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
