"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order } from "@/lib/shared-types";
import { cancelOrder } from "@/lib/orders-api";
import { getErrorMessage } from "@/lib/error";
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

interface CancelOrderDialogProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

// Dialog xác nhận hủy đơn — cùng pattern với LogoutConfirmDialog (Dialog + 2 nút Hủy/Xác
// nhận). `order` null = đóng, khác đăng xuất (chỉ có 1 trigger duy nhất) ở đây danh sách có
// nhiều đơn nên cần biết ĐANG hủy đơn nào — OrdersPageClient tự quản lý state này.
export function CancelOrderDialog({ order, onOpenChange }: CancelOrderDialogProps) {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (orderCode: string) => cancelOrder(orderCode),
    onSuccess: () => {
      toast.success("Đã hủy đơn hàng.");
      // Chỉ có "my-orders" queryKey nằm ở đây — invalidate theo prefix để mọi tab (mọi
      // status filter khác nhau) đều tự refetch, không chỉ tab đang mở.
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <Dialog open={order !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Hủy đơn hàng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy đơn {order?.orderCode}? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button type="button" className="h-11.5" variant="ghost" disabled={cancelMutation.isPending} />}
          >
            Đóng
          </DialogClose>
          <Button
            type="button"
            variant="dark"
            disabled={cancelMutation.isPending}
            className="h-11.5"
            onClick={() => order && cancelMutation.mutate(order.orderCode)}
          >
            {cancelMutation.isPending ? "Đang hủy..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
