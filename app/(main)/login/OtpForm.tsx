"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyOtp, resendOtp } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import {
  AUTH_ERROR_BOX_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_SECONDARY_BUTTON_CLASS,
  AUTH_SUBMIT_BUTTON_CLASS,
} from "./auth-field-styles";

const RESEND_COOLDOWN_SECONDS = 60;

// Tab OTP có 2 lối vào: (1) tự chuyển tới từ tab Đăng ký, đã biết sẵn email (initialEmail) —
// hoặc (2) người dùng bấm thẳng tab OTP / theo link kích hoạt trong email (initialEmail +
// initialCode điền sẵn từ query string do trang /verify-otp cũ redirect sang). Vì vậy email
// vẫn để người dùng sửa được thay vì khoá cứng theo props.
export function OtpForm({
  initialEmail,
  initialCode,
  onVerified,
}: {
  initialEmail: string;
  initialCode: string;
  onVerified: () => void;
}) {
  // Không sync `email` từ prop bằng useEffect (set-state-in-effect, dễ vòng render thừa) —
  // LoginTabs remount component này bằng `key={otpEmail}` mỗi khi email đổi (ví dụ sau khi
  // đăng ký xong), nên state khởi tạo 1 lần từ initialEmail là đủ.
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(() => (initialCode.length === 6 ? initialCode : ""));
  const [cooldown, setCooldown] = useState(0);

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast.success("Xác thực email thành công. Vui lòng đăng nhập.");
      onVerified();
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      toast.success("Đã gửi lại mã OTP.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
  });

  // Link kích hoạt trong email điền sẵn ?code= — tự xác thực luôn khi vào tab từ link đó,
  // không bắt gõ tay lại mã đã có sẵn. Chỉ chạy 1 lần lúc mount với giá trị initial.
  useEffect(() => {
    if (initialEmail && initialCode.length === 6) {
      verifyMutation.mutate({ email: initialEmail, code: initialCode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div>
      <div>
        <label htmlFor="otp-email" className={AUTH_LABEL_CLASS}>
          Email đã đăng ký
        </label>
        <Input
          id="otp-email"
          type="email"
          className={AUTH_INPUT_CLASS}
          placeholder="ban@email.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="my-4">
        <label className={AUTH_LABEL_CLASS}>Mã xác thực (6 số)</label>
        <div className="mt-[6px] flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-11 w-10" />
              <InputOTPSlot index={1} className="h-11 w-10" />
              <InputOTPSlot index={2} className="h-11 w-10" />
              <InputOTPSlot index={3} className="h-11 w-10" />
              <InputOTPSlot index={4} className="h-11 w-10" />
              <InputOTPSlot index={5} className="h-11 w-10" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        className={AUTH_SUBMIT_BUTTON_CLASS}
        disabled={!email || code.length !== 6 || verifyMutation.isPending}
        onClick={() => verifyMutation.mutate({ email, code })}
      >
        {verifyMutation.isPending ? "Đang xác thực..." : "Xác thực"}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className={AUTH_SECONDARY_BUTTON_CLASS}
        disabled={!email || cooldown > 0 || resendMutation.isPending}
        onClick={() => resendMutation.mutate({ email })}
      >
        {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : "Gửi lại mã"}
      </Button>

      {(verifyMutation.isError || resendMutation.isError) && (
        <div className={`${AUTH_ERROR_BOX_CLASS} mt-4`}>
          {getErrorMessage(verifyMutation.error ?? resendMutation.error)}
        </div>
      )}
    </div>
  );
}
