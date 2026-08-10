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
        placeholder="Tìm kiếm sản phẩm..."
        defaultValue={defaultValue}
        className="h-9 pr-9"
        aria-label="Từ khóa tìm kiếm"
      />
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}
