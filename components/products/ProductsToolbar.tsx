import type { ProductSort } from "@/lib/shared-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];

export function ProductsToolbar({
  shownCount,
  total,
  isLoading,
  sort,
  onSortChange,
}: {
  shownCount: number;
  total: number;
  isLoading: boolean;
  sort: ProductSort;
  onSortChange: (value: string | null) => void;
}) {
  return (
    <div className="bg-white p-4 mb-6 flex items-center justify-between">
      {isLoading ? (
        <span />
      ) : (
        <p className="text-sm text-muted-foreground">
          Hiển thị 1–{shownCount} trên {total} sản phẩm
        </p>
      )}
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Sắp xếp">
            {(value: ProductSort) =>
              SORT_OPTIONS.find((option) => option.value === value)?.label ?? "Sắp xếp"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
