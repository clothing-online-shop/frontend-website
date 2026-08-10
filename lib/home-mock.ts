// Mock data cho các block trang chủ chưa có API thật (banner, flash sale, popup) —
// dùng để demo giao diện cho khách trước khi có CMS quản lý các nội dung này.

export interface HomeBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
}

// Ảnh banner đã có sẵn tiêu đề/nút CTA thiết kế ngay trong ảnh (xem BannerSlider) —
// title ở đây chỉ dùng làm alt/aria-label, không render đè chữ lên ảnh nữa.
export const HOME_BANNERS: HomeBanner[] = [
  {
    id: "banner-1",
    title: "Trạm Hè Đa Sắc — Together Station",
    imageUrl: "/image/banner_1.webp",
    linkUrl: "/san-pham",
  },
  {
    id: "banner-2",
    title: "Back To School",
    imageUrl: "/image/banner_2.webp",
    linkUrl: "/san-pham",
  },
  {
    id: "banner-3",
    title: "Happy Week — Ưu đãi tới 50%",
    imageUrl: "/image/banner_3.webp",
    linkUrl: "/san-pham",
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
    thumbnail: "https://loremflickr.com/600/800/tshirt,fashion?lock=101",
    basePrice: 259000,
    salePrice: 129000,
    soldPercent: 72,
    colors: ["#1a1a1a", "#ffffff", "#8a97a8"],
  },
  {
    id: "fs-2",
    name: "Quần jean slim fit",
    slug: "quan-jean-slim-fit",
    thumbnail: "https://loremflickr.com/600/800/jeans,fashion?lock=102",
    basePrice: 599000,
    salePrice: 359000,
    soldPercent: 45,
    colors: ["#3b5fa0", "#1a1a1a"],
  },
  {
    id: "fs-3",
    name: "Váy midi hoa nhí",
    slug: "vay-midi-hoa-nhi",
    thumbnail: "https://loremflickr.com/600/800/dress,floral?lock=103",
    basePrice: 459000,
    salePrice: 275000,
    soldPercent: 88,
    colors: ["#e0342b", "#f2c9c5"],
  },
  {
    id: "fs-4",
    name: "Áo sơ mi linen",
    slug: "ao-so-mi-linen",
    thumbnail: "https://loremflickr.com/600/800/shirt,linen?lock=104",
    basePrice: 399000,
    salePrice: 239000,
    soldPercent: 30,
    colors: ["#f5f0e6", "#c9a876", "#1a1a1a"],
  },
  {
    id: "fs-5",
    name: "Chân váy xếp ly",
    slug: "chan-vay-xep-ly",
    thumbnail: "https://loremflickr.com/600/800/skirt,fashion?lock=105",
    basePrice: 349000,
    salePrice: 199000,
    soldPercent: 60,
    colors: ["#1a1a1a", "#c9a876"],
  },
  {
    id: "fs-6",
    name: "Áo khoác bomber",
    slug: "ao-khoac-bomber",
    thumbnail: "https://loremflickr.com/600/800/jacket,bomber?lock=106",
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

// Suy ra từ khoá thời trang theo slug danh mục (nu/nam) để loremflickr trả ảnh liên quan
// thay vì random hoàn toàn — lock là số ổn định suy từ slug để cùng 1 danh mục luôn ra
// cùng 1 ảnh (không đổi mỗi lần render).
function slugToLock(slug: string): number {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  return hash;
}

export const FEATURED_CATEGORY_FALLBACK_IMAGE = (slug: string) => {
  const keyword = slug.includes("nu") ? "women,fashion" : slug.includes("nam") ? "men,fashion" : "fashion,clothing";
  return `https://loremflickr.com/400/400/${keyword}?lock=${slugToLock(slug)}`;
};

export interface PromoPopupConfig {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

export const PROMO_POPUP: PromoPopupConfig = {
  title: "Ưu đãi thành viên mới",
  description: "Nhập mã WELCOME10 để được giảm 10% cho đơn hàng đầu tiên",
  imageUrl: "https://loremflickr.com/900/1100/fashion,sale?lock=201",
  linkUrl: "/san-pham",
};
