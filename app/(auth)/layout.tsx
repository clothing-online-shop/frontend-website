import Image from "next/image";
import MainLayout from "@/app/(main)/layout";
import { AuthTabsNav } from "./AuthTabsNav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <div className="px-4 my-6 sm:my-10 md:my-0 md:px-0">
        <div className="relative overflow-hidden">
          <div className="relative hidden min-h-215 md:block">
            <Image
              src="/image/login_banner.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="bg-white p-5 shadow-sm sm:p-8 sm:pl-8.5 sm:py-9 md:shadow-none md:absolute md:top-80 md:left-1/2 md:w-105 md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-109 lg:left-88 lg:translate-x-0 min-h-109">
            <AuthTabsNav />
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
