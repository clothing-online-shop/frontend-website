import { Fragment } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { getProductBySlug, getProducts } from "@/lib/products-api";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfoHeader } from "@/components/products/ProductInfoHeader";
import { ProductVariantPicker } from "@/components/products/ProductVariantPicker";
import { ProductPolicyInfo } from "@/components/products/ProductPolicyInfo";
import { ProductTabs } from "@/components/products/ProductTabs";
import { ReviewSection } from "@/components/products/reviews/ReviewSection";
import { RecentlyViewedSection } from "@/components/products/RecentlyViewedSection";
import { RecordProductView } from "@/components/products/RecordProductView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { data } = await getProducts({ limit: 20, sort: "newest" });
    return data.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

async function fetchProduct(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Không tìm thấy sản phẩm | Clothing Shop" };
  }

  const description =
    product.description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
    `${product.name} - ${formatPrice(product.basePrice)}`;

  return {
    title: `${product.name} | Clothing Shop`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string }>;
}) {
  const { slug } = await params;
  const { color: initialColor } = await searchParams;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  const images = product.images.length > 0 ? product.images : product.thumbnail ? [product.thumbnail] : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.replace(/<[^>]+>/g, "") ?? undefined,
    image: images,
    sku: product.variants[0]?.sku,
    category: product.category.name,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: Math.min(...product.variants.map((v) => v.price), product.basePrice),
      highPrice: Math.max(...product.variants.map((v) => v.price), product.basePrice),
      offerCount: product.variants.length,
      availability:
        product.totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          {(product.category.ancestors ?? []).map((ancestor) => (
            <Fragment key={ancestor.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/danh-muc/${ancestor.slug}`}>
                  {ancestor.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/danh-muc/${product.category.slug}`}>
              {product.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />

        <div>
          <ProductInfoHeader product={product} />
          <div className="mt-6">
            <ProductVariantPicker product={product} initialColor={initialColor} />
          </div>

          <ProductPolicyInfo />
          <ProductTabs product={product} />
        </div>
      </div>

      {product.relatedProducts.length > 0 ? (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-6 font-heading text-2xl font-extrabold uppercase">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {product.relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}

      <ReviewSection reviews={product.reviews} summary={product.reviewSummary} />
      <RecentlyViewedSection excludeProductId={product.id} />
      <RecordProductView productId={product.id} />

      <div className="mt-10">
        <Link href="/san-pham" className="text-sm text-muted-foreground hover:text-foreground">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    </div>
  );
}
