import { getCategoryTree } from "@/lib/categories-api";
import { getActivePromoBar } from "@/lib/promo-bar-api";
import { HeaderClient } from "@/components/layout/HeaderClient";
import { PromoBar } from "@/components/layout/PromoBar";

export async function Header() {
  // Header render ở mọi trang qua MainLayout — nếu API lỗi/timeout thì vẫn phải render
  // được header (menu rỗng/không có thanh khuyến mãi) thay vì làm sập toàn bộ trang.
  const [categories, promoBar] = await Promise.all([
    getCategoryTree().catch(() => []),
    getActivePromoBar().catch(() => null),
  ]);

  return (
    <>
      {/* Nằm ngoài HeaderClient (sticky) có chủ đích — cuộn trôi đi bình thường, không
          chiếm vĩnh viễn không gian sticky cùng thanh điều hướng bên dưới. */}
      <PromoBar promo={promoBar} />
      <HeaderClient categories={categories} />
    </>
  );
}
