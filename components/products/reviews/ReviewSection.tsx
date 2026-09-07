import type { ProductReview, ReviewSummary } from "@/lib/shared-types";
import { ReviewSummaryCard } from "@/components/products/reviews/ReviewSummaryCard";
import { ReviewItem } from "@/components/products/reviews/ReviewItem";

export function ReviewSection({
  reviews,
  summary,
}: {
  reviews: ProductReview[];
  summary: ReviewSummary;
}) {
  if (summary.count === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 font-heading text-2xl font-extrabold uppercase">
        Đánh giá từ khách đã mua
      </h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
        <ReviewSummaryCard summary={summary} />
        <div>
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
