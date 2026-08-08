"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { PromoPopupConfig } from "@/lib/home-mock";

// Đóng 1 lần thì không hiện lại trong cùng phiên truy cập — dùng sessionStorage (mất khi
// đóng hẳn trình duyệt), không dùng localStorage vì yêu cầu chỉ giới hạn trong 1 phiên.
const SESSION_KEY = "promo-popup-dismissed";
const OPEN_DELAY_MS = 600;

export function PromoPopup({ config }: { config: PromoPopupConfig }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) sessionStorage.setItem(SESSION_KEY, "1");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogTitle className="sr-only">{config.title}</DialogTitle>
        <DialogDescription className="sr-only">{config.description}</DialogDescription>
        <Link
          href={config.linkUrl}
          onClick={() => handleOpenChange(false)}
          className="group block"
        >
          <div className="relative aspect-3/4 w-full">
            <Image
              src={config.imageUrl}
              alt={config.title}
              fill
              sizes="(min-width: 640px) 400px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-1 p-4 text-center">
            <p className="font-heading text-lg font-semibold">{config.title}</p>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
