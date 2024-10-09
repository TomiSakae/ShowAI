import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import NavFooter from "@/components/NavFooter";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ShowAI",
  description: "Giới thiệu các trang web AI nhằm hỗ trợ việc tìm kiếm AI phục vụ cho công việc hằng ngày.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavFooter>{children}</NavFooter>
        <Script
          src="/live2d/core/live2dcubismcore.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/live2d/core/live2d.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
