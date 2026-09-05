import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Đăng ký text-size-* (bộ font-size dùng chung, app/globals.css) vào cùng nhóm
// font-size của Tailwind — nếu không, twMerge không biết text-size-14 và text-sm
// xung đột nên giữ lại cả 2 class, kết quả phụ thuộc thứ tự CSS sinh ra thay vì
// className đứng sau thắng như mong đợi.
const FONT_SIZES = [46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 19, 18, 16, 15, 14, 13, 12]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES.map((size) => `size-${size}`) }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
