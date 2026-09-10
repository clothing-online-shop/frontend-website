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
    // Mobile + tablet: cột nav + content xếp chồng dọc, content full-width. Chỉ desktop (lg:
    // >= 1024px) mới đủ rộng để sidebar 260px nằm cạnh content mà không bóp content quá hẹp
    // — dưới lg, sidebar biến thành thanh nav ngang ở trên (xem AccountSidebar).
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      {/* lg:items-start — mặc định flex kéo dài các cột theo cột cao nhất (align-items:
          stretch), khiến khung sidebar dài lê thê theo content bên phải mỗi khi nội dung
          nhiều (vd danh sách đơn hàng). items-start giữ sidebar đúng chiều cao nội dung thật
          của nó, không bị kéo giãn theo cột kia. */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-9">
        <AccountSidebar user={user} />
        {/* min-w-0: BẮT BUỘC cho flex child — mặc định flex item có min-width:auto, không co
            được nhỏ hơn nội dung "cứng" bên trong (tab whitespace-nowrap, badge/giá shrink-0
            ở trang đơn hàng). Thiếu nó thì content không chịu co theo cột, tràn ra ngoài. */}
        <div className="min-w-0 w-full bg-white py-5 px-4 md:py-6 md:px-6 lg:py-8 lg:px-9">
          {children(user)}
        </div>
      </div>
    </div>
  );
}
