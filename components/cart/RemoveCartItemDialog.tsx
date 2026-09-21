"use client";

import { Trash2 } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface RemoveCartItemDialogProps {
  productName: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

// `productName` null = đóng. Item cần xoá lưu ở parent (CartView) vì giỏ hàng có nhiều dòng.
// Layout theo mẫu LogoutConfirmDialog.tsx (card căn giữa, icon tròn + tiêu đề + 2 nút xếp dọc).
export function RemoveCartItemDialog({ productName, onOpenChange, onConfirm }: RemoveCartItemDialogProps) {
  return (
    <Dialog open={productName !== null} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 bg-white text-center sm:w-105">
          <div className="p-5 sm:p-6 lg:p-10">
            <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-neutral-E0DDDA">
              <div className="flex size-14 items-center justify-center rounded-full bg-brand-88 text-brand-38">
                <Trash2 className="size-6" />
              </div>
            </div>

            <div className="mt-4">
              <DialogPrimitive.Title className="font-heading text-size-26 font-normal text-brand-10">
                Xóa sản phẩm
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-3 text-size-14 text-neutral-68625C">
                Bạn có chắc chắn muốn xóa &quot;{productName}&quot; khỏi giỏ hàng?
              </DialogPrimitive.Description>
            </div>

            <div className="mt-4 lg:mt-8 flex flex-col gap-3">
              <Button
                type="button"
                variant="dark"
                className="h-12.5 text-size-14 text-white"
                onClick={onConfirm}
              >
                Xác nhận xóa
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12.5 text-size-14 text-brand-7"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
