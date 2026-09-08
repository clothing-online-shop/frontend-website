import type { Metadata } from "next";
import { Paytone_One, SN_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Paytone One chỉ dùng cho title lớn (class font-heading, xem globals.css) — chỉ có 1
// weight 400 (font display, không có bản đậm/nghiêng riêng).
const fontHeading = Paytone_One({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-heading",
});

// SN Pro dùng cho phần chữ còn lại (body + title nhỏ) — font mặc định của toàn site qua
// --font-sans (xem globals.css). Variable font nên load "variable" thay vì liệt kê từng
// weight, vẫn dùng được mọi class font-normal/medium/semibold/bold/extrabold sẵn có.
const fontBody = SN_Pro({
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Clothing Shop",
  description: "Website bán quần áo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}>
      {/* suppressHydrationWarning: chỉ nuốt cảnh báo mismatch NGAY TRÊN <body> — 1 số
          extension trình duyệt (vd ColorZilla) tự chèn thuộc tính lạ (cz-shortcut-listen)
          vào body trước khi React hydrate xong, gây warning giả, không phải bug thật của
          app. Không ẩn được các mismatch khác (chỉ áp dụng cho phần tử này). */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
