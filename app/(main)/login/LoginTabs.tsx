"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";

// Đợt này mới có mockup UI cho màn Đăng nhập — 3 tab còn lại (Đăng ký/OTP/Quên mật khẩu)
// CHƯA có thiết kế để dựng UI bên trong box này, nên chỉ hiện label cho đủ bộ theo mẫu,
// khoá click (disabled, hover ra icon cấm), không có state chuyển tab/form nào phía sau.
// Trang /register, /verify-otp, /forgot-password vẫn tồn tại độc lập (bản UI cũ, xem
// components/layout/AuthLayout) cho tới khi có mockup mới thì mới gộp vào đây.
const DISABLED_TABS = ["Đăng ký", "OTP", "Quên mật khẩu"];

export function LoginTabs() {
  return (
    <div className="mx-auto max-w-[836px] my-10 bg-[#E4EBE6]">
      <div className="overflow-hidden rounded-2xl flex">
        <div className="relative hidden min-h-[452px] w-[361px] shrink-0 md:block">
          <Image
            src="/image/login_banner.jpg"
            alt=""
            fill
            sizes="361px"
            className="object-cover max-h-[416px]"
          />
        </div>

        <div className="flex-1 max-w-[380px] p-8 sm:pl-[34px] sm:py-[36px]">
          <nav className="mb-[20px] flex flex-wrap gap-4 border-b border-border" aria-label="Xác thực">
            <button
              type="button"
              aria-current="page"
              className="-mb-px border-b-2 border-[#1E1A15] pb-3 text-size-14 font-semibold text-[#1E1A15] transition-colors"
            >
              Đăng nhập
            </button>
            {DISABLED_TABS.map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className={cn(
                  "-mb-px cursor-not-allowed border-b-2 border-transparent pb-3",
                  "text-size-14 font-semibold text-[#76706A] transition-colors",
                )}
              >
                {label}
              </button>
            ))}
          </nav>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
