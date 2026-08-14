"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="space-y-1">
              <Input placeholder="Email hoặc số điện thoại" {...register("identifier")} />
              {errors.identifier && (
                <p className="text-sm text-destructive">{errors.identifier.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Input placeholder="Mật khẩu" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            {mutation.isError && (
              <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
            )}
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <Link href="/register" className="hover:underline">
              Tạo tài khoản mới
            </Link>
            <Link href="/forgot-password" className="text-muted-foreground hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
