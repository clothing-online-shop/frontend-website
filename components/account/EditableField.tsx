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

// Field dạng label + input + nút "Đổi"/"Huỷ" ở góc phải. Hỗ trợ 2 kiểu dùng tuỳ component
// cha điều khiển isEditing: (1) unlock nhập liệu tại chỗ (isEditing chuyển true/false, "Huỷ"
// tự trả input về giá trị gốc qua resetField của react-hook-form) — hiện KHÔNG còn chỗ nào
// dùng kiểu này; (2) khoá vĩnh viễn (isEditing luôn false, onChange không dùng tới) và
// onToggleEdit chỉ để mở 1 dialog/flow riêng bên ngoài (vd SĐT/Email trong ProfileForm mở
// ChangeContactDialog vì đổi 2 field đó bắt buộc qua OTP, không thể gộp vào input tại chỗ).
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
