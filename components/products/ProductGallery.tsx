"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return <div className="aspect-3/4 bg-secondary" />;
  }

  function goTo(index: number) {
    setActive((index + gallery.length) % gallery.length);
  }

  return (
    <div className="flex gap-3">
      {gallery.length > 1 ? (
        <div className="hidden max-h-[600px] w-16 shrink-0 flex-col gap-2 overflow-y-auto sm:flex">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "relative aspect-3/4 shrink-0 overflow-hidden border transition-colors",
                index === active ? "border-primary" : "border-border",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative flex-1">
        <div className="relative aspect-3/4 overflow-hidden bg-secondary">
          <Image
            src={gallery[active]}
            alt={name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-background/90 px-2 py-1 text-xs font-medium text-foreground">
            <ZoomIn className="size-3.5" />
            Phóng to
          </span>
        </div>

        {gallery.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Ảnh trước"
              onClick={() => goTo(active - 1)}
              className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Ảnh sau"
              onClick={() => goTo(active + 1)}
              className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute right-3 bottom-3 rounded-sm bg-foreground/80 px-2 py-1 text-xs font-medium text-background">
              {active + 1}/{gallery.length}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
