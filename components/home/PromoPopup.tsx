"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActivePopup } from "@/lib/shared-types";

// Không phải modal (không overlay, không chặn tương tác trang) — 1 thẻ nhỏ ghim cố định ở
// góc màn hình bằng position: fixed, nên tự "đi theo" khi cuộn trang. Theo yêu cầu: luôn hiện
// lại mỗi lần vào trang, chỉ mất khi người dùng bấm đóng trong lần xem đó (không lưu trạng
// thái đã đóng vào storage).
const OPEN_DELAY_MS = 600;

export function PromoPopup({ popup }: { popup: ActivePopup | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [popup]);

  if (!popup) return null;

  return (
    <div
      role="dialog"
      aria-label={popup.title}
      aria-hidden={!open}
      className={cn(
        "fixed right-4 bottom-4 left-4 z-50 max-w-[400px] overflow-hidden bg-popover shadow-xl ring-1 ring-foreground/10 transition-all duration-300 sm:left-auto sm:w-[400px]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <div className="relative aspect-34/15 w-full">
        <Image src={popup.imageUrl} alt={popup.title} fill sizes="400px" className="object-cover" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Đóng"
          className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center bg-white text-foreground shadow-md transition-colors hover:bg-white/90"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-6">
        {popup.eyebrow && (
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">{popup.eyebrow}</p>
        )}
        <h2 className="font-heading text-size-24 leading-[34.5px] font-normal text-foreground">
          {popup.title}
        </h2>
        {popup.description && (
          <p className="text-sm leading-[22px] text-neutral-33">{popup.description}</p>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button
            variant="dark"
            size="xl"
            nativeButton={false}
            render={<Link href={popup.ctaLinkUrl} onClick={() => setOpen(false)} />}
          >
            {popup.ctaLabel}
          </Button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
