"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register as registerApi } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";

const registerSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (_data, variables) =>
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`),
  });

  return (
    <>
      <h1 className="font-heading text-2xl font-extrabold uppercase">Tạo tài khoản</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-2">
          Đăng nhập
        </Link>
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((values) =>
          mutation.mutate({ ...values, phone: values.phone || undefined }),
        )}
      >
        <div className="space-y-1">
          <Input className="h-11" placeholder="Họ tên" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input className="h-11" placeholder="Email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Input
            className="h-11"
            placeholder="Số điện thoại (không bắt buộc)"
            {...register("phone")}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
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

        {mutation.isError && (
          <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-bold uppercase"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>
    </>
  );
}
