import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage } from "wagmi";
import { arbitrum, mainnet, polygon, sepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    "[wallet] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID 未配置，WalletConnect 功能将不可用。",
  );
}

export const wagmiChains = [mainnet, polygon, arbitrum, sepolia];

export const wagmiConfig = getDefaultConfig({
  appName: "Web3 School Dapp",
  projectId: projectId ?? "demo", // demo 仅用于开发，生产环境请替换
  chains: wagmiChains,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
