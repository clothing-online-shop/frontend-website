"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

// Gộp lại đoạn "đợi persist rehydrate rồi mới đá về /login nếu chưa đăng nhập" — đoạn này
// trước đó bị copy-paste giống hệt nhau ở account/order-success/payment-return... (mỗi trang
// tự viết lại useEffect + hasHydrated + user riêng). Trang cần đăng nhập chỉ cần gọi
// `const { user, ready } = useRequireAuth()` rồi `if (!ready) return null` (hoặc loading UI).
export function useRequireAuth() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !user) router.push("/login");
  }, [hasHydrated, user, router]);

  return { user, ready: hasHydrated && !!user };
}
