// apps/web/src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { ToastContainer } from "@/components/Toast/Toast";
import { Providers } from "./providers";

import { PrefetchManager } from "@/components/PrefetchManager";
import { PrefetchMonitor } from "@/components/PrefetchMonitor";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getServerMessages, getServerTranslator } from "@/i18n/server";

// ⭐ 移动端适配：Viewport 配置
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 防止双击缩放
  viewportFit: "cover", // 适配刘海屏
  themeColor: "#FDFBFF",
};

// SEO 元数据
export async function generateMetadata(): Promise<Metadata> {
  const translator = await getServerTranslator("metadata");
  const keywords = translator("keywords")
    .split(",")
    .map((word) => word.trim());

  return {
    title: translator("title"),
    description: translator("description"),
    keywords,
  };
}

// 根布局组件，定义HTML结构和全局样式
export default function RootLayout({ children }: { children: ReactNode }) {
  const { locale, messages } = getServerMessages();

  return (
    <html lang={locale}>
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
        <I18nProvider locale={locale} messages={messages}>
          {/* 预加载管理器 */}
          <PrefetchManager />

          {/* 预加载监控器 - 仅在开发环境显示 */}
          {process.env.NODE_ENV === "development" && <PrefetchMonitor />}

          {/* 全局柔光背景 - 响应式调整 */}
          <div className="pointer-events-none fixed inset-0 -z-10">
            {/* 左上角光晕 - 移动端缩小 */}
            <div className="absolute -left-[15%] top-[-10%] h-[20rem] w-[20rem] rounded-full bg-[#E6D8FF] opacity-80 blur-[100px] md:h-[34rem] md:w-[34rem] md:blur-[140px]" />

            {/* 右下角光晕 - 移动端缩小 */}
            <div className="absolute right-[-12%] bottom-[-18%] h-[18rem] w-[18rem] rounded-full bg-[#FFE6CF] opacity-80 blur-[100px] md:h-[32rem] md:w-[32rem] md:blur-[140px]" />

            {/* 中间光晕 - 移动端缩小 */}
            <div className="absolute left-[35%] top-[12%] h-[16rem] w-[16rem] rounded-full bg-[#E0F2FF] opacity-60 blur-[80px] md:h-[26rem] md:w-[26rem] md:blur-[120px]" />
          </div>

          <Providers>{children}</Providers>
          <ToastContainer />
        </I18nProvider>
      </body>
    </html>
  );
}
