import { Star } from "lucide-react";
import type { ReviewSummary } from "@/lib/shared-types";
import { cn } from "@/lib/utils";

export function ReviewSummaryCard({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="border border-border p-6 bg-white h-[300px]">
      <p className="font-heading text-4xl font-extrabold">{summary.average}</p>
      <div className="mt-2 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < Math.round(summary.average) ? "fill-primary text-primary" : "fill-none text-border",
            )}
          />
        ))}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{summary.count} đánh giá</p>

      <div className="mt-5 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const starCount = summary.breakdown[star] ?? 0;
          const percent = summary.count > 0 ? (starCount / summary.count) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-4">{star}★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </span>
              <span className="w-6 text-right">{starCount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
