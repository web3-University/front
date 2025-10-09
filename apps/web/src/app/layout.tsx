import "./globals.css";
import type { ReactNode } from "react";

import { Providers } from "./providers";

import { PrefetchManager } from "@/components/PrefetchManager";
import { PrefetchMonitor } from "@/components/PrefetchMonitor";

// 根布局组件，定义HTML结构和全局样式
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* DNS 预解析 - 提前解析这些域名，加快后续资源加载 */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />

        {/* 预连接重要域名 - 建立早期连接 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body
        suppressHydrationWarning
        className="relative min-h-screen bg-[#FDFBFF] text-[#2A2742] antialiased"
      >
        {/* 预加载管理器 - 智能预加载页面 与 Next.js Link prefetch  选一； <front/apps/web/src/components/layout/Header.tsx>  */}
        <PrefetchManager />

        {/* 预加载监控器 - 仅在开发环境显示 */}
        {process.env.NODE_ENV === "development" && <PrefetchMonitor />}

        {/* 全局柔光背景 */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-[15%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-[#E6D8FF] opacity-80 blur-[140px]" />
          <div className="absolute right-[-12%] bottom-[-18%] h-[32rem] w-[32rem] rounded-full bg-[#FFE6CF] opacity-80 blur-[140px]" />
          <div className="absolute left-[35%] top-[12%] h-[26rem] w-[26rem] rounded-full bg-[#E0F2FF] opacity-60 blur-[120px]" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
