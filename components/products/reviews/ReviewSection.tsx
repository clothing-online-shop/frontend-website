import type { ProductReview, ReviewSummary } from "@/lib/shared-types";
import { getMockReviewsForProduct } from "@/components/products/reviews/mock-reviews";
import { ReviewSummaryCard } from "@/components/products/reviews/ReviewSummaryCard";
import { ReviewItem } from "@/components/products/reviews/ReviewItem";

export function ReviewSection({
  productId,
  reviews,
  summary,
}: {
  productId: string;
  reviews: ProductReview[];
  summary: ReviewSummary;
}) {
  // Sản phẩm chưa có review thật (seed hiện tại luôn = 0) -> thay bằng bộ mock cố định theo
  // productId thay vì ẩn hẳn section. Có review thật thì luôn dùng review thật, không bao giờ
  // trộn 2 nguồn (giữ summary khớp đúng danh sách hiển thị).
  const { reviews: displayReviews, summary: displaySummary } =
    summary.count > 0 ? { reviews, summary } : getMockReviewsForProduct(productId);

  if (displaySummary.count === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 font-heading text-2xl font-extrabold uppercase">
        Đánh giá từ khách đã mua
      </h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
        <ReviewSummaryCard summary={displaySummary} />
        <div className="flex flex-col gap-4">
          {displayReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
