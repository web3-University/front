"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMemo } from "react";
import { useAccount, useBalance, useChainId, useDisconnect } from "wagmi";

import { wagmiChains } from "@/lib/web3/config";
import { useWalletStore } from "@/store/wallet";

export function useWallet() {
  const profile = useWalletStore((state) => state.profile);
  const {
    address,
    chainId: accountChainId,
    status,
    isConnected,
  } = useAccount();
  const activeChainId = useChainId({ query: { enabled: isConnected } });
  const chainId = activeChainId ?? accountChainId;

  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    query: {
      enabled: isConnected && Boolean(address),
      staleTime: 10_000,
    },
  });

  const chain = useMemo(
    () => wagmiChains.find((item) => item.id === chainId),
    [chainId],
  );

  return {
    address,
    chain,
    chainId,
    status,
    isConnected,
    balance,
    balanceLoading,
    profile,
  };
}

export function useWalletActions() {
  const setProfile = useWalletStore((state) => state.setProfile);
  const { disconnectAsync, isPending: isDisconnecting } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  return {
    openConnectModal,
    isDisconnecting,
    disconnect: async () => {
      try {
        await disconnectAsync();
      } finally {
        setProfile(undefined);
      }
    },
    setProfile,
  };
}
