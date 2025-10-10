"use client";

import { WalletProvider } from "@web3-university/uni-wallet-lib";
import type { ReactNode } from "react";

import Header from "@/components/layout/Header";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function Providers({ children }: { children: ReactNode }) {
  if (!projectId) {
    console.warn(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID 未配置，钱包功能可能无法使用",
    );
  }

  return (
    <WalletProvider appName="Web3 University" projectId={projectId ?? "demo"}>
      <Header />
      {children}
    </WalletProvider>
  );
}
