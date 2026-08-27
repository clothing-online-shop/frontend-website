"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroBanner } from "@/lib/shared-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AUTOPLAY_INTERVAL_MS = 4500;

export function BannerSlider({ banners }: { banners: HeroBanner[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const timer = setInterval(() => {
      if (isHoveringRef.current) return;
      api.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [api]);

  if (banners.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} className="basis-full pl-0">
              <div className="relative aspect-4/5 w-full overflow-hidden sm:aspect-16/9 lg:aspect-3/1">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                {/* Scrim tối phía dưới ảnh để chữ đè lên luôn đọc được kể cả trên ảnh sáng màu. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 p-6 text-white sm:max-w-md sm:gap-4 sm:p-10 lg:p-14">
                  <h2 className="font-heading text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-sm text-white/90 sm:text-base">{banner.subtitle}</p>
                  )}
                  {(banner.linkUrl || banner.ctaLinkUrl) && (
                    <div className="flex w-full flex-col gap-2.5 pt-1 sm:w-auto sm:flex-row">
                      {banner.linkUrl && (
                        <Button
                          size="lg"
                          className="h-11 w-full px-6 sm:w-auto"
                          nativeButton={false}
                          render={<Link href={banner.linkUrl} />}
                        >
                          Mua ngay
                        </Button>
                      )}
                      {banner.ctaLinkUrl && (
                        <Button
                          size="lg"
                          variant="outline"
                          className="h-11 w-full border-white/70 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                          nativeButton={false}
                          render={<Link href={banner.ctaLinkUrl} />}
                        >
                          {banner.ctaLabel || "Xem thêm"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Xem banner ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
