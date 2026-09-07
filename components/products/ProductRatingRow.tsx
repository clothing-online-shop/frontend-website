import { Star } from "lucide-react";
import type { ReviewSummary } from "@/lib/shared-types";
import { cn } from "@/lib/utils";

export function ProductRatingRow({
  summary,
  soldCount,
}: {
  summary: ReviewSummary;
  soldCount: number;
}) {
  if (summary.count === 0 && soldCount === 0) return null;

  return (
    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
      {summary.count > 0 ? (
        <span className="flex items-center gap-1">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < Math.round(summary.average)
                    ? "fill-primary text-primary"
                    : "fill-none text-border",
                )}
              />
            ))}
          </span>
          <span className="font-medium text-foreground">{summary.average}</span>
          <span>· {summary.count} đánh giá</span>
        </span>
      ) : null}
      {summary.count > 0 && soldCount > 0 ? <span className="text-border">|</span> : null}
      {soldCount > 0 ? <span>Đã bán {soldCount.toLocaleString("vi-VN")}</span> : null}
    </div>
  );
}
