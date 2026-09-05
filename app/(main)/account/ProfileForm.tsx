"use client";

import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/shared-types";
import { updateProfile } from "@/lib/users-api";
import { useAuthStore } from "@/store/auth-store";

const profileSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => !val || new Date(val) <= new Date(),
      { message: "Ngày sinh không được là ngày trong tương lai" },
    ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const GENDER_LABELS: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

// Che bớt SĐT lúc chưa bấm "Đổi" — giữ nguyên 4 số đầu + 2 số cuối, phần giữa thay bằng
// "••••" bất kể còn lại bao nhiêu số, đúng kiểu hiển thị trong mockup.
function maskPhone(phone: string): string {
  if (!phone || phone.length <= 6) return phone;
  return `${phone.slice(0, 4)} •••• ${phone.slice(-2)}`;
}

const LABEL_CLASS = "text-size-12 font-medium text-muted-foreground";
const INPUT_CLASS = "h-11 mt-1.5 placeholder:text-size-13";

export function ProfileForm({ user }: { user: AuthUser }) {
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const setUser = useAuthStore((s) => s.setUser);
  // SĐT/Email mặc định khoá (disabled, nền xám) — bấm "Đổi" mới mở khoá cho nhập; bấm lại
  // lần nữa ("Huỷ") thì khoá lại và trả input về giá trị gốc, không giữ phần đang gõ dở.
  const [editingField, setEditingField] = useState<"phone" | "email" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, resetField, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender: user.gender ?? undefined,
      phone: user.phone ?? "",
      email: user.email,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const updated = await updateProfile({
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth || undefined,
        gender: values.gender as "MALE" | "FEMALE" | "OTHER" | undefined,
      });
      setUser(updated);
      toast.success("Lưu hồ sơ thành công!");
    } catch {
      toast.error("Lưu hồ sơ thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function onPickAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    // Chỉ xem trước cục bộ — chưa có API upload avatar nên chưa gửi file đi đâu cả.
    setAvatarPreview(URL.createObjectURL(file));
    toast.info("Chức năng tải ảnh đại diện sẽ hoàn thiện khi có API upload ở backend.");
  }

  function toggleEditing(field: "phone" | "email") {
    if (editingField === field) {
      resetField(field);
      setEditingField(null);
    } else {
      setEditingField(field);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-size-28">Hồ sơ cá nhân</h1>

      <div className="mt-6.5 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            <div>
              <p className={LABEL_CLASS}>Họ và tên</p>
              <Input
                id="profile-fullName"
                aria-label="Họ và tên"
                className={INPUT_CLASS}
                placeholder="Nhập họ và tên"
                {...register("fullName")}
              />
            </div>

            <div>
              <p className={LABEL_CLASS}>Ngày sinh</p>
              <Input
                id="profile-dob"
                type="date"
                aria-label="Ngày sinh"
                max={new Date().toISOString().slice(0, 10)}
                className={INPUT_CLASS}
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-size-12 text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <p className={cn(LABEL_CLASS, "mt-2.25")}>Số điện thoại</p>
              <div className="relative mt-1.5">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="profile-phone"
                      aria-label="Số điện thoại"
                      disabled={editingField !== "phone"}
                      className="h-11 pr-14"
                      placeholder="Nhập số điện thoại"
                      value={editingField === "phone" ? (field.value ?? "") : maskPhone(field.value ?? "")}
                      onChange={field.onChange}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => toggleEditing("phone")}
                  className={cn(
                    "absolute top-1/2 cursor-pointer right-3 -translate-y-1/2 text-size-12",
                    editingField === "phone" ? "text-muted-foreground" : "text-[#8B5339]",
                  )}
                >
                  {editingField === "phone" ? "Huỷ" : "Đổi"}
                </button>
              </div>
            </div>

            <div>
              <p className= {cn(LABEL_CLASS, "mt-2.25")}>Email</p>
              <div className="relative mt-1.5">
                <Input
                  id="profile-email"
                  type="email"
                  aria-label="Email"
                  disabled={editingField !== "email"}
                  className="h-11 pr-14"
                  placeholder="Nhập email"
                  {...register("email")}
                />
                <button
                  type="button"
                  onClick={() => toggleEditing("email")}
                  className={cn(
                    "absolute top-1/2 cursor-pointer right-3 -translate-y-1/2 text-size-12",
                    editingField === "email" ? "text-muted-foreground" : "text-[#8B5339]",
                  )}
                >
                  {editingField === "email" ? "Huỷ" : "Đổi"}
                </button>
              </div>
            </div>

            <div>
              <p className={cn(LABEL_CLASS, "mt-2.25")}>Giới tính</p>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <div className="mt-2.5 flex items-center gap-5">
                    {(["MALE", "FEMALE", "OTHER"] as const).map((val) => (
                      <label key={val} className="flex cursor-pointer items-center gap-1.5 text-size-13">
                        <input
                          type="radio"
                          value={val}
                          checked={field.value === val}
                          onChange={() => field.onChange(val)}
                          className="accent-[#1E1A15] size-3.5 cursor-pointer"
                        />
                        {GENDER_LABELS[val]}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="col-span-full flex flex-wrap items-center gap-3 pt-3 mt-2.25">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1E1A15] h-11.5 px-6 text-size-13 font-semibold hover:bg-[#1E1A15]/90 disabled:opacity-60"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button type="button" variant="outline" className="h-11.5 px-6 text-size-13 bg-white font-semibold">
                Đổi mật khẩu
              </Button>
            </div>

            <p className="col-span-full text-size-12 text-[#76706A]">
              Đổi số điện thoại hoặc email cần xác thực lại bằng mã OTP.
            </p>
          </form>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative size-50 overflow-hidden rounded-full bg-muted">
            {avatarPreview && (
              <Image src={avatarPreview} alt={user.fullName} fill className="object-cover" />
            )}
          </div>
          <Button type="button" variant="outline" size="sm" className="relative overflow-hidden text-size-12 font-semibold h-9.5 bg-white">
            Tải ảnh lên
            <input
              type="file"
              accept="image/*"
              onChange={onPickAvatar}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Tải ảnh đại diện"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
