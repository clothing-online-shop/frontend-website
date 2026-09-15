import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 2 file riêng vì chữ trong ảnh có màu cố định, không tự đổi theo text-*/nền như bản chữ
// "Phương Phương" cũ — "default" (chữ nâu đậm) dùng cho nền sáng (Header, trang login),
// "footer" (chữ sáng) dành riêng cho nền tối của Footer.
const LOGO_VARIANTS = {
  default: { src: "/image/logo.png", width: 209, height: 50 },
  footer: { src: "/image/logo-footer.png", width: 327, height: 47 },
} as const;

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: keyof typeof LOGO_VARIANTS;
}) {
  const { src, width, height } = LOGO_VARIANTS[variant];
  return (
    <Link href="/" className="inline-block">
      <Image
        src={src}
        alt="Phương Phương"
        width={width}
        height={height}
        priority
        className={cn("h-8 w-auto", className)}
      />
    </Link>
  );
}
