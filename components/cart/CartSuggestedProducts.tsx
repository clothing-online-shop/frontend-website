"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/products-api";
import { getColors } from "@/lib/colors-api";
import { ProductCard } from "@/components/products/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Lấy nhiều hơn số hiện cùng lúc (5 ở desktop) để còn cuộn tiếp — chưa có gợi ý ý cá nhân hoá
// thật (cần dữ liệu hành vi mua/xem), tạm dùng chung nguồn "bán chạy" giống trang chủ
// (FeaturedProducts) thay vì bịa dữ liệu riêng cho trang giỏ hàng.
const SUGGESTION_LIMIT = 10;

export function CartSuggestedProducts({ excludeProductIds }: { excludeProductIds: string[] }) {
  const productsQuery = useQuery({
    queryKey: ["products", { sort: "best_selling", limit: SUGGESTION_LIMIT }],
    queryFn: () => getProducts({ sort: "best_selling", limit: SUGGESTION_LIMIT }),
  });
  const colorsQuery = useQuery({ queryKey: ["colors"], queryFn: getColors });
  const colorHexMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of colorsQuery.data ?? []) map[c.name] = c.hexCode;
    return map;
  }, [colorsQuery.data]);

  const excluded = new Set(excludeProductIds);
  const products = (productsQuery.data?.data ?? []).filter((product) => !excluded.has(product.id));

  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-heading text-size-30 font-normal">Gợi ý dành cho bạn</h2>
        <Link href="/san-pham?sort=best_selling" className="text-sm font-bold text-primary hover:underline">
          Xem thêm →
        </Link>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              <ProductCard product={product} colorHexMap={colorHexMap} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  );
}
