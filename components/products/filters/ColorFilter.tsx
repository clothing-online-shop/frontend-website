import { COLOR_SWATCHES } from "@/lib/color-swatches";
import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/products/filters/FilterSection";

export function ColorFilter({
  selectedColors,
  onToggle,
}: {
  selectedColors: string[];
  onToggle: (color: string) => void;
}) {
  return (
    <FilterSection title="Màu">
      <div className="flex flex-wrap gap-2.5">
        {Object.entries(COLOR_SWATCHES).map(([color, hex]) => (
          <button
            key={color}
            type="button"
            onClick={() => onToggle(color)}
            aria-label={color}
            aria-pressed={selectedColors.includes(color)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border-2 transition-colors",
              selectedColors.includes(color) ? "border-primary" : "border-transparent",
            )}
          >
            <span
              className="size-6 rounded-full border border-border"
              style={{ backgroundColor: hex }}
            />
          </button>
        ))}
      </div>
    </FilterSection>
  );
}
