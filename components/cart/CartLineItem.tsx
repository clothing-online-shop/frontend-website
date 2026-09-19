import Image from "next/image";
import Link from "next/link";
import type { UnifiedCartItem } from "@/hooks/useCart";
import { Checkbox } from "@/components/ui/checkbox";
import { ClampedText } from "@/components/common/ClampedText";
import { QuantityStepper } from "@/components/products/QuantityStepper";
import { LOW_STOCK_THRESHOLD, STOCK_LABEL } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function getStockStatusText(stockQuantity: number): string {
  if (stockQuantity <= 0) return STOCK_LABEL.outOfStock;
  if (stockQuantity <= LOW_STOCK_THRESHOLD) return `Còn ${stockQuantity} sản phẩm trong kho`;
  return STOCK_LABEL.inStock;
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
    <div className="flex flex-col gap-4 border-b border-border py-6 lg:flex-row">
      {/* Dưới lg: hàng 1 của layout xếp chồng. Từ lg: display:contents khiến wrapper này
          "biến mất" khỏi box model, 3 con trở thành item trực tiếp của flex-row ngoài —
          tái tạo đúng thứ tự/khoảng cách gốc, không cần viết lại layout desktop. */}
      <div className="flex gap-4 lg:contents">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-1"
          aria-label={`Chọn ${item.productName}`}
        />

        <div className="relative h-[106px] w-20 shrink-0 overflow-hidden bg-secondary sm:h-[142px] sm:w-[107px]">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.productName}
              fill
              sizes="107px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <ClampedText
            text={item.productName}
            render={<Link href={`/san-pham/${item.productSlug}`} />}
            className="line-clamp-2 wrap-break-word font-bold hover:underline"
          />
          <p className="text-sm text-muted-foreground">
            Màu {item.color} · Size {item.size}
          </p>
          <p className={cn("text-sm", outOfStock ? "text-destructive" : "text-muted-foreground")}>
            {getStockStatusText(item.stockQuantity)}
          </p>
          <div
            className={cn(
              "hidden items-center gap-4 lg:flex",
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
      </div>

      <div className="hidden shrink-0 text-right lg:block">
        <p className="font-bold">{formatPrice(item.lineTotal)}</p>
        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / cái</p>
      </div>

      {/* Hàng 2 dưới lg — controls trái, giá phải (khớp quan hệ không gian gốc desktop). */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 lg:hidden",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        <div className="flex items-center gap-4">
          <QuantityStepper value={item.quantity} onChange={onQuantityChange} max={item.stockQuantity} />
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-destructive"
          >
            Xóa
          </button>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold">{formatPrice(item.lineTotal)}</p>
          <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / cái</p>
        </div>
      </div>
    </div>
  );
}
