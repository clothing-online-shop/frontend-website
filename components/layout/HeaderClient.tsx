"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingBag, User } from "lucide-react";
import type { CategoryNode } from "@/lib/shared-types";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth-store";
import { getWishlist } from "@/lib/wishlist-api";
import { WISHLIST_KEY, WISHLIST_PAGE_PATH } from "@/hooks/useWishlistActions";
import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";
import { AccountMenu } from "@/components/layout/AccountMenu";
import {
  CountBadge,
  HEADER_ACTION_CLASS,
  HeaderActionContent,
  type HeaderActionContentProps,
} from "@/components/layout/HeaderAction";

type HeaderActionItemData = HeaderActionContentProps & {
  key: string;
  href: string;
  className?: string;
};

// Icon-action ở header (Yêu thích, Giỏ hàng, Tài khoản khi chưa đăng nhập) — đều là Link điều hướng
// thật. Khi đã đăng nhập, "Tài khoản" là dropdown riêng (xem AccountMenu).
function HeaderActionItem({ href, className, ...content }: Omit<HeaderActionItemData, "key">) {
  return (
    <Link href={href} className={cn(HEADER_ACTION_CLASS, className)}>
      <HeaderActionContent {...content} />
    </Link>
  );
}

export function HeaderClient({ categories }: { categories: CategoryNode[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cart = useCart();

  // Cùng queryKey ["wishlist"] với WishlistButton (React Query dedupe, không gọi API 2 lần) —
  // bấm tim ở bất kỳ ProductCard nào cũng tự cập nhật badge số này ngay, không cần refresh.
  const wishlistQuery = useQuery({ queryKey: WISHLIST_KEY, queryFn: getWishlist, enabled: !!user });
  const wishlistCount = wishlistQuery.data?.length ?? 0;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Yêu thích / Giỏ hàng đứng bên trái, Tài khoản ở ngoài cùng bên phải (đã đăng nhập = dropdown
  // AccountMenu chứa hồ sơ/đơn hàng/thông báo/đăng xuất; chưa đăng nhập = link sang /login).
  // Đã đăng nhập thì ở tablet (dưới lg) Yêu thích/Giỏ hàng ẩn khỏi header, chuyển vào dropdown
  // AccountMenu để ô tìm kiếm dài ra; khách chưa đăng nhập không có dropdown nên vẫn hiện.
  const collapseOnTablet = user ? "max-lg:hidden" : undefined;
  const actionItems: HeaderActionItemData[] = [
    {
      key: "wishlist",
      label: "Yêu thích",
      icon: Heart,
      // Chưa đăng nhập thì sang thẳng /login, không vào trang yêu thích rồi mới bị useRequireAuth đá ra.
      href: user ? WISHLIST_PAGE_PATH : "/login",
      badge: wishlistCount,
      className: collapseOnTablet,
    },
    {
      key: "cart",
      label: "Giỏ hàng",
      icon: ShoppingBag,
      href: "/cart",
      badge: cart.itemCount,
      className: collapseOnTablet,
    },
    ...(user
      ? []
      : [{ key: "account", label: "Tài khoản", icon: User, isAvatar: true, href: "/login" }]),
  ];

  return (
    <header className={cn("sticky top-0 z-50 bg-background-header transition-shadow", scrolled && "shadow-md")}>
      {/* Mobile: h-14, logo rút cỡ (text-size-20) — bản gốc dùng nguyên logo + 4 icon-có-nhãn
          cỡ desktop, không đủ chỗ nên logo bị đẩy xuống dòng 2 (vỡ layout). Chỉ giữ icon Giỏ
          hàng ở hàng đầu (thao tác nhanh mua hàng cần thấy ngay); Thông báo/Tài khoản/Đăng
          xuất dồn vào drawer MobileNav — xem component đó. */}
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 md:h-20 md:gap-3">
        <MobileNav categories={categories} />

        <Logo className="h-7 shrink-0 md:h-12.5" />

        <SearchBar className="mx-4 hidden flex-1 md:block lg:max-w-xl" />

        <Link
          href="/cart"
          aria-label="Giỏ hàng"
          className="relative ml-auto flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground md:hidden"
        >
          <ShoppingBag className="size-5" />
          {cart.itemCount > 0 && <CountBadge count={cart.itemCount} />}
        </Link>

        <div className="hidden items-center gap-1 md:ml-auto md:flex">
          {actionItems.map(({ key, ...item }) => (
            <HeaderActionItem key={key} {...item} />
          ))}
          {user ? (
            <AccountMenu
              user={user}
              wishlistCount={wishlistCount}
              cartCount={cart.itemCount}
              onLogout={() => setLogoutOpen(true)}
            />
          ) : null}
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>

      {/* relative — làm điểm neo absolute cho panel mega menu (xem MegaMenu.tsx), div này đã
          rộng full width sẵn (không bọc max-w-6xl) nên panel neo vào đây luôn đúng full màn
          hình mà không cần biết trước chiều cao PromoBar/header (khác cách tính top cố định
          bằng px trước đây, sai lúc PromoBar còn hiện chưa cuộn qua). */}
      <div className="relative hidden bg-brand-9 md:block">
        <div className="mx-auto max-w-6xl px-4">
          <MegaMenu categories={categories} />
        </div>
      </div>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </header>
  );
}
