import React from "react";
import { WagmiProvider, type State } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWalletConfig, type WalletConfigOptions } from "../config/wagmi";
import { customDarkTheme } from "../config/rainbowkit";
import { AuthProvider } from "./AuthProvider";
import type { AuthConfig } from "../types/auth";
import "@rainbow-me/rainbowkit/styles.css";

export interface WalletProviderProps extends WalletConfigOptions {
  children: React.ReactNode;
  theme?: "light" | "dark" | "auto";
  queryClient?: QueryClient;
  initialState?: State | undefined;
  // 认证配置(可选)
  enableAuth?: boolean;
  authConfig?: AuthConfig;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function WalletProvider({
  children,
  theme = "auto",
  queryClient = defaultQueryClient,
  initialState,
  enableAuth = false,
  authConfig,
  ...configOptions
}: WalletProviderProps): React.ReactElement {
  const { config: wagmiConfig } = React.useMemo(
    () => createWalletConfig(configOptions),
    [
      configOptions.appName,
      configOptions.projectId,
      configOptions.alchemyApiKey,
      configOptions.infuraApiKey,
    ],
  );

  const rainbowKitTheme = React.useMemo(() => {
    return customDarkTheme;
  }, [theme]);

  // 根据 enableAuth 决定是否包裹 AuthProvider
  const content =
    enableAuth && authConfig ? (
      <AuthProvider {...authConfig}>{children}</AuthProvider>
    ) : (
      children
    );

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={true}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={rainbowKitTheme}
          modalSize="compact"
          showRecentTransactions={true}
        >
          {content}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
