"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const newsletterSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  async function onValid() {
    // Chưa có API lưu email đăng ký nhận bản tin ở backend — mock thành công để demo UI,
    // không lưu ở đâu cả cho tới khi có endpoint thật.
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Đăng ký nhận bản tin thành công!");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Nhập email của bạn"
          aria-label="Email đăng ký nhận bản tin"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          Đăng ký
        </Button>
      </div>
      {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
    </form>
  );
}
