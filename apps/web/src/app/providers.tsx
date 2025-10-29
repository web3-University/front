// apps/web/src/app/providers.tsx
"use client";
import {
  WalletProvider,
  type AuthConfig,
} from "@web3-university/uni-wallet-lib";
import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav"; // ⭐ 新增移动端底部导航

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function Providers({ children }: { children: ReactNode }) {
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
      <Header />

      {/* 主内容区域 - 响应式内边距 */}
      <main className="min-h-screen pt-20 pb-20 md:pt-24 md:pb-8 lg:pb-8">
        {children}
      </main>

      {/* 移动端底部导航 - 仅在小屏幕显示 */}
      <BottomNav />
    </WalletProvider>
  );
}
