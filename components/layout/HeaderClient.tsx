"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, LogOut, ShoppingBag, User } from "lucide-react";
import type { CategoryNode } from "@/lib/shared-types";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/useLogout";

function HeaderIconLink({
  href,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  label: string;
  icon: typeof User;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70 transition-colors hover:text-foreground"
    >
      <span className="relative">
        <Icon className="size-5" />
        {badge !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {badge}
          </span>
        )}
      </span>
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

function NotificationButton() {
  // Chưa có tính năng thông báo thật (không có API/store) — hiển thị theo design nhưng
  // không điều hướng đi đâu, tránh link chết tới trang chưa tồn tại.
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70 transition-colors hover:text-foreground"
    >
      <Bell className="size-5" />
      <span className="text-[11px] font-medium">Thông báo</span>
    </button>
  );
}

function AccountMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  if (!user) {
    return <HeaderIconLink href="/login" label="Đăng nhập" icon={User} />;
  }

  const firstName = user.fullName.trim().split(/\s+/).pop() ?? user.fullName;

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/account"
        className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70 transition-colors hover:text-foreground"
      >
        <User className="size-5" />
        <span className="max-w-16 truncate text-[11px] font-medium">{firstName}</span>
      </Link>
      <button
        type="button"
        onClick={() => logout()}
        aria-label="Đăng xuất"
        className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70 transition-colors hover:text-foreground"
      >
        <LogOut className="size-5" />
        <span className="text-[11px] font-medium">Đăng xuất</span>
      </button>
    </div>
  );
}

export function HeaderClient({ categories }: { categories: CategoryNode[] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 bg-white transition-shadow", scrolled && "shadow-md")}>
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-3 px-4">
        <MobileNav categories={categories} />

        <Logo className="shrink-0 text-xl sm:text-2xl" />

        <SearchBar className="mx-2 hidden max-w-xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1">
          <NotificationButton />
          <AccountMenu />
          {/* Chưa có API giỏ hàng thật (Sprint 3, xem store/cart-store.ts) — số lượng tạm để 0 */}
          <HeaderIconLink href="/cart" label="Giỏ hàng" icon={ShoppingBag} badge={0} />
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>

      <div className="hidden bg-foreground md:block">
        <div className="mx-auto max-w-6xl px-4">
          <MegaMenu categories={categories} />
        </div>
      </div>
    </header>
  );
}
