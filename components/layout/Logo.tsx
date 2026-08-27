import Link from "next/link";
import { cn } from "@/lib/utils";

// Chữ ký thương hiệu dạng chữ trơn (font-heading = Lora, serif) thay cho khối nền màu cũ —
// không tự set màu chữ ở đây (không có class text-*) để nơi gọi tự quyết theo nền của
// chính nó: header nền sáng dùng text-foreground (chữ tối), footer nền tối dùng
// text-background (chữ sáng) — xem Header/Footer.tsx.
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className="inline-block">
      <span className={cn("font-heading text-2xl font-semibold tracking-tight", className)}>
        Phương <span className="font-normal italic">Phương</span>
      </span>
    </Link>
  );
}
