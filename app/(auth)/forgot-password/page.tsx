"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quên mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="text-sm text-muted-foreground">
              Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật
              khẩu. Vui lòng kiểm tra hộp thư (kể cả mục spam).
            </p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="space-y-1">
                <Input placeholder="Email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Đang gửi..." : "Gửi hướng dẫn đặt lại mật khẩu"}
              </Button>
            </form>
          )}
          <div className="mt-4 text-sm">
            <Link href="/login" className="hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
