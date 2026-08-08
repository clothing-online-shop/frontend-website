import { getCategoryTree } from "@/lib/categories-api";
import { getProducts } from "@/lib/products-api";
import { BannerSlider } from "@/components/home/BannerSlider";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { PromoPopup } from "@/components/home/PromoPopup";
import { HOME_BANNERS, FLASH_SALE_PRODUCTS, PROMO_POPUP } from "@/lib/home-mock";

const FEATURED_PRODUCTS_LIMIT = 8;

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategoryTree().catch(() => []),
    getProducts({ sort: "best_selling", limit: FEATURED_PRODUCTS_LIMIT })
      .then((result) => result.data)
      .catch(() => []),
  ]);

  return (
    <div>
      <BannerSlider banners={HOME_BANNERS} />
      <FeaturedProducts products={featuredProducts} />
      <FlashSaleSection products={FLASH_SALE_PRODUCTS} />
      <FeaturedCategories categories={categories} />
      <PromoPopup config={PROMO_POPUP} />
    </div>
  );
}
