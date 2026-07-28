"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return <div className="aspect-3/4 rounded-xl bg-secondary" />;
  }

  return (
    <div>
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-secondary">
        <Image
          src={gallery[active]}
          alt={name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {gallery.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-3/4 overflow-hidden rounded-lg border transition-colors",
                index === active ? "border-foreground" : "border-border",
              )}
            >
              <Image src={src} alt="" fill sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
