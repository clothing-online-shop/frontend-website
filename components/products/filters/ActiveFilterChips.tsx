import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilterChips({ chips }: { chips: Chip[] }) {
  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 border border-brand-38 bg-neutral-F6F2E7 px-3 py-1 text-xs text-foreground transition-colors hover:border-primary"
        >
          {chip.label}
          <X className="size-3" />
        </button>
      ))}
    </div>
  );
}

export function buildPriceChipLabel(min: number, max: number, priceMax: number): string | null {
  if (min <= 0 && max >= priceMax) return null;
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}
