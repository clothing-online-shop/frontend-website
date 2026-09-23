"use client";

import { useRef, useState } from "react";
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
      : "text-background/85 hover:bg-background hover:text-brand-7 aria-expanded:bg-background aria-expanded:text-brand-7"
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

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

// Gom mọi danh mục con/cháu của 1 danh mục gốc đã được admin đánh dấu showInNewArrivals/
// showInSaleCorner (qua CMS, xem CategoryFormModal.tsx) — không phải nội dung bịa, luôn trỏ
// đúng trang danh mục thật có sản phẩm thật.
function collectFlaggedDescendants(
  category: CategoryNode,
  flag: "showInNewArrivals" | "showInSaleCorner",
): { label: string; href: string }[] {
  const result: { label: string; href: string }[] = [];
  function walk(node: CategoryNode) {
    for (const child of node.children) {
      if (child[flag]) result.push({ label: child.name, href: `/danh-muc/${child.slug}` });
      walk(child);
    }
  }
  walk(category);
  return result;
}

// Chỉ để xem, không điều hướng (không có href) — 2 ảnh "look" lấy trực tiếp từ
// category.megaMenuLeftImageUrl/megaMenuRightImageUrl (CMS, chỉ có ở danh mục gốc).
function MegaMenuLookImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative aspect-3/4 w-36 shrink-0 overflow-hidden bg-secondary lg:w-50", className)}>
      <Image src={src} alt={alt} fill sizes="160px" className="object-cover" />
    </div>
  );
}

// Panel nhiều cột cho danh mục đã có taxonomy chi tiết (cấp 2 + cấp 3) — mỗi cột gộp tối đa
// 2 nhóm cấp 2 để đỡ quá cao, cộng thêm cột "Hàng mới về"/"Sale corner" (chỉ hiện nếu có ít
// nhất 1 danh mục con được đánh dấu). 2 ảnh "look" (nếu category có set) đặt bookend — 1 ảnh
// đầu tiên bên trái, 1 ảnh cuối cùng bên phải — giống đúng bố cục trong design, không dồn
// chung 1 chỗ.
function MegaMenuRichPanel({ category }: { category: CategoryNode }) {
  const columns = chunk(category.children, 2);
  const promoGroups = [
    { title: "Hàng mới về", items: collectFlaggedDescendants(category, "showInNewArrivals") },
    { title: "Sale corner", items: collectFlaggedDescendants(category, "showInSaleCorner") },
  ].filter((group) => group.items.length > 0);

  return (
    // justify-start (không phải justify-between trên cả hàng) — trước đây justify-between đẩy
    // TOÀN BỘ item dàn đều theo khoảng cách bằng nhau, nên danh mục ít cột (1 cột) bị khoảng
    // trắng khổng lồ giữa cột chữ và ảnh phải. Giờ nội dung (ảnh trái + các cột) tự nhiên căn
    // trái sát nhau, chỉ riêng ảnh phải dùng ml-auto để luôn ghim đúng mép phải container
    // (max-w-[1440px] w-full, xem MegaMenuItem) — đúng ý đồ gốc (ảnh bookend 2 đầu) ở MỌI số
    // lượng cột, không phụ thuộc nội dung ở giữa nhiều hay ít.
    <div className="flex flex-wrap justify-start gap-6 lg:gap-10">
      {category.megaMenuLeftImageUrl ? (
        <MegaMenuLookImage src={category.megaMenuLeftImageUrl} alt="" />
      ) : null}

      {columns.map((column, index) => (
        <div key={index} className="w-32 shrink-0 space-y-6 lg:w-40">
          {column.map((group) => (
            <div key={group.id}>
              <Link
                href={`/danh-muc/${group.slug}`}
                className="mb-2.5 block text-sm font-bold text-foreground uppercase hover:text-primary"
              >
                {group.name}
              </Link>
              <ul className="space-y-1.5">
                {group.children.map((leaf) => (
                  <li key={leaf.id}>
                    <Link
                      href={`/danh-muc/${leaf.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {leaf.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      {promoGroups.length > 0 ? (
        <div className="w-32 shrink-0 space-y-6 lg:w-40">
          {promoGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2.5 text-sm font-bold text-primary uppercase">{group.title}</p>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {category.megaMenuRightImageUrl ? (
        <MegaMenuLookImage src={category.megaMenuRightImageUrl} alt="" className="ml-auto" />
      ) : null}
    </div>
  );
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

// Panel đơn giản (danh mục cấp 2 dạng danh sách + 1 ảnh) — dùng cho danh mục chưa có taxonomy
// chi tiết (chưa đủ cấp 3 để lên layout nhiều cột như MegaMenuRichPanel), ví dụ "Nam".
function MegaMenuSimplePanel({ category }: { category: CategoryNode }) {
  return (
    <div className="flex gap-8">
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
  );
}

// Đóng chậm 150ms sau khi rời chuột thay vì đóng ngay — panel neo vào ancestor full-width
// (xem bên dưới) nên nằm khá xa trigger theo chiều ngang (tab "Nam" sát mép trái nhưng panel
// trải hết màn hình), chỉ dựa CSS :hover thuần (group-hover) rất dễ mất hover khi rê chuột
// nhanh/chéo qua đúng lúc lệch 1px giữa 2 box — dùng state + timeout để chắc chắn không bị
// vậy: rời tab vẫn còn 150ms để chuột "chạm" tới panel trước khi nó đóng, hoặc quay lại tab/
// panel trong lúc đó sẽ huỷ luôn timeout đang chờ.
const CLOSE_DELAY_MS = 150;

function MegaMenuItem({ category, isActive }: { category: CategoryNode; isActive: boolean }) {
  const hasChildren = category.children.length > 0;
  // "Rich" khi có ít nhất 1 nhóm cấp 2 đã có sẵn cấp 3 bên dưới (taxonomy đủ chi tiết để lên
  // nhiều cột) — chỉ đúng với "Nữ" ở thời điểm này, "Nam" tự rơi về panel đơn giản.
  const isRich = category.children.some((child) => child.children.length > 0);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  return (
    // Không để "relative" ở đây nữa — bỏ trống để absolute bên dưới xuyên qua, neo vào
    // ancestor "relative" full-width thật sự (div bg-brand-9 bọc <MegaMenu>, xem
    // HeaderClient.tsx) thay vì neo vào chính <li> nhỏ hẹp này.
    <li onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={`/danh-muc/${category.slug}`}
        className={navItemClass(isActive)}
        aria-expanded={hasChildren ? open : undefined}
      >
        {category.name}
      </Link>
      {hasChildren ? (
        // absolute + inset-x-0 + top-full neo vào div bg-brand-9 (relative, đã full width sẵn,
        // xem HeaderClient.tsx) — panel tự đúng full màn hình VÀ đúng ngay dưới thanh mega
        // menu ở MỌI trạng thái cuộn, không cần biết trước chiều cao PromoBar (khác cách tính
        // top cố định bằng px trước đây, sai lúc PromoBar còn hiện chưa cuộn qua).
        <div
          className={cn(
            "absolute inset-x-0 top-full z-40 opacity-0 transition-opacity duration-150",
            open ? "visible opacity-100" : "invisible",
          )}
        >
          <div className="border-t border-border bg-popover shadow-lg">
            <div className="mx-auto max-w-[1440px] px-4 py-6">
              {isRich ? <MegaMenuRichPanel category={category} /> : <MegaMenuSimplePanel category={category} />}
            </div>
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
