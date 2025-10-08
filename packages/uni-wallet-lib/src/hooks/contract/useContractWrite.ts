import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type {
  UseWriteContractReturnType,
  UseWaitForTransactionReceiptReturnType,
} from "wagmi";
import type { Address, Abi, Hash } from "viem";

interface UseContractWriteProps {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: unknown[];
  value?: bigint;
  chainId?: number;
  enabled?: boolean;
  gasLimit?: bigint;
}

interface WriteOverrides {
  args?: unknown[];
  value?: bigint;
  gas?: bigint;
}

export type { WriteOverrides };

type UseContractWriteReturn = Omit<
  UseWriteContractReturnType,
  "writeContract" | "writeContractAsync"
> & {
  receipt: UseWaitForTransactionReceiptReturnType;
  write: (overrides?: WriteOverrides) => void;
  writeAsync: (overrides?: WriteOverrides) => Promise<Hash | undefined>;
};

export function useContractWrite({
  address,
  abi,
  functionName,
  args,
  value,
  chainId,
  enabled = true,
  gasLimit,
}: UseContractWriteProps): UseContractWriteReturn {
  const { writeContract, writeContractAsync, ...returnTypes } =
    useWriteContract();

  const receipt = useWaitForTransactionReceipt({
    hash: returnTypes.data,
    query: {
      enabled: !!returnTypes.data, // 只在有 hash 时才开始监听
    },
  });

  const write = (overrides?: WriteOverrides) => {
    if (!enabled) return;
    writeContract({
      address,
      abi,
      functionName,
      args: overrides?.args || args,
      value: overrides?.value || value,
      chainId,
      gas: overrides?.gas || gasLimit,
    });
  };

  const writeAsync = async (overrides?: WriteOverrides) => {
    if (!enabled) return;
    return await writeContractAsync({
      address,
      abi,
      functionName,
      args: overrides?.args || args,
      value: overrides?.value || value,
      chainId,
      gas: overrides?.gas || gasLimit,
    });
  };

  return {
    write,
    writeAsync,
    receipt,
    ...returnTypes,
  };
}
