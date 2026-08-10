// Mock data cho các block trang chủ chưa có API thật (banner, flash sale, popup) —
// dùng để demo giao diện cho khách trước khi có CMS quản lý các nội dung này.

export interface HomeBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  ctaLabel: string;
}

export const HOME_BANNERS: HomeBanner[] = [
  {
    id: "banner-1",
    title: "Bộ sưu tập Thu Đông 2026",
    description: "Item len, dạ, khoác dày ấm áp cho mùa lạnh",
    imageUrl: "https://picsum.photos/seed/banner-autumn/1600/700",
    linkUrl: "/danh-muc/ao-khoac",
    ctaLabel: "Mua ngay",
  },
  {
    id: "banner-2",
    title: "Sale cuối tuần đến 50%",
    description: "Áp dụng toàn bộ sản phẩm nữ, số lượng có hạn",
    imageUrl: "https://picsum.photos/seed/banner-sale/1600/700",
    linkUrl: "/san-pham",
    ctaLabel: "Săn sale ngay",
  },
  {
    id: "banner-3",
    title: "Hàng mới về mỗi tuần",
    description: "Cập nhật xu hướng thời trang mới nhất",
    imageUrl: "https://picsum.photos/seed/banner-newin/1600/700",
    linkUrl: "/san-pham?sort=newest",
    ctaLabel: "Khám phá ngay",
  },
];

export interface MockFlashSaleProduct {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  basePrice: number;
  salePrice: number;
  soldPercent: number;
  colors: string[];
}

export const FLASH_SALE_PRODUCTS: MockFlashSaleProduct[] = [
  {
    id: "fs-1",
    name: "Áo thun cotton basic",
    slug: "ao-thun-cotton-basic",
    thumbnail: "https://picsum.photos/seed/fs-1/600/800",
    basePrice: 259000,
    salePrice: 129000,
    soldPercent: 72,
    colors: ["#1a1a1a", "#ffffff", "#8a97a8"],
  },
  {
    id: "fs-2",
    name: "Quần jean slim fit",
    slug: "quan-jean-slim-fit",
    thumbnail: "https://picsum.photos/seed/fs-2/600/800",
    basePrice: 599000,
    salePrice: 359000,
    soldPercent: 45,
    colors: ["#3b5fa0", "#1a1a1a"],
  },
  {
    id: "fs-3",
    name: "Váy midi hoa nhí",
    slug: "vay-midi-hoa-nhi",
    thumbnail: "https://picsum.photos/seed/fs-3/600/800",
    basePrice: 459000,
    salePrice: 275000,
    soldPercent: 88,
    colors: ["#e0342b", "#f2c9c5"],
  },
  {
    id: "fs-4",
    name: "Áo sơ mi linen",
    slug: "ao-so-mi-linen",
    thumbnail: "https://picsum.photos/seed/fs-4/600/800",
    basePrice: 399000,
    salePrice: 239000,
    soldPercent: 30,
    colors: ["#f5f0e6", "#c9a876", "#1a1a1a"],
  },
  {
    id: "fs-5",
    name: "Chân váy xếp ly",
    slug: "chan-vay-xep-ly",
    thumbnail: "https://picsum.photos/seed/fs-5/600/800",
    basePrice: 349000,
    salePrice: 199000,
    soldPercent: 60,
    colors: ["#1a1a1a", "#c9a876"],
  },
  {
    id: "fs-6",
    name: "Áo khoác bomber",
    slug: "ao-khoac-bomber",
    thumbnail: "https://picsum.photos/seed/fs-6/600/800",
    basePrice: 799000,
    salePrice: 479000,
    soldPercent: 20,
    colors: ["#1a1a1a", "#3b5fa0", "#6b6b70"],
  },
];

export interface MockFeaturedCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export const FEATURED_CATEGORY_FALLBACK_IMAGE = (seed: string) =>
  `https://picsum.photos/seed/cat-${seed}/400/400`;

export interface PromoPopupConfig {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

export const PROMO_POPUP: PromoPopupConfig = {
  title: "Ưu đãi thành viên mới",
  description: "Nhập mã WELCOME10 để được giảm 10% cho đơn hàng đầu tiên",
  imageUrl: "https://picsum.photos/seed/promo-popup/900/1100",
  linkUrl: "/san-pham",
};
