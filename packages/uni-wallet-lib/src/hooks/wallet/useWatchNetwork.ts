import { useEffect, useCallback } from "react";
import { useChainId, useAccount } from "wagmi";

export interface NetworkChangeHandler {
  onNetworkChange?: (chainId: number) => void;
  onAccountChange?: (address: string | undefined) => void;
}

/**
 * 监听网络和账户变化的 Hook
 *
 * 当用户在 MetaMask 等钱包中切换网络或账户时，会自动触发回调
 *
 * @example
 * ```tsx
 * useWatchNetwork({
 *   onNetworkChange: (chainId) => {
 *     console.log('网络切换到:', chainId);
 *     // 重新获取数据或更新 UI
 *   },
 *   onAccountChange: (address) => {
 *     console.log('账户切换到:', address);
 *   }
 * });
 * ```
 */
export function useWatchNetwork({
  onNetworkChange,
  onAccountChange,
}: NetworkChangeHandler = {}) {
  const chainId = useChainId();
  const { address } = useAccount();

  // 监听网络变化
  useEffect(() => {
    if (onNetworkChange && chainId) {
      console.log(`🔄 Network changed to chainId: ${chainId}`);
      onNetworkChange(chainId);
    }
  }, [chainId, onNetworkChange]);

  // 监听账户变化
  useEffect(() => {
    if (onAccountChange) {
      console.log(`🔄 Account changed to: ${address || "disconnected"}`);
      onAccountChange(address);
    }
  }, [address, onAccountChange]);

  return {
    currentChainId: chainId,
    currentAddress: address,
  };
}
