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
}: {
  href: string;
  label: string;
  icon: typeof User;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70 transition-colors hover:text-foreground"
    >
      <Icon className="size-5" />
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

// Trang trí theo thiết kế mới — chưa có tính năng thông báo thật (không có API/store nào
// khác), nên KHÔNG bọc Link (tránh dẫn tới trang không tồn tại/gây hiểu nhầm đã có tính
// năng). Chỉ hiện icon, chưa nhận click.
function NotificationBellPlaceholder() {
  return (
    <span
      className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70"
      aria-hidden="true"
    >
      <Bell className="size-5" />
      <span className="text-[11px] font-medium">Thông báo</span>
    </span>
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
    <header className={cn("sticky top-0 z-50 bg-background transition-shadow", scrolled && "shadow-md")}>
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-3 px-4">
        <MobileNav categories={categories} />

        <Logo className="shrink-0 text-foreground text-xl md:text-2xl" />

        <SearchBar className="mx-4 hidden max-w-xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1">
          <NotificationBellPlaceholder />
          <AccountMenu />
          <HeaderIconLink href="/cart" label="Giỏ hàng" icon={ShoppingBag} />
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
