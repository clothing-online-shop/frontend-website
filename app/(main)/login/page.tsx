"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Đăng ký/OTP/Quên mật khẩu vẫn là trang riêng chưa gộp header+footer (phạm vi đợt này chỉ
// làm màn đăng nhập) — đây là LINK điều hướng sang trang đó, không phải tab chuyển nội dung
// tại chỗ như 1 tab component thật.
const AUTH_TABS = [
  { label: "Đăng nhập", href: "/login" },
  { label: "Đăng ký", href: "/register" },
  { label: "OTP", href: "/verify-otp" },
  { label: "Quên mật khẩu", href: "/forgot-password" },
];

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", remember: true },
  });

  const mutation = useMutation({ mutationFn: login });

  function onValid(values: LoginFormValues) {
    mutation.mutate(
      { identifier: values.identifier, password: values.password },
      {
        onSuccess: (data) => {
          setSession(data.user, data.accessToken, data.refreshToken, values.remember);
          router.push("/account");
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-[836px] my-10">
      <div className="overflow-hidden rounded-2xl border border-border shadow-sm flex bg-[#E4EBE6]">
        <div className="relative hidden min-h-[452px] w-[361px] shrink-0 md:block">
          <Image
            src="/image/login_banner.jpg"
            alt=""
            fill 
            sizes="361px"
            className="object-cover max-h-[416px]"
          />
        </div>

        <div className="flex-1 p-8 sm:pl-[34px] sm:py-[36px]">
          <nav className="mb-[26px] flex flex-wrap gap-6 border-b border-border" aria-label="Xác thực">
            {AUTH_TABS.map((tab) => {
              const active = tab.href === "/login";
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
                    active
                      ? "border-[#1E1A15] border-b-2 text-[#1E1A15] font-semibold"
                      : "border-transparent  border-b-2 text-[#76706A] hover:text-[#1E1A15] font-semibold",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={handleSubmit(onValid)} className="space-y-4">
            <div className="">
              <label htmlFor="login-identifier" className="text-xs font-medium text-[#4C4741]">
                Số điện thoại hoặc email
              </label>
              <Input
                id="login-identifier"
                className="h-11 mt-[6px]"
                placeholder="0912 345 678"
                autoComplete="username"
                {...register("identifier")}
              />
              {errors.identifier && (
                <p className="text-sm text-destructive">{errors.identifier.message}</p>
              )}
            </div>

            <div className="">
              <label htmlFor="login-password" className="text-xs font-medium text-[#4C4741] mb-[7px]">
                Mật khẩu
              </label>
              <Input
                id="login-password"
                type="password"
                className="h-11 mt-[6px]"
                placeholder="••••••"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#4C4741] text-xs">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                Ghi nhớ đăng nhập
              </label>
              <Link
                href="/forgot-password"
                className="text-[#8B5339] text-xs"
              > 
                Quên mật khẩu?
              </Link>
            </div>

            {mutation.isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {getErrorMessage(mutation.error)}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-bold h-[50px] uppercase text-[rgba(255, 255, 255, 0.06)] bg-[rgba(30, 26, 21, 1)]!"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
