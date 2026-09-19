import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { FilterSection } from "@/components/products/filters/FilterSection";
import { PRICE_FILTER_MAX } from "@/lib/constants";
import { formatThousands, parseDigits } from "@/lib/format";

const PRICE_STEP = 50_000;

// Ô nhập là text (không phải type="number") để hiện được dấu chấm ngăn cách hàng nghìn; gõ số
// mới thì bỏ ký tự lạ và kẹp trong [0, trần].
function clampPrice(text: string): number {
  return Math.min(parseDigits(text), PRICE_FILTER_MAX);
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onCommit,
}: {
  minPrice: number;
  maxPrice: number;
  onCommit: (min: number, max: number) => void;
}) {
  const [range, setRange] = useState<[number, number]>([minPrice, maxPrice]);
  // "Điều chỉnh state khi prop đổi" trong lúc render (khuyến nghị của React thay vì
  // useEffect) — reset state nội bộ khi filter bị đổi từ nơi khác (vd nút "Xóa tất cả").
  // searchParams là nguồn sự thật, state nội bộ chỉ để kéo slider/gõ input mượt trước khi
  // commit.
  const [committedRange, setCommittedRange] = useState<[number, number]>([minPrice, maxPrice]);
  if (minPrice !== committedRange[0] || maxPrice !== committedRange[1]) {
    setCommittedRange([minPrice, maxPrice]);
    setRange([minPrice, maxPrice]);
  }

  function commit(next: [number, number]) {
    const [next0, next1] = next[0] <= next[1] ? next : [next[1], next[0]];
    setRange([next0, next1]);
    onCommit(next0, next1);
  }

  return (
    <FilterSection title="Khoảng giá">
      <div className="px-1">
        <Slider
          value={range}
          min={0}
          max={PRICE_FILTER_MAX}
          step={PRICE_STEP}
          onValueChange={(value) => setRange(value as [number, number])}
          onValueCommitted={(value) => commit(value as [number, number])}
        />
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="text"
            inputMode="numeric"
            value={formatThousands(range[0])}
            onChange={(e) => setRange([clampPrice(e.target.value), range[1]])}
            onBlur={() => commit(range)}
            onKeyDown={(e) => e.key === "Enter" && commit(range)}
            className="h-9 text-center"
            aria-label="Giá thấp nhất"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="text"
            inputMode="numeric"
            value={formatThousands(range[1])}
            onChange={(e) => setRange([range[0], clampPrice(e.target.value)])}
            onBlur={() => commit(range)}
            onKeyDown={(e) => e.key === "Enter" && commit(range)}
            className="h-9 text-center"
            aria-label="Giá cao nhất"
          />
        </div>
      </div>
    </FilterSection>
  );
}
