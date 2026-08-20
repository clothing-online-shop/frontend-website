"use client";

import Link from "next/link";
import type { CategoryNode } from "@/lib/shared-types";

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

function MegaMenuItem({ category }: { category: CategoryNode }) {
  const hasChildren = category.children.length > 0;

  return (
    <li className="group relative">
      <Link
        href={`/danh-muc/${category.slug}`}
        className="flex h-11 items-center px-3 text-xs font-bold tracking-wide text-background/85 uppercase transition-colors hover:bg-background/10 hover:text-background aria-expanded:bg-background/10 aria-expanded:text-background"
      >
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
  return (
    <nav className="hidden md:block" aria-label="Danh mục sản phẩm">
      <ul className="flex items-center">
        <li>
          <Link
            href="/san-pham"
            className="flex h-11 items-center px-3 text-xs font-bold tracking-wide text-background/85 uppercase transition-colors hover:bg-background/10 hover:text-background"
          >
            Tất cả sản phẩm
          </Link>
        </li>
        {categories.map((category) => (
          <MegaMenuItem key={category.id} category={category} />
        ))}
      </ul>
    </nav>
  );
}
