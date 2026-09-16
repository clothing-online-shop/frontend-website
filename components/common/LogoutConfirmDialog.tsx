"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { formatPhoneDisplay } from "@/lib/format";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
}: LogoutConfirmDialogProps) {
  const logout = useLogout();
  const user = useAuthStore((state) => state.user);
  const [loggingOut, setLoggingOut] = useState(false);
  const loginIdentifier = user?.phone ? formatPhoneDisplay(user.phone) : user?.email;

  async function handleConfirm() {
    setLoggingOut(true);
    try {
      // logout() tự điều hướng sang /login khi xong — không cần tự đóng dialog/reset state
      // ở đây, chuyển trang sẽ unmount toàn bộ cây component chứa dialog này.
      await logout();
    } catch {
      toast.error("Đăng xuất thất bại, vui lòng thử lại.");
      setLoggingOut(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 bg-white text-center sm:w-105">
          <div className="p-5 sm:p-6 lg:p-10">
            <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-neutral-E0DDDA">
              <div className="flex size-14 items-center justify-center rounded-full bg-brand-88 text-size-18 font-semibold text-brand-38">
                {user ? getInitials(user.fullName) : null}
              </div>
            </div>

            <div className="mt-4">
              <DialogPrimitive.Title className="font-heading text-size-26 font-normal text-brand-10">
                Đăng xuất khỏi tài khoản?
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-3 text-size-14 text-neutral-68625C">
                Giỏ hàng và sản phẩm yêu thích vẫn được giữ lại. Bạn cần đăng
                nhập lại để xem đơn hàng và điểm tích lũy.
              </DialogPrimitive.Description>
            </div>

            <div className="mt-4 lg:mt-8 flex flex-col gap-3">
              <Button
                type="button"
                variant="dark"
                disabled={loggingOut}
                className="h-12.5 text-size-14 text-white"
                onClick={handleConfirm}
              >
                {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12.5 text-size-14 text-brand-7"
                disabled={loggingOut}
                onClick={() => onOpenChange(false)}
              >
                Ở lại trang này
              </Button>
            </div>
          </div>

          {loginIdentifier ? (
            <p className="border-t border-t-neutral-E0DDDA flex justify-center items-center text-size-13 text-neutral-68625C h-13">
              Đăng nhập bằng
              <span className="font-semibold text-brand-10 ml-1">{loginIdentifier}</span>
            </p>
          ) : null}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
