"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryNode } from "@/lib/shared-types";
import { cn } from "@/lib/utils";

// Style dùng chung cho mọi tab trong thanh mega menu (kể cả tab "Bộ sưu tập").
const NAV_ITEM_CLASS =
  "flex h-[46px] items-center px-[18px] text-size-12 leading-none font-semibold tracking-[0.96px] uppercase transition-colors";

function navItemClass(isActive: boolean) {
  return cn(
    NAV_ITEM_CLASS,
    isActive
      ? "bg-background text-brand-7"
      : "text-background/85 hover:bg-background/10 hover:text-background aria-expanded:bg-background/10 aria-expanded:text-background"
  );
}

// Tab cha coi là active khi đang ở đúng trang của nó hoặc trang của 1 category con (mega
// menu chỉ hiện 2 cấp: tab cha + children trong dropdown), khớp breadcrumb dạng Trang chủ/Nữ/...
function isCategoryActive(category: CategoryNode, pathname: string) {
  const slugs = [category.slug, ...category.children.map((child) => child.slug)];
  return slugs.some((slug) => pathname === `/danh-muc/${slug}`);
}

function MegaMenuColumn({ category }: { category: CategoryNode }) {
  return (
    <div className="min-w-40">
      <Link
        href={`/danh-muc/${category.slug}`}
        className="mb-2 block text-sm font-semibold text-foreground hover:text-primary"
      >
        {category.name}
      </Link>
      {category.children.length > 0 ? (
        <ul className="space-y-1.5">
          {category.children.map((child) => (
            <li key={child.id}>
              <Link
                href={`/danh-muc/${child.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MegaMenuItem({ category, isActive }: { category: CategoryNode; isActive: boolean }) {
  const hasChildren = category.children.length > 0;

  return (
    <li className="group relative">
      <Link href={`/danh-muc/${category.slug}`} className={navItemClass(isActive)}>
        {category.name}
      </Link>
      {hasChildren ? (
        <div className="invisible absolute top-full left-1/2 z-40 w-max max-w-[90vw] -translate-x-1/2 pt-1 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
          <div className="flex gap-8 rounded-md border border-border bg-popover p-6 shadow-lg">
            {category.children.map((child) => (
              <MegaMenuColumn key={child.id} category={child} />
            ))}
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function MegaMenu({ categories }: { categories: CategoryNode[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:block" aria-label="Danh mục sản phẩm">
      <ul className="flex items-center justify-start">
        {categories.map((category) => (
          <MegaMenuItem key={category.id} category={category} isActive={isCategoryActive(category, pathname)} />
        ))}
        <li>
          {/* Chưa có trang bộ sưu tập riêng — giữ chỗ theo design, nối link thật khi có trang */}
          <Link href="#" className={navItemClass(false)}>
            Bộ sưu tập
          </Link>
        </li>
      </ul>
    </nav>
  );
}
