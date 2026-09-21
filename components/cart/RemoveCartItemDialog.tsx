"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RemoveCartItemDialogProps {
  productName: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

// `productName` null = đóng. Item cần xoá lưu ở parent (CartView) vì giỏ hàng có nhiều dòng.
export function RemoveCartItemDialog({ productName, onOpenChange, onConfirm }: RemoveCartItemDialogProps) {
  return (
    <Dialog open={productName !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xóa sản phẩm</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa &quot;{productName}&quot; khỏi giỏ hàng?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" className="h-11.5" variant="ghost" />}>
            Đóng
          </DialogClose>
          <Button type="button" variant="dark" className="h-11.5" onClick={onConfirm}>
            Xác nhận xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
