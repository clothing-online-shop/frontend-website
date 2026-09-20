import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { STOCK_LABEL } from "@/lib/constants";

// inStock: còn/hết hàng của biến thể (size + màu) đang chọn — null khi chưa chọn được biến thể
// nào (không hiện badge). Sản phẩm chưa có đánh giá vẫn phải hiện được badge tồn kho, nên chỉ
// ẩn cả dòng khi không có gì để hiển thị.
export function ProductRatingRow({
  rating,
  inStock,
}: {
  rating: { average: number; count: number };
  inStock: boolean | null;
}) {
  if (rating.count === 0 && inStock === null) return null;

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
      {inStock !== null ? (
        <span
          className={cn(
            "font-semibold text-size-12 py-1 px-2.5",
            inStock ? "bg-order-done-bg text-order-done-fg" : "bg-order-cancel-bg text-order-cancel-fg",
          )}
        >
          {inStock ? STOCK_LABEL.inStock : STOCK_LABEL.outOfStock}
        </span>
      ) : null}
    </div>
  );
}
