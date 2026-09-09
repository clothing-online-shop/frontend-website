"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, LogOut, ShoppingBag, User } from "lucide-react";
import type { CategoryNode } from "@/lib/shared-types";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth-store";
import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";

// Badge số lượng dùng chung cho các icon ở header (thông báo, giỏ hàng...) — quá MAX_COUNT
// thì rút gọn thành "99+" thay vì hiện số dài tràn khỏi hình tròn.
const MAX_COUNT = 99;

function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-primary-foreground">
      {count > MAX_COUNT ? `${MAX_COUNT}+` : count}
    </span>
  );
}

type HeaderActionItemData = {
  key: string;
  label: string;
  icon: typeof User;
  // true = mục "Tài khoản" — luôn có khung tròn nền/viền riêng (Figma: 18x18, bg
  // #DAE2FD, border 1px #C6C6CD) chứa ảnh đại diện thật nếu có, hoặc icon fallback nếu
  // chưa có avatar — khác các icon phẳng còn lại (Thông báo/Giỏ hàng/Đăng xuất...).
  isAvatar?: boolean;
  avatarUrl?: string | null;
  href?: string;
  badge?: number;
  onAction?: () => void;
  labelClassName?: string;
};

// 1 component dùng chung cho mọi icon-action ở header (Thông báo, Đăng nhập/Tài khoản, Đăng
// xuất, Giỏ hàng...) — có href thì render Link (điều hướng thật), không có thì render button
// (chưa có trang/API thật, vd Thông báo). onAction luôn được nơi gọi truyền vào riêng biệt.
function HeaderActionItem({ label, icon: Icon, isAvatar, avatarUrl, href, badge, onAction, labelClassName }: Omit<HeaderActionItemData, "key">) {
  const className = "relative flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70 transition-colors hover:text-foreground cursor-pointer";
  const children = (
    <>
      <span className="relative">
        {isAvatar ? (
          <span className="relative flex size-4.5 items-center justify-center overflow-hidden rounded-full border border-header-avatar-border bg-header-avatar-bg">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" fill sizes="18px" className="object-cover" />
            ) : (
              <Icon className="size-3" />
            )}
          </span>
        ) : (
          <Icon className="size-5" />
        )}
        {badge !== undefined && badge > 0 && <CountBadge count={badge} />}
      </span>
      <span className={labelClassName ?? "text-neutral-37322C text-size-12 font-medium"}>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onAction} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onAction} className={className}>
      {children}
    </button>
  );
}

export function HeaderClient({ categories }: { categories: CategoryNode[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cart = useCart();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mỗi icon nhận 1 hàm onAction riêng — tách để nơi khác (vd. analytics, mở panel thông
  // báo khi có API thật) có thể thay đổi hành vi từng nút mà không đụng vào component hiển thị.
  function handleNotificationAction() {
    // TODO: mở panel thông báo khi có API/store thông báo thật.
  }

  function handleLoginAction() {
    // Điều hướng /login đã do Link đảm nhiệm — hook này dành cho logic phụ (vd. analytics).
  }

  function handleCartAction() {
    // Điều hướng /cart đã do Link đảm nhiệm — hook này dành cho logic phụ (vd. analytics).
  }

  const accountItems: HeaderActionItemData[] = user
    ? [
        {
          key: "account",
          label: "Tài khoản",
          icon: User,
          isAvatar: true,
          avatarUrl: user.avatarUrl,
          href: "/account",
        },
        { key: "logout", label: "Đăng xuất", icon: LogOut, onAction: () => setLogoutOpen(true) },
      ]
    : [{ key: "login", label: "Đăng nhập", icon: User, href: "/login", onAction: handleLoginAction }];

  // Chưa có API thông báo thật nên badge tạm để 0 — giỏ hàng đã nối thật (xem hooks/useCart.ts).
  const actionItems: HeaderActionItemData[] = [
    { key: "notification", label: "Thông báo", icon: Bell, badge: 0, onAction: handleNotificationAction },
    ...accountItems,
    {
      key: "cart",
      label: "Giỏ hàng",
      icon: ShoppingBag,
      href: "/cart",
      badge: cart.itemCount,
      onAction: handleCartAction,
    },
  ];

  return (
    <header className={cn("sticky top-0 z-50 bg-background-header transition-shadow", scrolled && "shadow-md")}>
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-3 px-4">
        <MobileNav categories={categories} />

        <Logo className="shrink-0 text-foreground" />

        <SearchBar className="mx-4 hidden max-w-xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1">
          {actionItems.map(({ key, ...item }) => (
            <HeaderActionItem key={key} {...item} />
          ))}
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>

      <div className="hidden bg-brand-9 md:block">
        <div className="mx-auto max-w-6xl px-4">
          <MegaMenu categories={categories} />
        </div>
      </div>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </header>
  );
}
