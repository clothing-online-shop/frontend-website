"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryNode } from "@/lib/shared-types";
import { FEATURED_CATEGORY_FALLBACK_IMAGE } from "@/lib/home-mock";
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

function collectSlugs(category: CategoryNode): string[] {
  return [category.slug, ...category.children.flatMap(collectSlugs)];
}

// Tab cha coi là active khi đang ở đúng trang của nó hoặc trang của 1 category con/cháu (cây
// danh mục tối đa 3 cấp — xem backend-cms), khớp breadcrumb dạng Trang chủ/Nam/Áo nam/...
function isCategoryActive(category: CategoryNode, pathname: string) {
  return collectSlugs(category).some((slug) => pathname === `/danh-muc/${slug}`);
}

function MegaMenuChildLink({ child }: { child: CategoryNode }) {
  return (
    <>
      <Link href={`/danh-muc/${child.slug}`} className="group flex items-center gap-3 py-1.5">
        <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-secondary">
          <Image
            src={child.image ?? FEATURED_CATEGORY_FALLBACK_IMAGE(child.slug)}
            alt=""
            fill
            sizes="44px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </span>
        <span className="text-sm font-medium text-foreground group-hover:text-primary">{child.name}</span>
        <span className="ml-auto text-xs text-muted-foreground">{child.productCount}</span>
      </Link>
      {/* Cấp 3 (nếu có) — thụt lề dưới tên danh mục cấp 2, khớp mép trái điểm bắt đầu chữ
          (size-11 + gap-3 = 56px, không phải dưới thumbnail). */}
      {child.children.length > 0 ? (
        <ul className="mb-1.5 ml-14 space-y-1">
          {child.children.map((grandchild) => (
            <li key={grandchild.id}>
              <Link
                href={`/danh-muc/${grandchild.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {grandchild.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
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
        // left-0 (không căn giữa) — panel giờ đủ rộng để tràn khỏi viewport bên trái nếu căn
        // giữa dưới tab đầu tiên ("Nam" nằm sát mép trái thanh nav).
        <div className="invisible absolute top-full left-0 z-40 max-w-[90vw] pt-1 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
          <div className="flex gap-8 border border-border bg-popover p-6 shadow-lg">
            <div className="min-w-[200px]">
              <p className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                {category.name}
              </p>
              <ul>
                {category.children.map((child) => (
                  <li key={child.id}>
                    <MegaMenuChildLink child={child} />
                  </li>
                ))}
              </ul>
              <Link
                href={`/danh-muc/${category.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Xem tất cả {category.name} →
              </Link>
            </div>

            <Link href={`/danh-muc/${category.slug}`} className="group/img block w-40 shrink-0">
              <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                <Image
                  src={category.image ?? FEATURED_CATEGORY_FALLBACK_IMAGE(category.slug)}
                  alt={category.name}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                />
              </div>
              <p className="mt-2 text-sm font-bold text-foreground uppercase group-hover/img:text-primary">
                {category.name}
              </p>
            </Link>
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
