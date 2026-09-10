"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { AuthUser } from "@/lib/shared-types";
import { AccountSidebar } from "./AccountSidebar";

// children nhận `user` qua render-prop để page không phải gọi lại useRequireAuth().
export function AccountLayout({ children }: { children: (user: AuthUser) => ReactNode }) {
  const { user, ready } = useRequireAuth();

  if (!ready || !user) return null;

  return (
    // Sidebar cạnh content chỉ từ lg; dưới đó nav chuyển thành thanh ngang (xem AccountSidebar).
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      {/* lg:items-start: không để sidebar bị kéo giãn theo chiều cao content.
          min-w-0: cho cột content co được theo flex, không thì nội dung "cứng" (tab, badge)
          làm nó tràn ra ngoài ở màn hẹp. */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-9">
        <AccountSidebar user={user} />
        <div className="min-w-0 w-full bg-white py-5 px-4 md:py-6 md:px-6 lg:py-8 lg:px-9">
          {children(user)}
        </div>
      </div>
    </div>
  );
}
