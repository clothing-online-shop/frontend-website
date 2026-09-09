import { useQuery } from "@tanstack/react-query";
import { getColors } from "@/lib/colors-api";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/products/filters/FilterSection";

export function ColorFilter({
  selectedColors,
  onToggle,
}: {
  selectedColors: string[];
  onToggle: (color: string) => void;
}) {
  // GET /colors chỉ trả màu đang có ít nhất 1 sản phẩm ACTIVE (xem backend-user
  // ColorsService.findAllForStorefront) — khớp lý do BrandFilter.tsx dùng /brands thay vì
  // 1 danh sách brand cứng: bộ lọc chỉ nên hiện lựa chọn thực sự lọc ra được sản phẩm.
  const { data: colors } = useQuery({ queryKey: ["colors"], queryFn: getColors });

  if (!colors || colors.length === 0) return null;

  return (
    <FilterSection title="Màu">
      <div className="flex flex-wrap gap-1.5">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onToggle(color.name)}
            aria-label={color.name}
            aria-pressed={selectedColors.includes(color.name)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border-2 transition-colors",
              selectedColors.includes(color.name) ? "border-primary" : "border-transparent",
            )}
          >
            <span
              className="size-6 rounded-full border border-border"
              style={{ backgroundColor: color.hexCode }}
            />
          </button>
        ))}
      </div>
    </FilterSection>
  );
}
