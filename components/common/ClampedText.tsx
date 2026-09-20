"use client";

import { useRef, useState, type ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Text bị cắt "…" bằng CSS (truyền line-clamp-N qua className) + tooltip hiện đủ nội dung khi
// hover. Chỉ biết có bị cắt hay không lúc hover (scrollHeight > clientHeight) nên chỉ mở
// tooltip khi thật sự bị cắt — text ngắn hiển thị đủ rồi thì không lặp lại trong tooltip.
// `render` là phần tử thật được render (h1, Link...) để giữ đúng ngữ nghĩa/điều hướng.
export function ClampedText({
  text,
  render,
  className,
}: {
  text: string;
  render: ReactElement;
  className?: string;
}) {
  // Trigger của base-ui khai ref là HTMLButtonElement dù `render` có thể là h1/a — chỉ dùng
  // scrollHeight/clientHeight (có ở mọi HTMLElement) nên kiểu này không ảnh hưởng gì.
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    const el = ref.current;
    setOpen(next && !!el && el.scrollHeight > el.clientHeight);
  }

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger ref={ref} render={render} className={className}>
        {text}
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
