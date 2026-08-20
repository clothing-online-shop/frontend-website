import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { Minus, PackageCheck, Plus, Truck, Wallet } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/products-api";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductVariantPicker } from "@/components/products/ProductVariantPicker";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 60;

const POLICIES = [
  {
    icon: Wallet,
    title: "Thanh toán khi nhận hàng (COD)",
    description: "Giao hàng toàn quốc.",
  },
  {
    icon: Truck,
    title: "Miễn phí giao hàng",
    description: "Với đơn hàng từ 499.000 đ.",
  },
  {
    icon: PackageCheck,
    title: "Đổi trả miễn phí",
    description: "Trong 30 ngày kể từ ngày mua.",
  },
];

function AccordionSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-border py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <Plus className="size-4 text-muted-foreground group-open:hidden" />
        <Minus className="hidden size-4 text-muted-foreground group-open:block" />
      </summary>
      <div className="mt-3 text-sm text-foreground/90">{children}</div>
    </details>
  );
}

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
            <BreadcrumbItem key={ancestor.id}>
              <BreadcrumbSeparator />
              <BreadcrumbLink href={`/danh-muc/${ancestor.slug}`}>
                {ancestor.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
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
          <h1 className="font-heading text-2xl font-extrabold">{product.name}</h1>
          <div className="mt-6">
            <ProductVariantPicker product={product} initialColor={initialColor} />
          </div>

          <div className="mt-10 border-t border-border">
            {product.description ? (
              <AccordionSection title="Mô tả sản phẩm" defaultOpen>
                <div
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </AccordionSection>
            ) : null}
            {product.material ? (
              <AccordionSection title="Chất liệu">
                <p>{product.material}</p>
              </AccordionSection>
            ) : null}
            {product.careInstructions ? (
              <AccordionSection title="Hướng dẫn sử dụng">
                <p>{product.careInstructions}</p>
              </AccordionSection>
            ) : null}
          </div>

          <div className="mt-8 space-y-4">
            {POLICIES.map((policy) => (
              <div key={policy.title} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-secondary">
                  <policy.icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{policy.title}</p>
                  <p className="text-xs text-muted-foreground">{policy.description}</p>
                </div>
              </div>
            ))}
          </div>
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

      <div className="mt-10">
        <Link href="/san-pham" className="text-sm text-muted-foreground hover:text-foreground">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    </div>
  );
}
