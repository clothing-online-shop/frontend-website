import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCartState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <ShoppingBag className="size-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-bold">Giỏ hàng của bạn đang trống</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Hãy khám phá thêm sản phẩm và thêm vào giỏ hàng nhé.
      </p>
      <Button variant="dark" className="mt-6" nativeButton={false} render={<Link href="/san-pham" />}>
        Tiếp tục mua sắm
      </Button>
    </div>
  );
}
