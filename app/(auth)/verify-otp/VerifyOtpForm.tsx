"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyOtp, resendOtp } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const codeFromUrl = searchParams.get("code") ?? "";

  const [code, setCode] = useState(() => (codeFromUrl.length === 6 ? codeFromUrl : ""));
  const [cooldown, setCooldown] = useState(0);

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast.success("Xác thực email thành công. Vui lòng đăng nhập.");
      router.push("/login");
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      toast.success("Đã gửi lại mã OTP.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
  });

  // Link kích hoạt trong email điền sẵn ?code= — tự xác thực luôn khi vào trang từ link
  // đó, không bắt gõ tay lại mã đã có sẵn. Giá trị code khởi tạo trực tiếp từ URL ở
  // useState phía trên, effect này chỉ lo gọi API xác thực (không setState).
  useEffect(() => {
    if (email && codeFromUrl.length === 6) {
      verifyMutation.mutate({ email, code: codeFromUrl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!email) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          Thiếu thông tin email. Vui lòng quay lại trang đăng ký.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Xác thực email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Nhập mã 6 số vừa được gửi tới <strong>{email}</strong>. Mã có hiệu lực trong 5
          phút.
        </p>

        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {verifyMutation.isError && (
          <p className="text-center text-sm text-destructive">
            {getErrorMessage(verifyMutation.error)}
          </p>
        )}

        <Button
          className="w-full"
          disabled={code.length !== 6 || verifyMutation.isPending}
          onClick={() => verifyMutation.mutate({ email, code })}
        >
          {verifyMutation.isPending ? "Đang xác thực..." : "Xác thực"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={cooldown > 0 || resendMutation.isPending}
          onClick={() => resendMutation.mutate({ email })}
        >
          {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : "Gửi lại mã"}
        </Button>
      </CardContent>
    </Card>
  );
}
