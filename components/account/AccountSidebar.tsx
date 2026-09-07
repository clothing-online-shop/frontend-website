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

// Dùng chung cho cả 2 khối <nav> bên dưới (pill cuộn ngang ở mobile, list dọc ở tablet/
// desktop) — trước đây mỗi khối tự lặp lại y hệt logic disabled/active/aria-current, sửa 1
// chỗ (vd thêm quyền truy cập) dễ quên sửa chỗ còn lại. "variant" chỉ đổi phần className
// hiển thị, không đổi logic.
function AccountNavLink({
  item,
  active,
  variant,
}: {
  item: AccountNavItem;
  active: boolean;
  variant: "pill" | "row";
}) {
  if (!item.enabled) {
    return (
      <span
        aria-disabled="true"
        className={
          variant === "pill"
            ? "shrink-0 cursor-not-allowed whitespace-nowrap rounded-full bg-muted/60 px-3.5 py-1.5 text-size-13 text-muted-foreground/50"
            : "block cursor-not-allowed border-l-4 border-transparent px-4 py-3 text-muted-foreground/60"
        }
      >
        {item.label}
      </span>
    );
  }
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
    // Mobile: full width (đang xếp chồng lên trên content, xem AccountLayout). Từ tablet
    // (md:) trở lên dùng đúng min-w-65 (260px) như desktop — thử co hẹp còn ~224px trước
    // đó khiến tên user/nhãn mục dài ("Điểm & hạng thành viên"...) bị wrap 2 dòng, trông
    // rối; ở 768px (iPad Mini) vẫn dư ~440px cho content nên không cần ép hẹp sidebar.
    <aside className="text-size-14 bg-white w-full md:w-auto md:min-w-65">
      <div className="flex items-center h-22.5 sm:border-b border-neutral-EDEBE8 justify-between gap-3 pl-4 pt-4 pb-5 pr-4 md:pl-5 md:pt-5 md:pb-7 md:pr-0 lg:pl-6 lg:pt-6 lg:pb-9.25 mb-4">
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
            {/* Hạng/điểm thành viên: chưa có API loyalty, hiện tạm placeholder tĩnh theo đúng
                mockup thay vì bịa số liệu theo user thật. */}
            <p className="text-size-12 text-brand-38">Hạng Bạc · 1.240 điểm</p>
          </div>
        </div>
        {/* Đăng xuất tách khỏi list điều hướng trên mobile — icon gọn ở góc card user, không
            chiếm thêm 1 hàng trong thanh tab cuộn ngang bên dưới (khác ý nghĩa hành động so
            với các mục điều hướng nên không hợp để xen vào giữa dãy tab). Từ tablet (md:)
            vẫn nằm cuối <nav> như thiết kế gốc (ẩn icon này). */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setLogoutOpen(true)}
          aria-label="Đăng xuất"
          className="shrink-0 text-muted-foreground md:hidden"
        >
          <LogOut className="size-4.5" />
        </Button>
      </div>

      {/* Mobile: list dọc 7 mục + đăng xuất đẩy form xuống rất xa, phải cuộn mới thấy — thay
          bằng 1 thanh tab cuộn NGANG ngay dưới card user, chỉ cao 1 hàng. Vuốt ngang để xem
          hết mục, không cần thêm thao tác mở dialog/menu nào. Từ tablet (md:) trở lên vẫn
          hiện nguyên <nav> dọc như cũ (ẩn thanh tab ngang này). */}
      <nav
        aria-label="Tài khoản"
        className="flex gap-2 overflow-x-auto border-y border-border px-4 py-3 md:hidden"
      >
        {ACCOUNT_NAV.map((item) => (
          <AccountNavLink
            key={item.href}
            item={item}
            active={Boolean(item.enabled && pathname === item.href)}
            variant="pill"
          />
        ))}
      </nav>

      <nav className="hidden space-y-1 md:block" aria-label="Tài khoản">
        {ACCOUNT_NAV.map((item) => (
          <AccountNavLink
            key={item.href}
            item={item}
            active={Boolean(item.enabled && pathname === item.href)}
            variant="row"
          />
        ))}
        {/* Cùng border-l-4 px-4 py-3 như các mục nav ở trên — để border-transparent "ăn" đúng
            4px như hàng khác thì chữ "Đăng xuất" mới thẳng hàng, không bị lệch trái/khác
            khoảng cách như trước (rounded-lg px-3 py-2 không khớp khung của các item kia). */}
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="block w-full border-l-4 border-transparent px-4 py-3 text-left text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Đăng xuất
        </button>
      </nav>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </aside>
  );
}
