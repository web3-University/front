import { mainnet, sepolia } from "wagmi/chains";
import type { Chain } from "viem";

// Hardhat 本地节点配置
export const hardhat: Chain = {
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  testnet: true,
};

export const supportedChains: readonly [Chain, ...Chain[]] = [
  mainnet,
  sepolia,
  hardhat,
] as const;

export const defaultChain = mainnet;

export const chainIcons: Record<number, string> = {
  [mainnet.id]: "🔷",
  [sepolia.id]: "🔷",
  [hardhat.id]: "🛠️",
};

export const getChainIcon = (chainId: number): string => {
  return chainIcons[chainId] || "⛓️";
};
