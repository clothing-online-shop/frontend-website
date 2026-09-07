"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar({
  className,
  defaultValue,
}: {
  className?: string;
  defaultValue?: string;
}) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const keyword = (new FormData(e.currentTarget).get("q") as string)?.trim();
    if (!keyword) return;
    router.push(`/san-pham?search=${encodeURIComponent(keyword)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)} role="search">
      <Input
        name="q"
        type="search"
        // Tắt gợi ý autofill mặc định của trình duyệt (nhớ theo name="q" trên toàn site,
        // không liên quan gì tới search-history thật) — để tránh lẫn với dãy "Từ khóa tìm
        // gần đây" thật sự (lấy từ API, hiện ở trang kết quả) khiến người dùng tưởng nhầm
        // là cùng 1 danh sách.
        autoComplete="off"
        placeholder="Tìm áo, váy, mã SKU..."
        defaultValue={defaultValue}
        className="h-11 rounded-full bg-white pr-10 pl-4"
        aria-label="Từ khóa tìm kiếm"
      />
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}
