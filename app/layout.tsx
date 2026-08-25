import type { Metadata } from "next";
import { Lora, Mulish } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Theo design Figma: Lora (serif) cho heading/logo, Mulish cho phần nội dung —
// cả hai đều có subset "vietnamese" đầy đủ (khác Instrument Serif/Sans trong Figma gốc).
const fontHeading = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});

const fontBody = Mulish({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
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
    <html
      lang="vi"
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
