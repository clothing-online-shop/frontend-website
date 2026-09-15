import Image from "next/image";
import Link from "next/link";
import type { HeroBanner } from "@/lib/shared-types";

// Ảnh tĩnh cạnh slider chính ở trang chủ — không phải nội dung/khái niệm mới, chỉ tận dụng
// đúng ảnh của 1 banner đã có sẵn trong danh sách banner trang chủ (xem page.tsx chọn banner
// nào), không cần thêm field/API riêng.
export function SideBanner({ banner }: { banner: HeroBanner }) {
  const image = (
    <div className="relative aspect-4/5 w-full overflow-hidden sm:aspect-16/9 lg:aspect-auto lg:h-[420px]">
      <Image
        src={banner.imageUrl}
        alt=""
        fill
        sizes="(min-width: 1024px) 340px, 100vw"
        className="object-cover"
      />
    </div>
  );

  return banner.linkUrl ? (
    <Link href={banner.linkUrl} className="block">
      {image}
    </Link>
  ) : (
    image
  );
}
