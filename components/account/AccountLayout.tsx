"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { AuthUser } from "@/lib/shared-types";
import { AccountSidebar } from "./AccountSidebar";

// children nhận `user` qua render-prop thay vì để từng page tự gọi lại useRequireAuth() lần
// nữa — layout đã gọi 1 lần rồi, gọi thêm lần nữa trong page chỉ tốn thêm 1 subscription
// zustand + 1 effect trùng lặp cho cùng 1 kết quả.
export function AccountLayout({ children }: { children: (user: AuthUser) => ReactNode }) {
  const { user, ready } = useRequireAuth();

  // Chưa rehydrate xong hoặc chưa đăng nhập (đang chờ redirect) — không render nội dung
  // thật để tránh nháy 1 khung hình dữ liệu rỗng/sai trước khi router.push("/login") chạy.
  if (!ready || !user) return null;

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="flex gap-9">
        <AccountSidebar user={user} />
        <div className="bg-white w-full py-8 px-9">{children(user)}</div>
      </div>
    </div>
  );
}
