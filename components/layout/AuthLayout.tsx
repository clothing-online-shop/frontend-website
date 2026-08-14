import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";

// Bố cục chia đôi cho toàn bộ màn xác thực (đăng nhập/đăng ký/OTP/quên-đặt lại mật khẩu)
// — cột trái chứa form, cột phải là ảnh minh hoạ full-height (ẩn ở mobile). Tham khảo
// layout từ trang mẫu khách gửi, nhưng giữ nguyên ngôn ngữ thương hiệu hiện có của site
// (font-heading Be Vietnam Pro đậm/chữ hoa, màu primary đỏ) thay vì đổi sang serif/đen-be
// của mẫu — trang chủ/trang sản phẩm đã chốt tông "thương mại/fast-fashion" từ trước.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-[35%] lg:px-16 lg:py-10">
        <Logo className="text-base" />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <div className="relative hidden w-[65%] lg:block">
        <Image
          src="/authen-img.jpg"
          alt=""
          fill
          sizes="65vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
