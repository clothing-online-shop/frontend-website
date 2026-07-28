"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-2xl font-bold">Tài khoản</h1>
      <div className="mt-4 space-y-1 text-sm">
        <p>Họ tên: {user.fullName}</p>
        <p>Email: {user.email}</p>
        <p>Vai trò: {user.role}</p>
      </div>
      <p className="mt-4 text-muted-foreground">
        Sổ địa chỉ và lịch sử đơn hàng sẽ được triển khai ở sprint sau.
      </p>
      <Button
        className="mt-6"
        variant="outline"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Đăng xuất
      </Button>
    </div>
  );
}
