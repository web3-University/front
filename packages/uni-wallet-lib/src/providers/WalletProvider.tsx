import React from "react";
import { WagmiProvider, type State } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWalletConfig, type WalletConfigOptions } from "../config/wagmi";
import { customDarkTheme } from "../config/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

export interface WalletProviderProps extends WalletConfigOptions {
  children: React.ReactNode;
  theme?: "light" | "dark" | "auto";
  queryClient?: QueryClient;
  initialState?: State | undefined;
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
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
