import { http, createStorage, cookieStorage } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { supportedChains } from "./chains";

export interface WalletConfigOptions {
  appName: string;
  projectId: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
}

export function createWalletConfig(options: WalletConfigOptions) {
  const {
    appName = "APP_NAME", // 传给 coinbaseWallet
    projectId = "YOUR_PROJECT_ID", // 传给 walletConnect
    alchemyApiKey,
    infuraApiKey,
  } = options;

  // 创建传输层配置
  const transports = supportedChains.reduce(
    (acc, chain) => {
      let rpcUrl = "";

      if (alchemyApiKey) {
        // 使用链名称构建 Alchemy URL
        const chainName = chain.name.toLowerCase().replace(/\s+/g, "-");
        rpcUrl = `https://${chainName}.g.alchemy.com/v2/${alchemyApiKey}`;
      }

      if (infuraApiKey) {
        // 使用链名称构建 Infura URL
        const chainName = chain.name.toLowerCase().replace(/\s+/g, "-");
        rpcUrl = `https://${chainName}.infura.io/v3/${infuraApiKey}`;
      }

      acc[chain.id] = rpcUrl ? http(rpcUrl) : http();
      return acc;
    },
    {} as Record<number, ReturnType<typeof http>>,
  );

  const config = getDefaultConfig({
    appName,
    projectId,
    chains: supportedChains,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });

  return {
    config,
    transports,
  };
}
