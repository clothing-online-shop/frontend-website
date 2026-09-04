"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { OtpForm } from "./OtpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type AuthTab = "login" | "register" | "otp" | "forgot";

const AUTH_TABS: { key: AuthTab; label: string }[] = [
  { key: "login", label: "Đăng nhập" },
  { key: "register", label: "Đăng ký" },
  { key: "otp", label: "OTP" },
  { key: "forgot", label: "Quên mật khẩu" },
];

function isAuthTab(value: string | null): value is AuthTab {
  return value === "login" || value === "register" || value === "otp" || value === "forgot";
}

// Cả 4 tab (Đăng nhập/Đăng ký/OTP/Quên mật khẩu) giờ chuyển bằng state tại chỗ, KHÔNG điều
// hướng sang route/trang khác — cùng nằm chung 1 box, dùng chung 1 bộ style (font-size,
// font-weight, màu, border...) lấy từ form đăng nhập, theo đúng yêu cầu "ở chung box này".
// Đọc tab/email/code ban đầu từ query string để: (1) F5/copy link giữ đúng tab đang xem,
// (2) các trang /register, /verify-otp, /forgot-password cũ (đã chuyển thành redirect) vẫn
// mở đúng tab tương ứng kèm email/code cho link kích hoạt trong email.
export function LoginTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<AuthTab>(() => {
    const tabParam = searchParams.get("tab");
    return isAuthTab(tabParam) ? tabParam : "login";
  });
  const [otpEmail, setOtpEmail] = useState(() => searchParams.get("email") ?? "");
  const initialOtpCode = searchParams.get("code") ?? "";

  function selectTab(tab: AuthTab) {
    setActiveTab(tab);
    router.replace(tab === "login" ? "/login" : `/login?tab=${tab}`, { scroll: false });
  }

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

        <div className="flex-1 p-8 sm:pl-[34px] sm:py-[36px]">
          <nav className="mb-[26px] flex flex-wrap gap-6 border-b border-border" aria-label="Xác thực">
            {AUTH_TABS.map((tab) => {
              const active = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => selectTab(tab.key)}
                  className={cn(
                    "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
                    active
                      ? "border-[#1E1A15] text-[#1E1A15] font-semibold"
                      : "border-transparent text-[#76706A] hover:text-[#1E1A15] font-semibold",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {activeTab === "login" && (
            <LoginForm
              onForgotPassword={() => selectTab("forgot")}
              onRegister={() => selectTab("register")}
            />
          )}
          {activeTab === "register" && (
            <RegisterForm
              onLogin={() => selectTab("login")}
              onRegistered={(email) => {
                setOtpEmail(email);
                selectTab("otp");
              }}
            />
          )}
          {activeTab === "otp" && (
            <OtpForm
              key={otpEmail}
              initialEmail={otpEmail}
              initialCode={initialOtpCode}
              onVerified={() => selectTab("login")}
            />
          )}
          {activeTab === "forgot" && <ForgotPasswordForm onLogin={() => selectTab("login")} />}
        </div>
      </div>
    </div>
  );
}
