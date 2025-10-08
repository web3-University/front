import {
  useAccount,
  useBalance,
  useChainId,
  useEnsName,
  useChains,
} from "wagmi";
import { formatEther } from "viem";

export function useWalletInfo() {
  const { address, connector, isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const chain = chains.find((c) => c.id === chainId);
  const { data: ensName } = useEnsName({ address });
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address,
  });

  const formattedBalance = balance
    ? {
        value: balance.value,
        formatted: formatEther(balance.value),
        symbol: balance.symbol,
        decimals: balance.decimals,
      }
    : undefined;

  return {
    address,
    isConnected,
    ensName,
    chainId,
    connector: connector
      ? {
          id: connector.id,
          name: connector.name,
          type: connector.type,
          icon: connector.icon,
        }
      : undefined,
    chain,
    balance: formattedBalance,
    isBalanceLoading,
  };
}
