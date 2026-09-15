import { getCategoryTree } from "@/lib/categories-api";
import { getProducts } from "@/lib/products-api";
import { getActiveBanners } from "@/lib/banners-api";
import { getActivePopup } from "@/lib/popups-api";
import { getActiveFlashSale } from "@/lib/flash-sales-api";
import { getLatestBlogPosts } from "@/lib/blog-api";
import { BannerSlider } from "@/components/home/BannerSlider";
import { SideBanner } from "@/components/home/SideBanner";
import { ServiceHighlights } from "@/components/home/ServiceHighlights";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { BlogSection } from "@/components/home/BlogSection";
import { PromoPopup } from "@/components/home/PromoPopup";

const FEATURED_PRODUCTS_LIMIT = 8;

export default async function HomePage() {
  const [banners, categories, featuredProducts, popup, flashSale, blogPosts] = await Promise.all([
    getActiveBanners().catch(() => []),
    getCategoryTree().catch(() => []),
    getProducts({ sort: "best_selling", limit: FEATURED_PRODUCTS_LIMIT })
      .then((result) => result.data)
      .catch(() => []),
    getActivePopup().catch(() => null),
    getActiveFlashSale().catch(() => null),
    getLatestBlogPosts().catch(() => []),
  ]);

  // Banner phụ (ảnh tĩnh cạnh slider) tận dụng thẳng 1 banner thật đã có trong danh sách —
  // không phải khái niệm/dữ liệu mới. Ưu tiên banner thứ 2 (banner đầu vẫn là banner nổi bật
  // nhất, để nguyên trong slider); tách khỏi slider để không hiện trùng lặp cùng lúc 2 chỗ.
  // Chỉ 1 banner thì không đủ để tách — bỏ qua banner phụ, slider vẫn chạy bình thường.
  const sideBanner = banners.length > 1 ? banners[1] : null;
  const sliderBanners = sideBanner ? banners.filter((b) => b.id !== sideBanner.id) : banners;

  return (
    <div>
      <div className="mx-auto max-w-full">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="lg:flex-1">
            <BannerSlider banners={sliderBanners} />
          </div>
          {sideBanner && (
            <div className="lg:w-[340px] lg:shrink-0">
              <SideBanner banner={sideBanner} />
            </div>
          )}
        </div>
      </div>
      <ServiceHighlights />
      <FeaturedCategories categories={categories} />
      <FlashSaleSection flashSale={flashSale} />
      <FeaturedProducts products={featuredProducts} />
      <BlogSection posts={blogPosts} />
      <PromoPopup popup={popup} />
    </div>
  );
}
