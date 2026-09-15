"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const AUTH_TABS = [
  { label: "Đăng nhập", href: "/login", disabled: false },
  { label: "Đăng ký", href: "/register", disabled: false },
  { label: "Quên mật khẩu", href: "/forgot-password", disabled: false },
] as const;

export function AuthTabsNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6.5 flex flex-wrap border-b border-border justify-between"
      aria-label="Xác thực"
    >
      {AUTH_TABS.map(({ label, href, disabled }) => {
        const isActive = pathname === href;

        if (disabled) {
          return (
            <span
              key={href}
              aria-disabled="true"
              className="cursor-not-allowed border-b-2 border-transparent pb-3 text-size-14 font-semibold text-neutral-76706A transition-colors select-none px-5.5"
            >
              {label}
            </span>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "border-b-2 px-5.5 pb-3 text-size-14 font-semibold transition-colors",
              isActive
                ? "border-brand-10 text-brand-10"
                : "border-transparent text-neutral-76706A hover:text-brand-10",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
