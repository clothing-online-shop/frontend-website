"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";

interface AccountNavItem {
  label: string;
  href: string;
}

// Khớp cả route con (trang chi tiết đơn) — trừ "/thong-tin-ca-nhan" là tiền tố của mọi route
// con nên chỉ khớp chính xác, không thì 2 mục cùng active.
function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/thong-tin-ca-nhan") return false;
  return pathname.startsWith(`${href}/`);
}

// Mục chưa có tính năng vẫn có route riêng (hiện FeaturePlaceholder "Tính năng chờ phát triển"),
// không báo toast — sau này chỉ cần thay nội dung page tương ứng.
const ACCOUNT_NAV: AccountNavItem[] = [
  { label: "Hồ sơ cá nhân", href: "/thong-tin-ca-nhan" },
  { label: "Địa chỉ", href: "/thong-tin-ca-nhan/dia-chi" },
  { label: "Đơn hàng của tôi", href: "/thong-tin-ca-nhan/don-hang-cua-toi" },
  { label: "Đổi trả & hoàn tiền", href: "/thong-tin-ca-nhan/doi-tra-hoan-tien" },
  { label: "Sản phẩm yêu thích", href: "/thong-tin-ca-nhan/san-pham-yeu-thich" },
  { label: "Điểm & hạng thành viên", href: "/thong-tin-ca-nhan/diem-hang-thanh-vien" },
  { label: "Thông báo", href: "/thong-tin-ca-nhan/thong-bao" },
];

function AccountNavLink({
  item,
  active,
  variant,
}: {
  item: AccountNavItem;
  active: boolean;
  variant: "pill" | "row";
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        variant === "pill"
          ? "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-size-13 transition-colors"
          : "block border-l-4 px-4 py-3 transition-colors",
        variant === "pill"
          ? active
            ? "bg-primary font-semibold text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/70"
          : active
            ? "border-primary bg-neutral-96 font-semibold text-primary"
            : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {item.label}
    </Link>
  );
}

export function AccountSidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    // < lg: full-width, nav ngang; từ lg: sidebar 260px cạnh content.
    <aside className="text-size-14 bg-white w-full lg:w-auto lg:min-w-65">
      <div className="flex items-center h-22.5 sm:border-b border-neutral-EDEBE8 justify-between gap-3 pl-4 pt-4 pb-5 pr-4 lg:pl-6 lg:pt-6 lg:pb-9.25 lg:pr-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.fullName} fill sizes="44px" className="object-cover" />
            ) : (
              <UserRound className="absolute inset-0 m-auto size-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-size-14 text-brand-10">{user.fullName}</p>
            {/* Placeholder — chưa có API loyalty. */}
            <p className="text-size-12 text-brand-38">Hạng Bạc · 1.240 điểm</p>
          </div>
        </div>
        {/* < lg: nút đăng xuất là icon ở góc card user (không xen vào thanh tab ngang). */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setLogoutOpen(true)}
          aria-label="Đăng xuất"
          className="shrink-0 text-muted-foreground lg:hidden"
        >
          <LogOut className="size-4.5" />
        </Button>
      </div>

      {/* < lg: nav dạng thanh tab cuộn ngang. */}
      <nav
        aria-label="Tài khoản"
        className="flex gap-2 overflow-x-auto border-y border-border px-4 py-3 lg:hidden"
      >
        {ACCOUNT_NAV.map((item) => (
          <AccountNavLink
            key={item.href}
            item={item}
            active={isNavActive(pathname, item.href)}
            variant="pill"
          />
        ))}
      </nav>

      <nav className="hidden space-y-1 lg:block" aria-label="Tài khoản">
        {ACCOUNT_NAV.map((item) => (
          <AccountNavLink
            key={item.href}
            item={item}
            active={isNavActive(pathname, item.href)}
            variant="row"
          />
        ))}
        {/* Cùng border-l-4 px-4 py-3 như các mục nav để chữ thẳng hàng. */}
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="block w-full cursor-pointer border-l-4 border-transparent px-4 py-3 text-left text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Đăng xuất
        </button>
      </nav>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </aside>
  );
}
