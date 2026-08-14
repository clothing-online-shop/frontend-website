"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { login } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
      router.push("/account");
    },
  });

  return (
    <AuthLayout>
      <h1 className="font-heading text-2xl font-extrabold uppercase">Đăng nhập</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-foreground underline underline-offset-2">
          Tạo tài khoản mới
        </Link>
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
      >
        <div className="space-y-1">
          <Input
            className="h-11"
            placeholder="Email hoặc số điện thoại"
            {...register("identifier")}
          />
          {errors.identifier && (
            <p className="text-sm text-destructive">{errors.identifier.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            className="h-11"
            placeholder="Mật khẩu"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Link
          href="/forgot-password"
          className="inline-block text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Quên mật khẩu?
        </Link>

        {mutation.isError && (
          <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-bold uppercase"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </AuthLayout>
  );
}
