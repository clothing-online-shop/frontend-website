"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Tạm ẩn Thông báo (chưa có tính năng) — bật lại cùng nút Thông báo bên dưới.
// import { Bell } from "lucide-react";
import { ChevronDown, ChevronRight, LogOut, Menu, ShoppingBag, UserRound } from "lucide-react";
import type { CategoryNode } from "@/lib/shared-types";
import { FEATURED_CATEGORY_FALLBACK_IMAGE } from "@/lib/home-mock";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth-store";
import { useCart } from "@/hooks/useCart";
import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";

function CategoryThumb({ category }: { category: CategoryNode }) {
  return (
    <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-secondary">
      <Image
        src={category.image ?? FEATURED_CATEGORY_FALLBACK_IMAGE(category.slug)}
        alt=""
        fill
        sizes="36px"
        className="object-cover"
      />
    </span>
  );
}

// level 0-1 (tab cha + con) hiện thumbnail cho sinh động, khớp mega menu desktop — level 2
// (cháu, thường là danh mục rất hẹp) giữ dạng chữ gọn, tránh rối vì thụt lề đã khá sâu.
function MobileCategoryNode({
  category,
  onNavigate,
  level = 0,
}: {
  category: CategoryNode;
  onNavigate: () => void;
  level?: number;
}) {
  const showThumb = level < 2;

  if (category.children.length === 0) {
    return (
      <Link
        href={`/danh-muc/${category.slug}`}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
      >
        {showThumb ? <CategoryThumb category={category} /> : null}
        <span className="flex-1">{category.name}</span>
        <span className="text-xs text-muted-foreground">{category.productCount}</span>
      </Link>
    );
  }

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary [&::-webkit-details-marker]:hidden">
        {showThumb ? <CategoryThumb category={category} /> : null}
        <span className="flex-1">{category.name}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
        {category.children.map((child) => (
          <MobileCategoryNode key={child.id} category={child} onNavigate={onNavigate} level={level + 1} />
        ))}
      </div>
    </details>
  );
}

export function MobileNav({ categories }: { categories: CategoryNode[] }) {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cart = useCart();

  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Mở menu" />}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {/* Icon Thông báo/Tài khoản/Đăng xuất bị bỏ khỏi hàng đầu header ở mobile (không đủ
            chỗ cạnh logo + hamburger) — dồn hết vào đây, đầu drawer, thay vì mất luôn. */}
        {user ? (
          <Link
            href="/thong-tin-ca-nhan"
            onClick={close}
            className="mx-2 mb-2 flex items-center gap-3 rounded-md px-2 py-3 hover:bg-secondary"
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-header-avatar-border bg-header-avatar-bg">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="" fill sizes="40px" className="object-cover" />
              ) : (
                <UserRound className="size-5" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{user.fullName}</span>
              <span className="text-xs text-muted-foreground">Xem tài khoản</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ) : (
          <Link
            href="/login"
            onClick={close}
            className="mx-2 mb-2 block rounded-md bg-primary px-2 py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Đăng nhập / Đăng ký
          </Link>
        )}

        <nav className="flex flex-col gap-1 px-2" aria-label="Tài khoản">
          <Link
            href="/cart"
            onClick={close}
            className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-secondary"
          >
            <ShoppingBag className="size-4" />
            <span className="flex-1">Giỏ hàng</span>
            {cart.itemCount > 0 ? (
              <span className="text-xs text-muted-foreground">{cart.itemCount}</span>
            ) : null}
          </Link>
          {/* Tạm ẩn Thông báo (chưa có tính năng) — không xoá, biết đâu sau này lại dùng.
          {user ? (
            <button
              type="button"
              className="flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary"
            >
              <Bell className="size-4" />
              Thông báo
            </button>
          ) : null}
          */}
          {user ? (
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Đăng xuất
            </button>
          ) : null}
        </nav>

        <div className="my-3 border-t border-border" />

        <nav className="flex flex-col gap-1 px-2 pb-4" aria-label="Danh mục">
          <Link
            href="/san-pham"
            onClick={close}
            className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary"
          >
            Tất cả sản phẩm
          </Link>
          {categories.map((category) => (
            <MobileCategoryNode key={category.id} category={category} onNavigate={close} />
          ))}
        </nav>
      </SheetContent>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </Sheet>
  );
}
