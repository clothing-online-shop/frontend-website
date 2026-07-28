import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const fontHeading = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
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
