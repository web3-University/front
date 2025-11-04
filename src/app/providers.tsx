// apps/web/src/app/providers.tsx
"use client";
import {
  type AuthConfig,
  WalletProvider,
} from "@web3-university/uni-wallet-lib";
import type { ReactNode } from "react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import BottomNav from "@/components/layout/BottomNav"; // ⭐ 新增移动端底部导航
import Header from "@/components/layout/Header";
import LanguageSwitch from "@/components/layout/LanguageSwitch";
import { usePathname } from "@/navigation";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (!projectId) {
    console.warn(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID 未配置，钱包功能可能无法使用",
    );
  }

  const authConfig: AuthConfig = {
    domain: "http://192.168.6.179:3000",
    apiBaseUrl: "/api/v1/auth",
    tokenStorageKey: "AUTH_TOKEN",
    autoSignOnConnect: true,
  };

  return (
    <WalletProvider
      appName="Web3 University"
      projectId={projectId ?? "demo"}
      enableAuth={true}
      authConfig={authConfig}
    >
      {/* Header - 固定在顶部 */}
      <ErrorBoundary
        fallback={
          <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-6">
            <div className="h-16 w-full max-w-[1280px] rounded-2xl bg-white/70 px-6 shadow-[0_24px_60px_rgba(154,161,255,0.12)] ring-1 ring-white/50 md:h-16">
              <div className="flex h-full items-center justify-center text-sm text-[#6A6D94]">
                顶部导航暂时不可用
              </div>
            </div>
          </div>
        }
      >
        <Header />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <LanguageSwitch />
      </ErrorBoundary>

      {/* 主内容区域 - 响应式内边距 */}
      <main className="min-h-screen pt-20 pb-20 md:pt-24 md:pb-8 lg:pb-8">
        <ErrorBoundary
          key={pathname}
          fallback={
            <div className="mx-auto max-w-[960px] rounded-2xl bg-white/80 p-8 text-center text-[#2B2558] shadow-[0_24px_60px_rgba(154,161,255,0.12)] ring-1 ring-white/50">
              <h2 className="text-xl font-semibold">内容暂时不可用</h2>
              <p className="mt-2 text-sm text-[#6A6D94]">
                我们已记录这个错误，请稍后再试。
              </p>
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      </main>

      {/* 移动端底部导航 - 仅在小屏幕显示 */}
      <ErrorBoundary
        fallback={
          <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
            <div className="h-16 w-full max-w-[640px] rounded-2xl bg-white/70 px-6 shadow-[0_-18px_40px_rgba(162,167,255,0.18)] ring-1 ring-white/50 md:hidden">
              <div className="flex h-full items-center justify-center text-sm text-[#6A6D94]">
                底部导航暂时不可用
              </div>
            </div>
          </div>
        }
      >
        <BottomNav />
      </ErrorBoundary>
    </WalletProvider>
  );
}
