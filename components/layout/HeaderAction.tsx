import Image from "next/image";
import type { User } from "lucide-react";

// Badge số lượng dùng chung cho các icon ở header (giỏ hàng, yêu thích...) — quá MAX_COUNT
// thì rút gọn thành "99+" thay vì hiện số dài tràn khỏi hình tròn.
const MAX_COUNT = 99;

export function formatBadgeCount(count: number): string {
  return count > MAX_COUNT ? `${MAX_COUNT}+` : String(count);
}

export function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-primary-foreground">
      {formatBadgeCount(count)}
    </span>
  );
}

// Khung của 1 icon-action ở header desktop (icon trên, nhãn dưới) — dùng chung cho Link/button
// thường (HeaderActionItem) và nút mở dropdown Tài khoản (AccountMenu) để 2 loại luôn giống hệt nhau.
export const HEADER_ACTION_CLASS =
  "relative flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-foreground/70 transition-colors hover:text-foreground cursor-pointer";

export type HeaderActionContentProps = {
  label: string;
  icon: typeof User;
  // true = mục "Tài khoản" — luôn có khung tròn nền/viền riêng (Figma: 18x18, bg
  // #DAE2FD, border 1px #C6C6CD) chứa ảnh đại diện thật nếu có, hoặc icon fallback nếu
  // chưa có avatar — khác các icon phẳng còn lại (Yêu thích/Giỏ hàng...).
  isAvatar?: boolean;
  avatarUrl?: string | null;
  badge?: number;
  labelClassName?: string;
};

export function HeaderActionContent({
  label,
  icon: Icon,
  isAvatar,
  avatarUrl,
  badge,
  labelClassName,
}: HeaderActionContentProps) {
  return (
    <>
      <span className="relative">
        {isAvatar ? (
          <span className="relative flex size-5 items-center justify-center overflow-hidden rounded-full border border-header-avatar-border bg-header-avatar-bg">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" fill sizes="18px" className="object-cover" />
            ) : (
              <Icon className="size-3" />
            )}
          </span>
        ) : (
          <Icon className="size-5" />
        )}
        {badge !== undefined && badge > 0 && <CountBadge count={badge} />}
      </span>
      <span className={labelClassName ?? "text-neutral-37322C text-size-12 font-medium"}>{label}</span>
    </>
  );
}
