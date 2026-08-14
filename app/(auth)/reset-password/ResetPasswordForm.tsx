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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="w-full">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.{" "}
          <Link href="/forgot-password" className="hover:underline">
            Gửi lại yêu cầu
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="space-y-1">
            <Input placeholder="Mật khẩu mới" type="password" {...register("newPassword")} />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>
          {mutation.isError && (
            <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
          )}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Đang lưu..." : "Đặt lại mật khẩu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
