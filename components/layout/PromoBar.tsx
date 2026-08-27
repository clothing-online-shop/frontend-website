// Thanh khuyến mãi trên cùng — chưa có API chiến dịch/banner thật cho vị trí này (khác
// HOME_BANNERS ở lib/home-mock.ts, đó là banner slider riêng của trang chủ), nên nội dung
// tạm thời tĩnh để demo giao diện, giống cách NewsletterForm/Footer đang mock các phần
// chưa có backend. Không sticky — nằm ngoài phần header (xem Header.tsx) để cuộn trôi đi
// bình thường, không chiếm chỗ cố định cùng thanh điều hướng.
export function PromoBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
      <span className="font-heading font-bold tracking-wide uppercase">Thu 2026</span>
      <span className="mx-2 opacity-60">•</span>
      <span>Giảm 30 – 50%</span>
      <span className="mx-2 hidden opacity-60 sm:inline">•</span>
      <span className="hidden text-primary-foreground/80 sm:inline">11/08 – 23/08</span>
    </div>
  );
}
