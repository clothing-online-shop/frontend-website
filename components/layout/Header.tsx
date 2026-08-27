import { getCategoryTree } from "@/lib/categories-api";
import { HeaderClient } from "@/components/layout/HeaderClient";

export async function Header() {
  // Header render ở mọi trang qua MainLayout — nếu API danh mục lỗi/timeout thì vẫn phải
  // render được header (menu rỗng) thay vì làm sập toàn bộ trang.
  const categories = await getCategoryTree().catch(() => []);

  return (
    <>
      <div className="flex items-center justify-center gap-3 bg-primary px-4 py-1.5 text-center text-xs text-primary-foreground">
        <span className="font-bold tracking-wide">THU 2026</span>
        <span className="font-bold">GIẢM 30 – 50%</span>
        <span className="text-primary-foreground/75">11/08 – 23/08</span>
      </div>
      <HeaderClient categories={categories} />
    </>
  );
}
