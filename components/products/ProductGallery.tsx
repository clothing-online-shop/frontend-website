"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

const ZOOM_SCALE = 2.2;

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  // Chỉ bật zoom khi bấm vào ảnh (không tự bật lúc hover) — bấm lại (hoặc rê chuột ra
  // ngoài khung ảnh) để tắt. Đang zoom mà đổi ảnh (thumbnail/mũi tên) thì tự tắt zoom,
  // tránh giật hình khi ảnh mới hiện ra đã phóng to sẵn.
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const gallery = images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return <div className="aspect-3/4 bg-secondary" />;
  }

  function goTo(index: number) {
    setActive((index + gallery.length) % gallery.length);
    setIsZoomed(false);
  }

  function handleZoomMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
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
        <div
          role="button"
          tabIndex={0}
          aria-pressed={isZoomed}
          aria-label={isZoomed ? "Thu nhỏ ảnh" : "Phóng to ảnh"}
          onClick={() => setIsZoomed((z) => !z)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsZoomed((z) => !z);
            }
          }}
          onMouseMove={handleZoomMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
          className={cn(
            "relative aspect-3/4 overflow-hidden bg-secondary",
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
          )}
        >
          <Image
            src={gallery[active]}
            alt={name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-200 ease-out"
            style={
              isZoomed
                ? {
                    transform: `scale(${ZOOM_SCALE})`,
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }
                : undefined
            }
            priority
          />
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-background/90 px-2 py-1 text-xs font-medium text-foreground">
            {isZoomed ? <ZoomOut className="size-3.5" /> : <ZoomIn className="size-3.5" />}
            {isZoomed ? "Thu nhỏ" : "Phóng to"}
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
