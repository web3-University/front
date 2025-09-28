import "./globals.css";
import type { ReactNode } from "react";
// 根布局组件，定义HTML结构和全局样式
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="relative min-h-screen bg-[#FDFBFF] text-[#2A2742] antialiased">
        {/* 全局柔光背景 */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-[15%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-[#E6D8FF] opacity-80 blur-[140px]" />
          <div className="absolute right-[-12%] bottom-[-18%] h-[32rem] w-[32rem] rounded-full bg-[#FFE6CF] opacity-80 blur-[140px]" />
          <div className="absolute left-[35%] top-[12%] h-[26rem] w-[26rem] rounded-full bg-[#E0F2FF] opacity-60 blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
