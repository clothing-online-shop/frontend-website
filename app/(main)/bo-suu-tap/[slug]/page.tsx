import type { Metadata } from "next";
import { Suspense } from "react";
import { getCollectionBySlug } from "@/lib/collections-api";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug).catch(() => null);

  return {
    title: collection ? `${collection.name} | Clothing Shop` : "Bộ sưu tập | Clothing Shop",
    description: collection?.description ?? "Khám phá các bộ sưu tập nổi bật tại Clothing Shop.",
  };
}

export default async function CollectionProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense>
      <ProductsPageClient collection={slug} />
    </Suspense>
  );
}
