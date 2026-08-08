"use client";

import { useEffect } from "react";
import { Logo } from "@/components/layout/Logo";
import { StatusPage } from "@/components/errors/StatusPage";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Logo className="text-lg" />
        </div>
      </header>

      <StatusPage
        code="500"
        title="Đã có lỗi xảy ra"
        description="Hệ thống gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại hoặc quay về trang chủ."
        onRetry={unstable_retry}
      />
    </div>
  );
}
