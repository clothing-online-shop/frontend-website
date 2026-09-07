import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { FilterSection } from "@/components/products/filters/FilterSection";

const PRICE_MAX = 2_000_000;
const PRICE_STEP = 50_000;

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
          max={PRICE_MAX}
          step={PRICE_STEP}
          onValueChange={(value) => setRange(value as [number, number])}
          onValueCommitted={(value) => commit(value as [number, number])}
        />
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            min={0}
            max={range[1]}
            value={range[0]}
            onChange={(e) => setRange([Number(e.target.value), range[1]])}
            onBlur={() => commit(range)}
            className="h-9 text-center"
            aria-label="Giá thấp nhất"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min={range[0]}
            max={PRICE_MAX}
            value={range[1]}
            onChange={(e) => setRange([range[0], Number(e.target.value)])}
            onBlur={() => commit(range)}
            className="h-9 text-center"
            aria-label="Giá cao nhất"
          />
        </div>
      </div>
    </FilterSection>
  );
}
