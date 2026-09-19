import { getCategoryTree } from "@/lib/categories-api";
import { getProducts } from "@/lib/products-api";
import { getActiveBanners } from "@/lib/banners-api";
import { getActivePopup } from "@/lib/popups-api";
import { getActiveFlashSale } from "@/lib/flash-sales-api";
import { getLatestBlogPosts } from "@/lib/blog-api";
import { getActiveCollection } from "@/lib/collections-api";
import { BannerSlider } from "@/components/home/BannerSlider";
import { ServiceHighlights } from "@/components/home/ServiceHighlights";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { CollectionPromo } from "@/components/home/CollectionPromo";
import { BlogSection } from "@/components/home/BlogSection";
import { PromoPopup } from "@/components/home/PromoPopup";

const FEATURED_PRODUCTS_LIMIT = 8;

export default async function HomePage() {
  const [banners, categories, featuredProducts, popup, flashSale, blogPosts, collection] = await Promise.all([
    getActiveBanners().catch(() => []),
    getCategoryTree().catch(() => []),
    getProducts({ sort: "best_selling", limit: FEATURED_PRODUCTS_LIMIT })
      .then((result) => result.data)
      .catch(() => []),
    getActivePopup().catch(() => null),
    getActiveFlashSale().catch(() => null),
    getLatestBlogPosts().catch(() => []),
    getActiveCollection().catch(() => null),
  ]);

  return (
    <div>
      <BannerSlider banners={banners} />
      <ServiceHighlights />
      <FeaturedCategories categories={categories} />
      <FlashSaleSection flashSale={flashSale} />
      <FeaturedProducts products={featuredProducts} />
      <CollectionPromo collection={collection} />
      <BlogSection posts={blogPosts} />
      <PromoPopup popup={popup} />
    </div>
  );
}
