import { Star } from "lucide-react";
import type { ProductReview } from "@/lib/shared-types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

// 2 ô vuông mock tĩnh — hệ thống chưa có field ảnh đính kèm review thật (model Review chỉ có
// rating/comment, chưa có flow gửi ảnh), theo yêu cầu người dùng: dùng placeholder cho đúng
// mật độ hiển thị của design, KHÔNG phải ảnh thật của khách. Hiện cho mọi review như nhau.
function MockReviewImages() {
  return (
    <div className="mt-3 flex gap-2">
      <div className="size-16 rounded-sm bg-secondary" />
      <div className="size-16 rounded-sm bg-secondary" />
    </div>
  );
}

export function ReviewItem({ review }: { review: ProductReview }) {
  return (
    <div className="border-b border-border py-5 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
            {review.reviewerName[0]?.toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-bold">{review.reviewerName}</p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3",
                    i < review.rating ? "fill-neutral-B46E00 text-neutral-B46E00" : "fill-none text-border",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {review.variantLabel ? `${review.variantLabel} · ` : ""}
          {formatDate(review.createdAt)}
        </span>
      </div>

      {review.comment ? <p className="mt-3 text-sm text-foreground/90">{review.comment}</p> : null}
      <MockReviewImages />
    </div>
  );
}
