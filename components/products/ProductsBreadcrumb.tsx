import { Fragment } from "react";
import type { CategoryNode } from "@/lib/shared-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// ancestors = các danh mục tổ tiên của activeCategory từ gốc xuống (rỗng nếu là danh mục gốc) —
// hiện đủ cả chuỗi (vd "Trang chủ / Nam / Áo sơ mi / Sơ mi trắng"), không chỉ cha trực tiếp.
export function ProductsBreadcrumb({
  ancestors,
  activeCategory,
  search,
}: {
  ancestors: CategoryNode[];
  activeCategory: CategoryNode | undefined;
  search?: string;
}) {
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
            {ancestors.map((ancestor) => (
              <Fragment key={ancestor.id}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/danh-muc/${ancestor.slug}`}>{ancestor.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
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
