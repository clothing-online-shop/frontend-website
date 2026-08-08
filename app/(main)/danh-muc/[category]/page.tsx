import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategoryTree } from "@/lib/categories-api";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categories = await getCategoryTree().catch(() => []);
  const match = categories
    .flatMap((c) => [c, ...c.children])
    .find((c) => c.slug === category);

  return {
    title: match ? `${match.name} | Clothing Shop` : "Sản phẩm | Clothing Shop",
    description: match
      ? `Mua sắm ${match.name} — đa dạng size và màu sắc tại Clothing Shop.`
      : "Khám phá bộ sưu tập quần áo nam nữ mới nhất.",
  };
}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <Suspense>
      <ProductsPageClient category={category} />
    </Suspense>
  );
}
