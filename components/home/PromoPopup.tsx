"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ActivePopup } from "@/lib/shared-types";

// Đóng 1 lần thì không hiện lại trong cùng phiên truy cập — dùng sessionStorage (mất khi
// đóng hẳn trình duyệt), không dùng localStorage vì yêu cầu chỉ giới hạn trong 1 phiên.
const SESSION_KEY = "promo-popup-dismissed";
const OPEN_DELAY_MS = 600;

export function PromoPopup({ popup }: { popup: ActivePopup | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [popup]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) sessionStorage.setItem(SESSION_KEY, "1");
  }

  if (!popup) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0 sm:max-w-[760px] rounded-none">
        <DialogTitle className="sr-only">{popup.title}</DialogTitle>
        {popup.description && <DialogDescription className="sr-only">{popup.description}</DialogDescription>}

        <div className="flex flex-col sm:flex-row min-h-[440px]">
          <div className="relative aspect-4/3 w-full sm:aspect-auto sm:w-[65%]">
            <Image
              src={popup.imageUrl}
              alt={popup.title}
              fill
              sizes="(min-width: 640px) 400px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 p-6 text-center sm:w-1/2 sm:justify-center sm:p-8 sm:text-left">
            {popup.eyebrow && (
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">{popup.eyebrow}</p>
            )}
            <h2 className="font-normal text-xl leading-tight text-foreground sm:text-size-30 sm:leading-[34.5px]">
              {popup.title}
            </h2>
            {popup.description && <p className="text-size-14 leading-[22px] text-neutral-33">{popup.description}</p>}
            {popup.discountCode && (
              <p className="self-center rounded-md border border-dashed border-border px-3 py-1.5 text-sm font-semibold tracking-wide text-foreground sm:self-start">
                {popup.discountCode}
              </p>
            )}

            <Button
              variant="dark"
              size="xl"
              className="mt-1 w-full"
              nativeButton={false}
              render={<Link href={popup.ctaLinkUrl} onClick={() => handleOpenChange(false)} />}
            >
              {popup.ctaLabel}
            </Button>
            <DialogClose render={<Button variant="ghost" className="cursor-pointer w-full text-muted-foreground" />}>
              <span className="cursor-pointer">Để sau</span>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
