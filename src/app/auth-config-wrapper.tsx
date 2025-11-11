"use client";

import {
  type AuthConfig,
  User,
  WalletProvider,
} from "@web3-university/uni-wallet-lib";
import { ReactNode } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export interface AuthStoreType {
  token?: string;
  user?: User;
}
export const AuthAtom = atomWithStorage<AuthStoreType | undefined>(
  "AUTH_ATOM",
  undefined,
);

export const useAuthAtom = (): AuthStoreType => {
  return useAtomValue(AuthAtom) || { token: undefined, user: undefined };
};

export default function AuthConfigWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const setAuthAtom = useSetAtom(AuthAtom);

  const authConfig: AuthConfig = {
    domain: "http://localhost:3000",
    apiBaseUrl: "/api/v1/auth",
    tokenStorageKey: "AUTH_TOKEN",
    autoSignOnConnect: true,
    onSuccess: (token, user) => {
      console.log("🎉 签名 & 登录成功", { token, user });
      setAuthAtom({
        token,
        user,
      });
    },
  };

  return (
    <WalletProvider
      appName="Web3 University"
      projectId={projectId ?? "demo"}
      enableAuth={true}
      authConfig={authConfig}
    >
      {children}
    </WalletProvider>
  );
}
