import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  function clamp(next: number): number {
    if (max !== undefined) return Math.min(Math.max(next, min), max);
    return Math.max(next, min);
  }

  return (
    <div className="flex h-11 items-center border border-border">
      <button
        type="button"
        aria-label="Giảm số lượng"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-full w-10 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="flex h-full w-10 items-center justify-center border-x border-border text-sm font-medium">
        {value}
      </span>
      <button
        type="button"
        aria-label="Tăng số lượng"
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-full w-10 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
