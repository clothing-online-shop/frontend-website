"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import {
  AUTH_ERROR_BOX_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_LINK_CLASS,
  AUTH_SUBMIT_BUTTON_CLASS,
} from "./auth-field-styles";

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", remember: true },
    // onChange để isValid cập nhật ngay khi gõ — dùng khoá nút "Đăng nhập" lúc chưa nhập đủ
    // thông tin, thay vì chỉ biết form invalid sau khi bấm submit lần đầu.
    mode: "onChange",
  });

  const mutation = useMutation({ mutationFn: login });

  // Box lỗi (kể cả message khoá tài khoản) chỉ tự mất khi bấm lại "Đăng nhập" (React Query
  // reset state lúc gọi mutate() mới) — người dùng không có cách nào chủ động xoá đi ngay
  // khi họ đang sửa lại thông tin. Xoá lỗi cũ ngay khi gõ lại 1 trong 2 ô, để box biến mất
  // đúng lúc người dùng bắt đầu thao tác tiếp theo thay vì treo mãi tới lần submit sau.
  const identifierField = register("identifier");
  const passwordField = register("password");

  function clearErrorOnEdit() {
    if (mutation.isError) mutation.reset();
  }

  const onValid = (values: LoginFormValues) => {
    mutation.mutate(
      { identifier: values.identifier, password: values.password },
      {
        onSuccess: (data) => {
          setSession(data.user, data.accessToken, data.refreshToken, values.remember);
          toast.success(`Chào mừng trở lại, ${data.user.fullName}!`);
          router.push("/");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div>
        <p className={AUTH_LABEL_CLASS}>
          Số điện thoại hoặc email
        </p>
        <Input
          id="login-identifier"
          aria-label="Số điện thoại hoặc email"
          className={cn(AUTH_INPUT_CLASS, "placeholder:text-size-13")}
          placeholder="Nhập số điện thoại hoặc email"
          autoComplete="username"
          {...identifierField}
          onChange={(event) => {
            identifierField.onChange(event);
            clearErrorOnEdit();
          }}
        />
        {errors.identifier && (
          <p className="text-size-12 text-destructive mt-1">{errors.identifier.message}</p>
        )}
      </div>


      <div className="my-4">
        <p className={AUTH_LABEL_CLASS}>
          Mật khẩu
        </p>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            aria-label="Mật khẩu"
            className={cn(AUTH_INPUT_CLASS, "pr-10 placeholder:text-size-13")}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            {...passwordField}
            onChange={(event) => {
              passwordField.onChange(event);
              clearErrorOnEdit();
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute top-1/2 cursor-pointer right-3 -translate-y-1/2 text-[#76706A] hover:text-[#1E1A15]"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-size-12 text-destructive mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between text-size-14 mb-4">
        <label className="flex items-center gap-2 text-[#4C4741] text-size-12">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          Ghi nhớ đăng nhập
        </label>
        <Link href="/forgot-password" className={AUTH_LINK_CLASS}>
          Quên mật khẩu?
        </Link>
      </div>

      <Button
        type="submit"
        size="lg"
        className={cn(AUTH_SUBMIT_BUTTON_CLASS, "disabled:pointer-events-auto disabled:cursor-not-allowed")}
        disabled={!isValid || mutation.isPending}
      >
        {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      {mutation.isError && <div className={AUTH_ERROR_BOX_CLASS}>{getErrorMessage(mutation.error)}</div>}
    </form>
  );
}
