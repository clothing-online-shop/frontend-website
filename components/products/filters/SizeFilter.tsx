import { cn } from "@/lib/utils";
import { FilterSection } from "@/components/products/filters/FilterSection";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export function SizeFilter({
  selectedSizes,
  onToggle,
}: {
  selectedSizes: string[];
  onToggle: (size: string) => void;
}) {
  return (
    <FilterSection title="Size">
      <div className="flex flex-wrap gap-1.5">
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onToggle(size)}
            aria-pressed={selectedSizes.includes(size)}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-none border px-2.5 text-sm font-medium transition-colors",
              selectedSizes.includes(size)
                ? "border-brand-10 bg-brand-10 text-white"
                : "border-border hover:border-brand-10",
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </FilterSection>
  );
}
