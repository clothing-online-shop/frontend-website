import { getCategoryTree } from "@/lib/categories-api";
import { HeaderClient } from "@/components/layout/HeaderClient";
import { PromoBar } from "@/components/layout/PromoBar";

export async function Header() {
  // Header render ở mọi trang qua MainLayout — nếu API danh mục lỗi/timeout thì vẫn phải
  // render được header (menu rỗng) thay vì làm sập toàn bộ trang.
  const categories = await getCategoryTree().catch(() => []);

  return (
    <>
      {/* Nằm ngoài HeaderClient (sticky) có chủ đích — cuộn trôi đi bình thường, không
          chiếm vĩnh viễn không gian sticky cùng thanh điều hướng bên dưới. */}
      <PromoBar />
      <HeaderClient categories={categories} />
    </>
  );
}
