"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/auth-api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
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

  return (
    <>
      <h1 className="font-heading text-2xl font-extrabold uppercase">Quên mật khẩu</h1>

      {submitted ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui
          lòng kiểm tra hộp thư (kể cả mục spam).
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="space-y-1">
              <Input className="h-11" placeholder="Email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-bold uppercase"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Đang gửi..." : "Gửi hướng dẫn đặt lại mật khẩu"}
            </Button>
          </form>
        </>
      )}

      <p className="mt-6 text-sm">
        <Link href="/login" className="font-medium underline underline-offset-2">
          Quay lại đăng nhập
        </Link>
      </p>
    </>
  );
}
