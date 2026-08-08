"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, ShoppingBag, User } from "lucide-react";
import type { CategoryNode } from "@/lib/shared-types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function MobileCategoryNode({
  category,
  onNavigate,
}: {
  category: CategoryNode;
  onNavigate: () => void;
}) {
  if (category.children.length === 0) {
    return (
      <Link
        href={`/danh-muc/${category.slug}`}
        onClick={onNavigate}
        className="block rounded-md px-2 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
      >
        {category.name}
      </Link>
    );
  }

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary [&::-webkit-details-marker]:hidden">
        {category.name}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
        {category.children.map((child) => (
          <MobileCategoryNode key={child.id} category={child} onNavigate={onNavigate} />
        ))}
      </div>
    </details>
  );
}

export function MobileNav({ categories }: { categories: CategoryNode[] }) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Mở menu danh mục" />}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Danh mục</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2 pb-4">
          <Link
            href="/products"
            onClick={close}
            className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary"
          >
            Tất cả sản phẩm
          </Link>
          {categories.map((category) => (
            <MobileCategoryNode key={category.id} category={category} onNavigate={close} />
          ))}
          <div className="my-2 border-t border-border" />
          <Link
            href="/cart"
            onClick={close}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-secondary"
          >
            <ShoppingBag className="size-4" />
            Giỏ hàng
          </Link>
          <Link
            href="/account"
            onClick={close}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-secondary"
          >
            <User className="size-4" />
            Tài khoản
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
