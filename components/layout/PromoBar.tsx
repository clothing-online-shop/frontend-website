import Link from "next/link";
import type { ActivePromoBar } from "@/lib/shared-types";
import { formatDayMonth } from "@/lib/format";

// Thanh khuyến mãi trên cùng — cấu hình ở CMS (backend-cms, module promo-bars), gọi qua
// getActivePromoBar() (Header.tsx). Không sticky — nằm ngoài phần header (xem Header.tsx)
// để cuộn trôi đi bình thường, không chiếm chỗ cố định cùng thanh điều hướng.
export function PromoBar({ promo }: { promo: ActivePromoBar | null }) {
  if (!promo) return null;

  return (
    <Link
      href={promo.linkUrl}
      className="block bg-primary px-4 py-3 text-center text-size-15 leading-none text-primary-foreground"
    >
      <span className="text-size-19 leading-none font-normal tracking-[0.76px] uppercase">
        {promo.label}
      </span>
      <span className="mx-2 opacity-60">•</span>
      <span className="text-size-15 leading-none font-bold tracking-[0.3px] uppercase">
        {promo.highlight}
      </span>
      <span className="mx-2 hidden opacity-60 sm:inline">•</span>
      <span className="hidden text-size-12 leading-none font-medium sm:inline">
        {formatDayMonth(promo.startDate)} – {formatDayMonth(promo.endDate)}
      </span>
    </Link>
  );
}
