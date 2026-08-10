import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";

export const metadata: Metadata = {
  title: "Sản phẩm | Clothing Shop",
  description:
    "Khám phá bộ sưu tập quần áo nam nữ mới nhất — áo, quần, váy đa dạng size và màu sắc.",
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageClient />
    </Suspense>
  );
}
