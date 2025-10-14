"use client";
import {
  WalletProvider,
  type AuthConfig,
} from "@web3-university/uni-wallet-lib";
import type { ReactNode } from "react";

import Header from "@/components/layout/Header";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function Providers({ children }: { children: ReactNode }) {
  if (!projectId) {
    console.warn(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID 未配置，钱包功能可能无法使用",
    );
  }

  const authConfig: AuthConfig = {
    // TODO: 配置 auth 相关参数
    /** 配置接口域名 */
    domain: "",
    /** 接口base url */
    apiBaseUrl: "",
    /** 配置localstorage存储token的key */
    tokenStorageKey: "",
    /** 是否链接钱包后自动签名 */
    autoSignOnConnect: false,
  };

  return (
    <WalletProvider
      appName="Web3 University"
      projectId={projectId ?? "demo"}
      enableAuth={false}
      authConfig={authConfig}
    >
      <>
        <Header />
        {children}
      </>
    </WalletProvider>
  );
}
