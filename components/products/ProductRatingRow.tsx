import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// rating = displayRating (product) — đã cộng dồn "đánh giá ảo" admin nhập ở CMS với đánh
// giá thật, xem lib/shared-types.ts. Không nhận nguyên ReviewSummary (có breakdown) vì dòng
// này không hiện breakdown, tránh hiểu nhầm đây là số liệu breakdown-consistent.
export function ProductRatingRow({
  rating,
  soldCount,
}: {
  rating: { average: number; count: number };
  soldCount: number;
}) {
  if (rating.count === 0 && soldCount === 0) return null;

  return (
    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
      {rating.count > 0 ? (
        <span className="flex items-center gap-1">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < Math.round(rating.average)
                    ? "fill-neutral-B46E00 text-neutral-B46E00"
                    : "fill-none text-border",
                )}
              />
            ))}
          </span>
          <span className="font-medium text-foreground">{rating.average}</span>
          <span>· {rating.count} đánh giá</span>
        </span>
      ) : null}
      {rating.count > 0 && soldCount > 0 ? <span className="text-border">|</span> : null}
      {soldCount > 0 ? <span>Đã bán {soldCount.toLocaleString("vi-VN")}</span> : null}
    </div>
  );
}
