import Image from "next/image";
import MainLayout from "@/app/(main)/layout";
import { AuthTabsNav } from "./AuthTabsNav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {/* Ảnh nền chỉ từ lg (desktop); mobile/tablet chỉ có thẻ đăng nhập trắng, canh giữa. */}
      <div className="px-4 my-6 sm:my-10 lg:my-0 lg:px-0">
        <div className="relative overflow-hidden">
          <div className="relative hidden min-h-215 lg:block">
            <Image
              src="/image/login_banner.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="mx-auto bg-white p-5 shadow-sm sm:max-w-105 sm:p-8 sm:pl-8.5 sm:py-9 lg:mx-0 lg:shadow-none lg:absolute lg:top-80 lg:left-88 lg:w-105 lg:max-w-none lg:-translate-y-1/2 lg:max-h-109 min-h-109">
            <AuthTabsNav />
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
