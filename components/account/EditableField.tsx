"use client";

import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const LABEL_CLASS = "text-size-12 font-medium text-muted-foreground";

type EditableFieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChange: (value: string) => void;
  /** Định dạng lại giá trị hiển thị khi đang khoá (VD: che bớt SĐT). Mặc định hiển thị nguyên văn. */
  formatDisplay?: (value: string) => string;
  labelClassName?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

// Field dạng label + input khoá mặc định (nền xám) + nút "Đổi"/"Huỷ" ở góc phải để mở/khoá
// nhập liệu — dùng chung cho các field cần xác thực lại (OTP) mới đổi được, như SĐT/Email
// trong ProfileForm. Bấm "Huỷ" chỉ đổi trạng thái khoá, việc trả input về giá trị gốc do
// component cha xử lý (thường qua resetField của react-hook-form).
export function EditableField({
  label,
  value,
  isEditing,
  onToggleEdit,
  onChange,
  formatDisplay,
  labelClassName,
  inputProps,
}: EditableFieldProps) {
  const displayValue = isEditing || !formatDisplay ? value : formatDisplay(value);

  return (
    <div>
      <p className={cn(LABEL_CLASS, "mt-2.25", labelClassName)}>{label}</p>
      <div className="relative mt-1.5">
        <Input
          aria-label={label}
          disabled={!isEditing}
          className="h-11 pr-14"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          {...inputProps}
        />
        <button
          type="button"
          onClick={onToggleEdit}
          className={cn(
            "absolute top-1/2 cursor-pointer right-3 -translate-y-1/2 text-size-12",
            isEditing ? "text-muted-foreground" : "text-brand-38",
          )}
        >
          {isEditing ? "Huỷ" : "Đổi"}
        </button>
      </div>
    </div>
  );
}
