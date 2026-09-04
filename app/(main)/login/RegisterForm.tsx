"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register as registerApi } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { AUTH_ERROR_BOX_CLASS, AUTH_INPUT_CLASS, AUTH_LABEL_CLASS, AUTH_SUBMIT_BUTTON_CLASS } from "./auth-field-styles";

const registerSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  onRegistered,
  onLogin,
}: {
  onRegistered: (email: string) => void;
  onLogin: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (_data, variables) => onRegistered(variables.email),
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        mutation.mutate({ ...values, phone: values.phone || undefined }),
      )}
    >
      <div>
        <label htmlFor="register-fullName" className={AUTH_LABEL_CLASS}>
          Họ tên
        </label>
        <Input
          id="register-fullName"
          className={AUTH_INPUT_CLASS}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          {...register("fullName")}
        />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="register-email" className={AUTH_LABEL_CLASS}>
          Email
        </label>
        <Input
          id="register-email"
          type="email"
          className={AUTH_INPUT_CLASS}
          placeholder="ban@email.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="register-phone" className={AUTH_LABEL_CLASS}>
          Số điện thoại (không bắt buộc)
        </label>
        <Input
          id="register-phone"
          className={AUTH_INPUT_CLASS}
          placeholder="0912 345 678"
          autoComplete="tel"
          {...register("phone")}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="my-4">
        <label htmlFor="register-password" className={AUTH_LABEL_CLASS}>
          Mật khẩu
        </label>
        <Input
          id="register-password"
          type="password"
          className={AUTH_INPUT_CLASS}
          placeholder="••••••"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        className={AUTH_SUBMIT_BUTTON_CLASS}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Đang tạo tài khoản..." : "Đăng ký"}
      </Button>

      {mutation.isError && <div className={AUTH_ERROR_BOX_CLASS}>{getErrorMessage(mutation.error)}</div>}
    </form>
  );
}
