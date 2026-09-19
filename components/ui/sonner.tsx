"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

// Thời gian toast tự tắt — cũng là thời lượng chạy của thanh tiến trình (biến CSS --toast-duration
// bên dưới, xem .app-toast trong globals.css), nên 2 nơi luôn khớp nhau. Toast nào truyền
// duration riêng thì phải truyền kèm style "--toast-duration" tương ứng, nếu không thanh sẽ lệch.
export const TOAST_DURATION_MS = 3000

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={TOAST_DURATION_MS}
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--brand-10)",
          "--normal-border": "var(--neutral-E0DDDA)",
          "--border-radius": "0px",
          "--toast-duration": `${TOAST_DURATION_MS}ms`,
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "app-toast",
          title: "text-size-14 font-medium",
          description: "text-size-13 text-neutral-68625C",
          actionButton: "app-toast-action",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
