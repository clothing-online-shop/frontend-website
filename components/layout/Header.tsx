import { getCategoryTree } from "@/lib/categories-api";
import { HeaderClient } from "@/components/layout/HeaderClient";

export async function Header() {
  // Header render ở mọi trang qua MainLayout — nếu API danh mục lỗi/timeout thì vẫn phải
  // render được header (menu rỗng) thay vì làm sập toàn bộ trang.
  const categories = await getCategoryTree().catch(() => []);

  return <HeaderClient categories={categories} />;
}
