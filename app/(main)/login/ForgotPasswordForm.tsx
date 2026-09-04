"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { AUTH_ERROR_BOX_CLASS, AUTH_INPUT_CLASS, AUTH_LABEL_CLASS, AUTH_SUBMIT_BUTTON_CLASS } from "./auth-field-styles";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ onLogin }: { onLogin: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div>
        <p className="text-sm text-[#4C4741]">
          Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng
          kiểm tra hộp thư (kể cả mục spam).
        </p>
        <button
          type="button"
          onClick={onLogin}
          className="mt-4 text-xs font-medium text-[#1E1A15] underline underline-offset-2"
        >
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
      <p className="mb-4 text-sm text-[#4C4741]">
        Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
      </p>

      <div>
        <label htmlFor="forgot-email" className={AUTH_LABEL_CLASS}>
          Email
        </label>
        <Input
          id="forgot-email"
          type="email"
          className={AUTH_INPUT_CLASS}
          placeholder="ban@email.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        className={`${AUTH_SUBMIT_BUTTON_CLASS} mt-4`}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Đang gửi..." : "Gửi hướng dẫn đặt lại mật khẩu"}
      </Button>

      {mutation.isError && <div className={AUTH_ERROR_BOX_CLASS}>{getErrorMessage(mutation.error)}</div>}

      <p className="text-xs text-[#4C4741]">
        Nhớ mật khẩu rồi?{" "}
        <button
          type="button"
          onClick={onLogin}
          className="font-medium text-[#1E1A15] underline underline-offset-2"
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
}
