import Image from "next/image";
import MainLayout from "@/app/(main)/layout";
import { AuthTabsNav } from "./AuthTabsNav";

// Dùng lại MainLayout (Header + main + Footer) từ (main)/layout.tsx thay vì import lại
// Header/Footer — (auth) tách route group riêng nên phải wrap tường minh thay vì thừa kế.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <div className="mx-auto max-w-105 md:max-w-209 my-6 px-4 sm:my-10">
        <div className="overflow-hidden rounded-2xl flex bg-login-card-bg">
          {/* Banner trái — chỉ hiện trên md+ */}
          <div className="relative hidden min-h-113 w-90.25 shrink-0 md:block">
            <Image
              src="/image/login_banner.jpg"
              alt=""
              fill
              sizes="361px"
              className="object-cover max-h-104"
            />
          </div>

          {/* Panel phải: tabs + form */}
          <div className="flex-1 max-w-95 p-5 sm:p-8 sm:pl-8.5 sm:py-9">
            <AuthTabsNav />
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
