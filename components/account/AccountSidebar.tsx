"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";
import type { AuthUser } from "@/lib/shared-types";

interface AccountNavItem {
  label: string;
  href: string;
  // Chỉ "Hồ sơ cá nhân" có UI thật ở đợt này — các mục còn lại theo đúng bố cục mockup
  // nhưng chưa có trang đích, khoá click (giống cách xử lý 3 tab chưa làm ở màn đăng nhập)
  // thay vì trỏ tới route sẽ 404.
  enabled?: boolean;
}

const ACCOUNT_NAV: AccountNavItem[] = [
  { label: "Hồ sơ cá nhân", href: "/account", enabled: true },
  { label: "Địa chỉ", href: "/account/addresses" },
  { label: "Đơn hàng của tôi", href: "/account/orders" },
  { label: "Đổi trả & hoàn tiền", href: "/account/returns" },
  { label: "Sản phẩm yêu thích", href: "/account/wishlist" },
  { label: "Điểm & hạng thành viên", href: "/account/loyalty" },
  { label: "Thông báo", href: "/account/notifications" },
];

export function AccountSidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside className="text-size-14 bg-white min-w-65">
      <div className="pb-9.25 pt-6 pl-6 flex items-center gap-3">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover" />
          ) : (
            <UserRound className="absolute inset-0 m-auto size-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">{user.fullName}</p>
          {/* Hạng/điểm thành viên: chưa có API loyalty, hiện tạm placeholder tĩnh theo đúng
              mockup thay vì bịa số liệu theo user thật. */}
          <p className="text-size-12 text-[#8B5339]">Hạng Bạc · 1.240 điểm</p>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Tài khoản">
        {ACCOUNT_NAV.map((item) => {
          const active = item.enabled && pathname === item.href;
          if (!item.enabled) {
            return (
              <span
                key={item.href}
                aria-disabled="true"
                className="block cursor-not-allowed border-l-4 border-transparent px-4 py-3 text-muted-foreground/60"
              >
                {item.label}
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block border-l-4 px-4 py-3 transition-colors",
                active
                  ? "border-[#8B5339] bg-[#F7F5F2] font-semibold text-[#8B5339]"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => logout()}
          className="block w-full rounded-lg px-3 py-2 text-left text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Đăng xuất
        </button>
      </nav>
    </aside>
  );
}
