import Image from "next/image";
import Link from "next/link";
import type { UnifiedCartItem } from "@/hooks/useCart";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityStepper } from "@/components/products/QuantityStepper";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function getStockStatusText(stockQuantity: number): string {
  if (stockQuantity <= 0) return "Hết hàng";
  if (stockQuantity <= LOW_STOCK_THRESHOLD) return `Còn ${stockQuantity} sản phẩm trong kho`;
  return "Còn hàng";
}

export function CartLineItem({
  item,
  checked,
  onCheckedChange,
  onQuantityChange,
  onRemove,
  isPending,
}: {
  item: UnifiedCartItem;
  checked: boolean;
  onCheckedChange: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  isPending: boolean;
}) {
  const outOfStock = item.stockQuantity <= 0;

  return (
    <div className="flex gap-4 border-b border-border py-6">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1"
        aria-label={`Chọn ${item.productName}`}
      />

      <div className="relative size-24 shrink-0 overflow-hidden border border-border bg-secondary">
        {item.thumbnail ? (
          <Image src={item.thumbnail} alt={item.productName} fill sizes="96px" className="object-cover" />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Link href={`/san-pham/${item.productSlug}`} className="font-bold hover:underline">
          {item.productName}
        </Link>
        <p className="text-sm text-muted-foreground">
          Màu {item.color} · Size {item.size}
        </p>
        <p className={cn("text-sm", outOfStock ? "text-destructive" : "text-muted-foreground")}>
          {getStockStatusText(item.stockQuantity)}
        </p>
        <div
          className={cn(
            "flex items-center gap-4",
            isPending && "pointer-events-none opacity-60",
          )}
        >
          <QuantityStepper value={item.quantity} onChange={onQuantityChange} max={item.stockQuantity} />
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-destructive"
          >
            Xóa
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-bold">{formatPrice(item.lineTotal)}</p>
        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / cái</p>
      </div>
    </div>
  );
}
