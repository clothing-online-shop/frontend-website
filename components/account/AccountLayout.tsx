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
    // Mobile: p-4, cột sidebar+content xếp chồng dọc (flex-col). Tablet (md:) đã đủ rộng
    // để 2 cột nằm cạnh nhau như desktop, chỉ nới lỏng padding/gap ít hơn. Desktop (lg:)
    // giữ đúng p-8/gap-9 như thiết kế gốc, không đổi.
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-5 lg:gap-9">
        <AccountSidebar user={user} />
        <div className="bg-white w-full py-5 px-4 md:py-6 md:px-6 lg:py-8 lg:px-9">{children(user)}</div>
      </div>
    </div>
  );
}
