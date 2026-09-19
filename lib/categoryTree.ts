import type { CategoryNode } from "@/lib/shared-types";

// Cây danh mục sâu tối đa 3 cấp (Nam > Áo sơ mi > Sơ mi trắng) — mọi chỗ tìm danh mục phải
// duyệt đệ quy, không được chỉ xét "gốc + con trực tiếp" (danh mục cấp 3 sẽ không tìm thấy:
// mất tiêu đề/ảnh nền hero, breadcrumb thiếu cha, metadata trang rơi về mặc định).
export function flattenCategories(categories: CategoryNode[]): CategoryNode[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children)]);
}

// Đường đi từ danh mục gốc tới danh mục có slug khớp (gồm cả chính nó ở cuối); mảng rỗng nếu
// không có danh mục nào khớp.
export function findCategoryPathBySlug(categories: CategoryNode[], slug: string): CategoryNode[] {
  for (const category of categories) {
    if (category.slug === slug) return [category];
    const childPath = findCategoryPathBySlug(category.children, slug);
    if (childPath.length > 0) return [category, ...childPath];
  }
  return [];
}
