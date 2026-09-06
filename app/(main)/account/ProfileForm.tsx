"use client";

import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditableField } from "@/components/account/EditableField";
import { ChangeContactDialog } from "@/components/account/ChangeContactDialog";
import { DatePicker } from "@/components/common/DatePicker";
import { cn } from "@/lib/utils";
import { maskPhone } from "@/lib/format";
import type { AuthUser } from "@/lib/shared-types";
import { updateProfile } from "@/lib/users-api";
import { deleteImage, uploadImage } from "@/lib/upload-api";
import { useAuthStore } from "@/store/auth-store";

// phone/email KHÔNG còn trong schema này — đổi 2 field đó phải qua OTP (xem
// ChangeContactDialog), không đi qua submit chung của form nữa (trước đây "Lưu thay đổi"
// coi như thành công dù gõ số/email mới nhưng thực chất không gửi lên BE, vì
// UpdateProfileDto không nhận 2 field này).
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
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const GENDER_LABELS: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

const LABEL_CLASS = "text-size-12 font-medium text-muted-foreground";
const INPUT_CLASS = "h-11 mt-1.5 placeholder:text-size-13";

export function ProfileForm({ user }: { user: AuthUser }) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  // Đi kèm avatarUrl — cần publicId để xóa đúng ảnh trên Cloudinary khi đổi/gỡ avatar.
  const [avatarPublicId, setAvatarPublicId] = useState(user.avatarPublicId);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  // Field nào đang mở dialog đổi SĐT/Email — null nghĩa là không dialog nào đang mở. Khác
  // avatar (chỉnh xong nhấn "Lưu thay đổi" mới ghi), đổi SĐT/Email tự ghi thẳng qua OTP nên
  // không cần state theo dõi trong RHF nữa, chỉ cần biết đang mở dialog cho field nào.
  const [contactDialogField, setContactDialogField] = useState<"phone" | "email" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender: user.gender ?? undefined,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const updated = await updateProfile({
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth || undefined,
        gender: values.gender as "MALE" | "FEMALE" | "OTHER" | undefined,
        // Avatar đã tải lên/xóa thật trên Cloudinary ngay lúc bấm (xem onPickAvatar/
        // onRemoveAvatar) — gửi kèm ở đây chỉ để lưu url/publicId hiện tại vào hồ sơ,
        // null nghĩa là user đã gỡ avatar.
        avatarUrl,
        avatarPublicId,
      });
      setUser(updated);
      toast.success("Lưu hồ sơ thành công!");
    } catch {
      toast.error("Lưu hồ sơ thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onPickAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // cho phép chọn lại đúng file cũ ở lần sau
    if (!file) return;

    const previousPublicId = avatarPublicId;
    setUploadingAvatar(true);
    try {
      const result = await uploadImage(file);
      setAvatarUrl(result.url);
      setAvatarPublicId(result.publicId);
      // Ảnh cũ (nếu có) đã bị thay — dọn luôn trên Cloudinary, tránh rác. Không chặn
      // UI vì đằng nào avatar mới cũng đã nhận, lỗi dọn rác không nên làm hỏng thao tác
      // của người dùng.
      if (previousPublicId) {
        deleteImage(previousPublicId).catch(() => undefined);
      }
    } catch {
      toast.error("Tải ảnh đại diện thất bại, vui lòng thử lại.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function onRemoveAvatar() {
    const publicId = avatarPublicId;
    // Xóa trên Cloudinary trước, chỉ gỡ khỏi UI khi chắc chắn đã xóa xong — tránh trường
    // hợp API lỗi mà UI vẫn coi như đã gỡ, để lại rác trên Cloudinary mà không ai biết.
    if (publicId) {
      try {
        await deleteImage(publicId);
      } catch {
        toast.error("Xóa ảnh trên Cloudinary thất bại, vui lòng thử lại.");
        return;
      }
    }
    setAvatarUrl(null);
    setAvatarPublicId(null);
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
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="profile-dob"
                    aria-label="Ngày sinh"
                    value={field.value}
                    onChange={field.onChange}
                    maxDate={new Date()}
                    className={INPUT_CLASS}
                    type="text"
                  />
                )}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-size-12 text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* isEditing luôn false — field này giờ chỉ hiển thị, không gõ trực tiếp được
                nữa. Bấm "Đổi" mở ChangeContactDialog (flow OTP riêng, xem component đó),
                không còn gộp vào submit chung của form như trước (giá trị gõ tạm trước đây
                không thực sự được gửi lên BE dù toast báo "Lưu thành công"). */}
            <EditableField
              label="Số điện thoại"
              value={user.phone ?? ""}
              onChange={() => undefined}
              isEditing={false}
              onToggleEdit={() => setContactDialogField("phone")}
              formatDisplay={maskPhone}
              inputProps={{ id: "profile-phone", placeholder: "Chưa cập nhật" }}
            />

            <EditableField
              label="Email"
              value={user.email}
              onChange={() => undefined}
              isEditing={false}
              onToggleEdit={() => setContactDialogField("email")}
              inputProps={{ id: "profile-email", type: "email" }}
            />

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
                          className="accent-brand-10 size-3.5 cursor-pointer"
                        />
                        {GENDER_LABELS[val]}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="col-span-full flex flex-wrap items-center gap-3 pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-10 h-11.5 px-6 text-size-13 font-semibold hover:bg-brand-10/90 disabled:opacity-60"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button type="button" disabled variant="outline" className="h-11.5 px-6 text-size-13 bg-white font-semibold">
                Đổi mật khẩu
              </Button>
            </div>

            <p className="col-span-full text-size-12 text-neutral-76706A">
              Đổi số điện thoại hoặc email cần xác thực lại bằng mã OTP.
            </p>
          </form>
        </div>

        {/* order-first: dưới lg (mobile/tablet, grid-cols-1) đẩy khối avatar lên TRƯỚC form
            — chỉ đổi thứ tự hiển thị bằng CSS order, không đổi DOM/tab order. Từ lg: trở
            lên reset order-none để về đúng vị trí cột phải như thiết kế gốc (grid 2 cột
            lg:grid-cols-[1fr_240px] tự xếp nó sang bên phải bất kể order). */}
        <div className="order-first flex flex-col items-center gap-3 lg:order-none">
          {/* 1 container duy nhất, KHÔNG overflow-hidden — vòng tròn lấy từ rounded-full
              ngay trên <Image> (border-radius tự clip nội dung ảnh của chính nó, không
              cần div bọc overflow-hidden riêng). Nhờ vậy icon thùng rác (sibling, absolute
              left-full) không bao giờ bị mask/overflow nào của container cắt mất, đồng
              thời container vẫn đúng size-50 nên avatar tự căn giữa, không lệch trái. */}
          <div className="relative size-50 rounded-full bg-muted">
            {avatarUrl && (
              <Image src={avatarUrl} alt={user.fullName} fill sizes="200px" className="rounded-full object-cover" />
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
            {avatarUrl && !uploadingAvatar && (
              <button
                type="button"
                onClick={onRemoveAvatar}
                aria-label="Xóa ảnh đại diện"
                className="absolute top-1/2 left-full ml-2 -translate-y-1/2 cursor-pointer text-destructive hover:text-destructive/80"
              >
                <Trash2 className="size-5" />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploadingAvatar}
            className="relative overflow-hidden text-size-12 font-semibold h-9.5 bg-white disabled:opacity-60"
          >
            {uploadingAvatar ? "Đang tải..." : "Tải ảnh lên"}
            <input
              type="file"
              accept="image/*"
              onChange={onPickAvatar}
              disabled={uploadingAvatar}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Tải ảnh đại diện"
            />
          </Button>
          <p className="text-size-12 text-center text-muted-foreground">Ảnh đại diện không bắt buộc</p>
        </div>
      </div>

      <ChangeContactDialog field={contactDialogField} onOpenChange={(open) => !open && setContactDialogField(null)} />
    </div>
  );
}
