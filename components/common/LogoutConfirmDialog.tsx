"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLogout } from "@/hooks/useLogout";
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

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Dialog xác nhận trước khi đăng xuất thật — dùng chung cho mọi nơi có nút "Đăng xuất"
// (Header, AccountSidebar...) để đồng bộ hành vi, tránh bấm nhầm mất phiên đăng nhập.
// Chỉ chứa UI dialog; nơi gọi tự quản lý state open (nút trigger có thể khác nhau ở mỗi
// chỗ — icon-only, text-only... nên không gộp luôn trigger vào đây).
export function LogoutConfirmDialog({ open, onOpenChange }: LogoutConfirmDialogProps) {
  const logout = useLogout();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleConfirm() {
    setLoggingOut(true);
    try {
      // logout() tự điều hướng sang /login khi xong — không cần tự đóng dialog/reset state
      // ở đây, chuyển trang sẽ unmount toàn bộ cây component chứa dialog này.
      await logout();
    } catch {
      // Hiện tại useLogout() tự nuốt lỗi gọi API (logoutApi(...).catch(() => undefined)) nên
      // nhánh này gần như không bao giờ chạy — nhưng vẫn cần có, không thì nếu sau này đổi
      // hành vi đó (để lỗi lộ ra thật), nút sẽ kẹt mãi ở "Đang đăng xuất..." không cách nào
      // thoát ra, không báo gì cho người dùng biết.
      toast.error("Đăng xuất thất bại, vui lòng thử lại.");
      setLoggingOut(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Đăng xuất</DialogTitle>
          <DialogDescription>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" className="h-11.5" variant="ghost" disabled={loggingOut} />}>Hủy</DialogClose>
          <Button
            type="button"
            variant="dark"
            disabled={loggingOut}
            className={"h-11.5"}
            onClick={handleConfirm}
          >
            {loggingOut ? "Đang đăng xuất..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
