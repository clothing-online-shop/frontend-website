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
              {/* 2 cột đứng cạnh nhau (không còn chữ đè lên ảnh kiểu absolute nữa) — trái 40%
                  nền trắng chứa chữ/nút, phải 60% là ảnh banner, cùng chiều cao (lg:h-full ở
                  cột ảnh ăn theo chiều cao cột chữ, xem lg:items-stretch trên container). */}
              <div className="flex flex-col lg:h-[600px] lg:flex-row lg:items-stretch">
                <div className="flex flex-col items-start justify-center gap-2 bg-white p-6 sm:gap-3 sm:p-10 lg:w-[40%] lg:shrink-0 lg:p-14">
                  {banner.eyebrow && (
                    <p className="text-xs font-semibold tracking-wide text-brand-38 uppercase">{banner.eyebrow}</p>
                  )}
                  <h2 className="font-heading text-size-24 leading-tight font-normal sm:text-size-32 lg:text-size-40 text-brand-10">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-size-14 text-neutral-3F3A34 sm:text-size-16">{banner.description}</p>
                  )}
                  {(banner.linkUrl || banner.ctaLinkUrl) && (
                    <div className="mt-2 flex w-full flex-col gap-2.5 sm:mt-3 sm:w-auto sm:flex-row">
                      {banner.linkUrl && (
                        <Button
                          variant="dark"
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
                          className="h-11 w-full border-brand-10 text-brand-10 rounded-none bg-transparent px-6 hover:bg-white/10 sm:w-auto"
                          nativeButton={false}
                          render={<Link href={banner.ctaLinkUrl} />}
                        >
                          {banner.ctaLabel || "Xem thêm"}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Dot phân trang đặt ngay dưới nút, trong cột chữ — nền giờ là trắng (không
                      còn đè lên ảnh) nên đổi màu dot sang tối thay vì trắng như bản cũ. */}
                  <div className="mt-4 flex items-center gap-2">
                    {banners.map((dotBanner, dotIndex) => (
                      <button
                        key={dotBanner.id}
                        type="button"
                        aria-label={`Xem banner ${dotIndex + 1}`}
                        onClick={() => api?.scrollTo(dotIndex)}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          dotIndex === selectedIndex ? "w-6 bg-brand-10" : "w-1.5 bg-brand-10/25",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative aspect-4/5 w-full overflow-hidden sm:aspect-16/9 lg:aspect-auto lg:h-full lg:flex-1">
                  <Image
                    src={banner.imageUrl}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden left-4 lg:flex" />
        <CarouselNext className="hidden right-4 lg:flex" />
      </Carousel>
    </div>
  );
}
