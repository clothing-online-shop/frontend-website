"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, Heart, LogOut, Package, ShoppingBag, UserRound } from "lucide-react";
import type { AuthUser } from "@/lib/shared-types";
import { cn } from "@/lib/utils";
import { formatPhoneDisplay } from "@/lib/format";
import { WISHLIST_PAGE_PATH } from "@/hooks/useWishlistActions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatBadgeCount } from "@/components/layout/HeaderAction";

const MENU_ITEM_CLASS =
  "flex w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-2.5 text-left text-size-14 whitespace-nowrap text-foreground outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary";

interface MenuLink {
  label: string;
  href: string;
  icon: typeof UserRound;
  // Chỉ hiện trong dropdown ở tablet (dưới lg) — từ lg trở lên mục này đã có icon riêng ngoài header.
  tabletOnly?: boolean;
  count?: number;
}

// Khối tài khoản ở góc phải header (avatar + tên + SĐT + mũi tên), bấm mở dropdown các mục phụ
// (hồ sơ, đơn hàng, thông báo, đăng xuất) — header chỉ giữ Yêu thích / Giỏ hàng ở bên trái nó.
export function AccountMenu({
  user,
  wishlistCount,
  cartCount,
  onLogout,
}: {
  user: AuthUser;
  wishlistCount: number;
  cartCount: number;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Tablet (md → dưới lg) header hẹp: Yêu thích / Giỏ hàng gom vào dropdown này, nhường chỗ cho ô tìm
  // kiếm dài ra; từ lg trở lên chúng hiện thành icon riêng ở header nên ẩn khỏi dropdown (tabletOnly).
  const menuLinks: MenuLink[] = [
    { label: "Hồ sơ cá nhân", href: "/thong-tin-ca-nhan", icon: UserRound },
    { label: "Đơn hàng của tôi", href: "/thong-tin-ca-nhan/don-hang-cua-toi", icon: Package },
    { label: "Yêu thích", href: WISHLIST_PAGE_PATH, icon: Heart, tabletOnly: true, count: wishlistCount },
    { label: "Giỏ hàng", href: "/cart", icon: ShoppingBag, tabletOnly: true, count: cartCount },
    { label: "Thông báo", href: "/thong-tin-ca-nhan/thong-bao", icon: Bell },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Menu tài khoản"
        className="group ml-3 flex w-48 cursor-pointer items-center gap-2.5 text-left lg:w-52"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" fill sizes="40px" className="object-cover" />
          ) : (
            <UserRound className="size-5 text-muted-foreground" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-size-14 font-semibold text-brand-10">
            {user.fullName}
          </span>
          {/* Không có SĐT (đăng ký bằng email) thì hiện email thay thế. */}
          <span className="block truncate text-size-13 text-neutral-68625C">
            {user.phone ? formatPhoneDisplay(user.phone) : user.email}
          </span>
        </span>
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-brand-10 text-white">
          <ChevronDown className="size-3 transition-transform group-data-popup-open:rotate-180" />
        </span>
      </PopoverTrigger>
      {/* Rộng đúng bằng khối tài khoản (--anchor-width do popover tính từ trigger) và thẳng mép trái. */}
      <PopoverContent
        align="start"
        sideOffset={10}
        style={{ width: "var(--anchor-width)" }}
        className="gap-0 rounded-lg bg-white p-2"
      >
        <nav aria-label="Tài khoản" className="flex flex-col">
          {menuLinks.map(({ label, href, icon: Icon, tabletOnly, count }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={cn(MENU_ITEM_CLASS, tabletOnly && "lg:hidden")}
            >
              <Icon className="size-5 text-brand-38" />
              {label}
              {count ? (
                <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] leading-4 font-bold text-primary-foreground">
                  {formatBadgeCount(count)}
                </span>
              ) : null}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              close();
              onLogout();
            }}
            className={cn(MENU_ITEM_CLASS, "text-destructive")}
          >
            <LogOut className="size-5" />
            Đăng xuất
          </button>
        </nav>
      </PopoverContent>
    </Popover>
  );
}
