"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import type { CategoryNode } from "@/lib/shared-types";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/utils";

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
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <MobileNav categories={categories} />

        <Logo className="shrink-0 text-lg" />

        <SearchBar className="mx-2 hidden max-w-xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1">
          <HeaderIconLink href="/account" label="Tài khoản" icon={User} />
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
