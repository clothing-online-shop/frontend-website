"use client";

import { useEffect, useRef, useState } from "react";
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

  // Click ra ngoài (hoặc Esc) thì đóng — dropdown nằm trong cùng containerRef nên bấm vào 1
  // mục lịch sử không bị tính là "click ra ngoài".
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

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
    <div ref={containerRef} className={cn("relative", className)}>
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
              // mousedown thay vì click — chạy TRƯỚC khi input mất focus (blur), tránh
              // trường hợp blur đóng dropdown mất trước khi click kịp đăng ký.
              onMouseDown={(e) => {
                e.preventDefault();
                goSearch(keyword);
              }}
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
