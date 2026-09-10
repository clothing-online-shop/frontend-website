import type { Metadata } from "next";
import { Lora, SN_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Lora chỉ dùng cho title lớn (class font-heading, xem globals.css) — variable font nên
// load "variable" thay vì 1 weight cố định, để các class font-normal/semibold/extrabold
// đang dùng sẵn trên font-heading (ví dụ ReviewSummaryCard, StatusPage) render đúng đậm nhạt
// thay vì browser fake-bold.
const fontHeading = Lora({
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  style: ["normal", "italic"],
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
