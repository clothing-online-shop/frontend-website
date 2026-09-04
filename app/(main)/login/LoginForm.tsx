"use client";

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

export function LoginForm({
  onForgotPassword,
  onRegister,
}: {
  onForgotPassword: () => void;
  onRegister: () => void;
}) {
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
    <form onSubmit={handleSubmit(onValid)}>
      <div>
        <label htmlFor="login-identifier" className={AUTH_LABEL_CLASS}>
          Số điện thoại hoặc email
        </label>
        <Input
          id="login-identifier"
          className={AUTH_INPUT_CLASS}
          placeholder="0912 345 678"
          autoComplete="username"
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className="text-xs text-destructive">{errors.identifier.message}</p>
        )}
      </div>

      <div className="my-4">
        <label htmlFor="login-password" className={AUTH_LABEL_CLASS}>
          Mật khẩu
        </label>
        <Input
          id="login-password"
          type="password"
          className={AUTH_INPUT_CLASS}
          placeholder="••••••"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
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
        <button type="button" onClick={onForgotPassword} className={AUTH_LINK_CLASS}>
          Quên mật khẩu?
        </button>
      </div>

      <Button
        type="submit"
        size="lg"
        className={AUTH_SUBMIT_BUTTON_CLASS}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      {mutation.isError && <div className={AUTH_ERROR_BOX_CLASS}>{getErrorMessage(mutation.error)}</div>}
    </form>
  );
}
