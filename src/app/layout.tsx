import "./globals.css";
import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { PrefetchManager } from "@/components/PrefetchManager";
import { PrefetchMonitor } from "@/components/PrefetchMonitor";
import { ToastContainer } from "@/components/Toast/Toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FDFBFF",
};

export const metadata: Metadata = {
  title: "WEB3大学 - 去中心化教育平台",
  description: "去中心化学习，获得 NFT 证书",
  keywords: ["Web3", "区块链", "在线教育", "NFT", "去中心化"],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();

  console.log("[RootLayout] resolved locale", locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="relative min-h-screen bg-[#FDFBFF] text-[#2A2742] antialiased">
        <PrefetchManager />
        {process.env.NODE_ENV === "development" && <PrefetchMonitor />}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-[15%] top-[-10%] h-[20rem] w-[20rem] rounded-full bg-[#E6D8FF] opacity-80 blur-[100px] md:h-[34rem] md:w-[34rem] md:blur-[140px]" />
          <div className="absolute right-[-12%] bottom-[-18%] h-[18rem] w-[18rem] rounded-full bg-[#FFE6CF] opacity-80 blur-[100px] md:h-[32rem] md:w-[32rem] md:blur-[140px]" />
          <div className="absolute left-[35%] top-[12%] h-[16rem] w-[16rem] rounded-full bg-[#E0F2FF] opacity-60 blur-[80px] md:h-[26rem] md:w-[26rem] md:blur-[120px]" />
        </div>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
