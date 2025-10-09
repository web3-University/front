import type { Address, Chain } from "viem";

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  address?: Address;
  connector?: {
    id: string;
    name: string;
    type: string;
  };
  chain?: Chain;
  chains: readonly Chain[];
}

export interface WalletError {
  code: number;
  message: string;
  data?: unknown;
}

export interface NetworkSwitchOptions {
  chainId: number;
  addChainParameter?: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[];
  };
}
