import type { CategoryNode } from "@/lib/shared-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Tìm danh mục cha thật của activeCategory trong cây (categories đã là cây lồng cấp
// cha/con từ getCategoryTree()) — trước đây breadcrumb luôn chèn cứng "Sản phẩm" làm mục
// giữa thay vì tên danh mục cha, sai khác design (vd "Trang chủ / Nữ / Áo sơ mi").
function findParent(categories: CategoryNode[], childId: string): CategoryNode | undefined {
  for (const category of categories) {
    if (category.children.some((child) => child.id === childId)) return category;
  }
  return undefined;
}

export function ProductsBreadcrumb({
  categories,
  activeCategory,
  search,
}: {
  categories: CategoryNode[];
  activeCategory: CategoryNode | undefined;
  search?: string;
}) {
  const parent = activeCategory ? findParent(categories, activeCategory.id) : undefined;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {search ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Kết quả tìm kiếm cho &quot;{search}&quot;</BreadcrumbPage>
          </BreadcrumbItem>
        ) : activeCategory ? (
          <>
            {parent ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/danh-muc/${parent.slug}`}>{parent.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : null}
            <BreadcrumbItem>
              <BreadcrumbPage>{activeCategory.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Tất cả sản phẩm</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
