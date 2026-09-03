// Thanh khuyến mãi trên cùng — chưa có API chiến dịch/banner thật cho vị trí này (khác
// HOME_BANNERS ở lib/home-mock.ts, đó là banner slider riêng của trang chủ), nên nội dung
// tạm thời tĩnh để demo giao diện, giống cách NewsletterForm/Footer đang mock các phần
// chưa có backend. Không sticky — nằm ngoài phần header (xem Header.tsx) để cuộn trôi đi
// bình thường, không chiếm chỗ cố định cùng thanh điều hướng.
export function PromoBar() {
  return (
    <div className="bg-primary px-4 py-3 text-center text-size-15 leading-none text-primary-foreground">
      <span className="text-size-19 leading-none font-normal tracking-[0.76px] uppercase">Thu 2026</span>
      <span className="mx-2 opacity-60">•</span>
      <span className="text-size-15 leading-none font-bold tracking-[0.3px] uppercase">Giảm 30 – 50%</span>
      <span className="mx-2 hidden opacity-60 sm:inline">•</span>
      <span className="hidden text-size-12 leading-none font-medium sm:inline">11/08 – 23/08</span>
    </div>
  );
}
