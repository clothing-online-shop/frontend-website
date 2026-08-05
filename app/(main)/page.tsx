import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      {/* Mock tạm cho UAT — thay bằng banner/danh mục/sản phẩm nổi bật thật ở Sprint 2 */}
      <section className="bg-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Bộ sưu tập mới đã về
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Khám phá các sản phẩm thời trang mới nhất với giá ưu đãi trong mùa này.
          </p>
          <Link href="/products" className={buttonVariants({ size: "lg" })}>
            Mua sắm ngay
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted-foreground">
          Danh mục nổi bật và sản phẩm nổi bật sẽ hiển thị ở đây (Sprint 2).
        </p>
      </div>
    </div>
  );
}
