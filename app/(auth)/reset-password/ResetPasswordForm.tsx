"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const mutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) => resetPassword({ token, ...values }),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.push("/login");
    },
  });

  if (!token) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-extrabold uppercase">Đặt lại mật khẩu</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.{" "}
          <Link href="/forgot-password" className="font-medium underline underline-offset-2">
            Gửi lại yêu cầu
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold uppercase">Đặt lại mật khẩu</h1>
      <p className="mt-2 text-sm text-muted-foreground">Nhập mật khẩu mới cho tài khoản.</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
      >
        <div className="space-y-1">
          <Input
            className="h-11"
            placeholder="Mật khẩu mới"
            type="password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
          )}
        </div>
        {mutation.isError && (
          <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
        )}
        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-bold uppercase"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Đang lưu..." : "Đặt lại mật khẩu"}
        </Button>
      </form>
    </div>
  );
}
