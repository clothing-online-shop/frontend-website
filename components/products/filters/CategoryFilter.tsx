import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import type { CategoryNode } from "@/lib/shared-types";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/products/filters/FilterSection";

function categoryHref(
  searchParams: URLSearchParams,
  isActive: boolean,
  targetSlug: string,
): string {
  if (searchParams.get("search")) {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) params.delete("category");
    else params.set("category", targetSlug);
    return `/san-pham?${params.toString()}`;
  }
  return isActive ? "/san-pham" : `/danh-muc/${targetSlug}`;
}

// Kiểm tra đệ quy toàn bộ nhánh (không chỉ con trực tiếp) — danh mục đang active có thể là
// cháu (cấp 3, vd "Sơ mi trắng" dưới "Áo sơ mi" dưới "Nam"), không chỉ con (cấp 2).
function containsActiveDescendant(category: CategoryNode, activeCategorySlug?: string): boolean {
  if (!activeCategorySlug) return false;
  if (category.slug === activeCategorySlug) return true;
  return category.children.some((child) => containsActiveDescendant(child, activeCategorySlug));
}

function CategoryRow({
  category,
  activeCategorySlug,
  className,
}: {
  category: CategoryNode;
  activeCategorySlug?: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const isActive = activeCategorySlug === category.slug;
  return (
    <Link
      href={categoryHref(searchParams, isActive, category.slug)}
      className={cn(
        "flex items-center justify-between rounded-sm px-2 py-1 text-sm transition-colors hover:bg-secondary",
        isActive ? "bg-secondary font-bold text-primary" : "text-muted-foreground",
        className,
      )}
    >
      <span>{category.name}</span>
      <span className="text-xs text-muted-foreground">{category.productCount}</span>
    </Link>
  );
}

// Cấp 2/3 luôn hiện đủ (đệ quy hết chiều sâu, không chỉ 1 cấp con) khi cha đang mở — chỉ
// cấp 1 mới có nút thu gọn/mở rộng riêng (xem CategoryRootRow), theo đúng yêu cầu.
function CategoryChildRow({
  category,
  activeCategorySlug,
}: {
  category: CategoryNode;
  activeCategorySlug?: string;
}) {
  return (
    <li>
      <CategoryRow category={category} activeCategorySlug={activeCategorySlug} />
      {category.children.length > 0 ? (
        <ul className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
          {category.children.map((grandchild) => (
            <CategoryChildRow key={grandchild.id} category={grandchild} activeCategorySlug={activeCategorySlug} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

// Danh mục cấp 1 nào có con và không chứa danh mục đang active (ở bất kỳ cấp nào bên dưới)
// thì mặc định thu gọn — số root đã tăng nhiều (Nam/Nữ/Bé Trai/Bé Gái/Final Sale/...), mở hết
// cùng lúc lặp lại đúng vấn đề "Danh mục" đẩy các bộ lọc khác xuống xa mà max-h-80 +
// overflow-y-auto ở CategoryFilter chỉ giảm nhẹ chứ không giải quyết triệt để.
function CategoryRootRow({
  category,
  activeCategorySlug,
}: {
  category: CategoryNode;
  activeCategorySlug?: string;
}) {
  const [expanded, setExpanded] = useState(() => containsActiveDescendant(category, activeCategorySlug));

  if (category.children.length === 0) {
    return <CategoryRow category={category} activeCategorySlug={activeCategorySlug} />;
  }

  return (
    <div>
      <div className="flex items-center">
        <CategoryRow category={category} activeCategorySlug={activeCategorySlug} className="min-w-0 flex-1" />
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? `Thu gọn ${category.name}` : `Mở rộng ${category.name}`}
          aria-expanded={expanded}
          className="shrink-0 cursor-pointer p-1.5 text-muted-foreground hover:text-primary"
        >
          {expanded ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
        </button>
      </div>
      {expanded ? (
        <ul className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
          {category.children.map((child) => (
            <CategoryChildRow key={child.id} category={child} activeCategorySlug={activeCategorySlug} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function CategoryFilter({
  categories,
  activeCategorySlug,
}: {
  categories: CategoryNode[];
  activeCategorySlug?: string;
}) {
  return (
    <FilterSection title="Danh mục">
      {/* Cuộn riêng bên trong khối này (không phải cả sidebar) — kể cả sau khi các root thu
          gọn mặc định, danh mục đang active mở sẵn có thể vẫn khá dài. */}
      <ul className="max-h-80 space-y-1 overflow-y-auto pr-1">
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryRootRow category={category} activeCategorySlug={activeCategorySlug} />
          </li>
        ))}
      </ul>
    </FilterSection>
  );
}
