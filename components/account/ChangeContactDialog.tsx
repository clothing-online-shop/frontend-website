"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { getErrorMessage } from "@/lib/error";
import {
  confirmEmailChange,
  confirmPhoneChange,
  requestEmailChange,
  requestPhoneChange,
} from "@/lib/users-api";
import { useAuthStore } from "@/store/auth-store";

type ContactField = "phone" | "email";

interface ChangeContactDialogProps {
  field: ContactField | null;
  onOpenChange: (open: boolean) => void;
}

const FIELD_LABEL: Record<ContactField, string> = { phone: "số điện thoại", email: "email" };
// Khớp OTP_RESEND_COOLDOWN_SECONDS bên BE (common/otp/otp.service.ts) — chỉ để hẹn giờ hiện
// UI, BE vẫn tự chặn bằng cooldown key riêng nếu FE/BE lệch nhau (vd clock trôi).
const RESEND_COOLDOWN_SECONDS = 60;

// Đổi SĐT/Email thật phải qua OTP — khác các field khác trong ProfileForm (lưu thẳng qua
// PATCH /users/me), nên tách hẳn thành dialog 2 bước riêng: (1) nhập giá trị mới + mật khẩu
// hiện tại để xác thực → gửi OTP, (2) nhập mã 6 số xác nhận. `field` null = dialog đóng.
//
// Chỉ mount <ChangeContactForm> khi field khác null — nhờ vậy mỗi lần mở dialog là 1 lần
// mount MỚI, state (step/newValue/password/code) tự khởi tạo lại từ đầu tự nhiên theo vòng
// đời React, không cần useEffect để tự setState reset thủ công (dễ gây cascading render).
export function ChangeContactDialog({ field, onOpenChange }: ChangeContactDialogProps) {
  return (
    <Dialog open={field !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {field && <ChangeContactForm field={field} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

function ChangeContactForm({
  field,
  onOpenChange,
}: {
  field: ContactField;
  onOpenChange: (open: boolean) => void;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [newValue, setNewValue] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  // Đếm ngược cho phép "Gửi lại mã" — khớp cooldown 60s bên BE, tự chạy bằng setInterval nên
  // đặt trong effect là hợp lệ (subscribe đồng hồ ngoài), khác việc setState thẳng trong thân
  // effect ngay lần render đầu.
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const requestMutation = useMutation({
    mutationFn: () =>
      field === "phone"
        ? requestPhoneChange({ newPhone: newValue, currentPassword: password })
        : requestEmailChange({ newEmail: newValue, currentPassword: password }),
    onSuccess: (data) => {
      toast.success(data.message);
      setStep("confirm");
      setCode("");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () =>
      field === "phone"
        ? confirmPhoneChange({ newPhone: newValue, code })
        : confirmEmailChange({ newEmail: newValue, code }),
    onSuccess: (updated) => {
      setUser(updated);
      toast.success(`Đổi ${FIELD_LABEL[field]} thành công!`);
      onOpenChange(false);
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Đổi {FIELD_LABEL[field]}</DialogTitle>
        <DialogDescription>
          {step === "request" ? (
            `Nhập ${FIELD_LABEL[field]} mới và mật khẩu hiện tại để xác thực.`
          ) : (
            <>
              {field === "phone"
                ? "Chưa hỗ trợ gửi SMS — mã OTP đã được gửi tới email hiện tại của bạn."
                : `Nhập mã OTP 6 số vừa được gửi tới ${newValue}.`}{" "}
              Mã có hiệu lực trong 5 phút.
            </>
          )}
        </DialogDescription>
      </DialogHeader>

      {step === "request" ? (
        <div className="space-y-3">
          <div>
            <p className="text-size-12 font-medium text-muted-foreground">
              {field === "phone" ? "Số điện thoại mới" : "Email mới"}
            </p>
            <Input
              className="mt-1.5 h-11"
              type={field === "email" ? "email" : "text"}
              inputMode={field === "phone" ? "numeric" : undefined}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={field === "phone" ? "Nhập số điện thoại mới" : "Nhập email mới"}
              autoFocus
            />
          </div>
          <div>
            <p className="text-size-12 font-medium text-muted-foreground">Mật khẩu hiện tại</p>
            <Input
              className="mt-1.5 h-11"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại để xác thực"
            />
          </div>
          {requestMutation.isError && (
            <p className="text-size-12 text-destructive">{getErrorMessage(requestMutation.error)}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus>
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-11 w-10" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {confirmMutation.isError && (
            <p className="mt-3 text-center text-size-12 text-destructive">
              {getErrorMessage(confirmMutation.error)}
            </p>
          )}
          {/* Mã hết hạn (5 phút) hoặc gõ sai quá 5 lần thì BE hủy mã cũ — cần đường thoát để
              xin mã mới mà không phải bấm Hủy rồi mở lại từ đầu (gõ lại cả mật khẩu). */}
          <div className="mt-3 text-center">
            <button
              type="button"
              disabled={cooldown > 0 || requestMutation.isPending}
              onClick={() => requestMutation.mutate()}
              className="cursor-pointer text-size-12 text-brand-38 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : "Gửi lại mã"}
            </button>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="h-11.5"
          disabled={requestMutation.isPending || confirmMutation.isPending}
          onClick={() => onOpenChange(false)}
        >
          Hủy
        </Button>
        {step === "request" ? (
          <Button
            type="button"
            variant="dark"
            className="h-11.5"
            disabled={requestMutation.isPending || !newValue || !password}
            onClick={() => requestMutation.mutate()}
          >
            {requestMutation.isPending ? "Đang gửi..." : "Gửi mã OTP"}
          </Button>
        ) : (
          <Button
            type="button"
            variant="dark"
            className="h-11.5"
            disabled={confirmMutation.isPending || code.length !== 6}
            onClick={() => confirmMutation.mutate()}
          >
            {confirmMutation.isPending ? "Đang xác nhận..." : "Xác nhận"}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}
