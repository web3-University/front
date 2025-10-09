import { useSwitchChain, useChains, useChainId } from "wagmi";
import type { Chain } from "viem";
import type { NetworkSwitchOptions } from "../../types";

export function useNetworkSwitch(): {
  currentChain: Chain | undefined;
  switchToNetwork: (options: NetworkSwitchOptions) => void;
  isPending: boolean;
  error: Error | null;
  isSuccess: boolean;
  reset: () => void;
  isCurrentChain: (chainId: number) => boolean;
  canSwitchNetwork: boolean;
} {
  const chains = useChains();
  const chainId = useChainId();

  const currentChain = chains.find((c) => c.id === chainId);

  const { switchChain, isPending, error, isSuccess, reset } = useSwitchChain();

  const switchToNetwork = (options: NetworkSwitchOptions) => {
    if (!switchChain) {
      throw new Error("❌Network switching not supported");
    }

    try {
      switchChain({ chainId: options.chainId });
    } catch (error) {
      console.error("Failed to switch network:", error);
      throw error;
    }
  };

  const isCurrentChain = (_chainId: number) => {
    return chainId === _chainId;
  };

  return {
    currentChain,
    switchToNetwork,
    isPending,
    error,
    isSuccess,
    reset,
    isCurrentChain,
    canSwitchNetwork: !!switchChain,
  };
}
