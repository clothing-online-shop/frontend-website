"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getRecentSearches } from "@/lib/search-history-api";

export function SearchBar({
  className,
  defaultValue,
}: {
  className?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // enabled: open — chỉ gọi API lúc thực sự mở dropdown (bấm vào ô), không gọi sẵn mỗi lần
  // header render dù chưa ai đụng tới ô search.
  const recentSearchesQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: getRecentSearches,
    enabled: open,
  });
  const history = recentSearchesQuery.data ?? [];

  // Đóng dựa thẳng vào blur thật của trình duyệt thay vì tự đoán "click ra ngoài" bằng
  // listener mousedown/keydown gắn ở document — cách cũ dễ vỡ khi input type="search" có
  // nút xoá "×" mặc định của trình duyệt (xoá hết chữ vẫn coi như 1 tương tác trong ô,
  // nhưng listener toàn trang đôi lúc bắt nhầm thành "ra ngoài" rồi đóng mất dropdown).
  // onBlur trên div cha bắt được cả khi 1 phần tử con (input) mất focus — chỉ thực sự đóng
  // nếu nơi nhận focus tiếp theo (relatedTarget) không còn nằm trong khối search này nữa.
  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(e.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  function goSearch(keyword: string) {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/san-pham?search=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    goSearch((new FormData(e.currentTarget).get("q") as string) ?? "");
  }

  return (
    <div ref={containerRef} onBlur={handleBlur} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} role="search">
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="size-4" />
        </button>
        <Input
          name="q"
          type="search"
          autoComplete="off"
          placeholder="Tìm áo, váy, mã SKU..."
          defaultValue={defaultValue}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="h-11 w-full bg-white pr-4 pl-10"
          aria-label="Từ khóa tìm kiếm"
        />
      </form>

      {open && history.length > 0 ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg bg-popover py-1.5 text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <p className="px-3.5 py-1.5 text-size-12 text-muted-foreground">Tìm kiếm gần đây</p>
          {history.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => goSearch(keyword)}
              className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left text-size-13 hover:bg-muted"
            >
              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{keyword}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
