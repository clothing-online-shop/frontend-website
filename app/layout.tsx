import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Đổi theo yêu cầu: Lora (serif) dùng cho TOÀN BỘ site, không chỉ heading/logo nữa — bỏ
// Mulish (trước đây là --font-body, không còn nơi nào dùng riêng nữa sau khi --font-sans
// ở globals.css trỏ thẳng sang --font-heading, xem comment ở đó).
const fontHeading = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
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
    <html lang="vi" className={`${fontHeading.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
