"use client";

import { useRouter } from "next/navigation";
import { logout as logoutApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

// Dùng chung cho Header và trang tài khoản — trước đây logout chỉ xóa store local, không
// báo BE thu hồi refresh token nên phiên cũ vẫn còn dùng được nếu lộ token.
export function useLogout() {
  const router = useRouter();

  return async function logout() {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      await logoutApi({ refreshToken }).catch(() => undefined);
    }
    useAuthStore.getState().logout();
    router.push("/login");
  };
}
