import { useReadContract } from "wagmi";
import type { UseReadContractReturnType } from "wagmi";
import { type Address, type Abi } from "viem";

interface UseContractReadProps {
  address: Address; // 合约地址
  abi: Abi; // 合约 ABI (应用二进制接口)
  functionName: string; // 要调用的函数名
  args?: unknown[]; // 函数参数数组
  chainId?: number; // 链ID
  enabled: boolean; // 是否启用查询
  cacheTime?: number; // 缓存时间
  staleTime?: number; // 数据过期暗
}

export type UseContractReadReturn<T> = Omit<
  UseReadContractReturnType,
  "data"
> & { data: T };

export function useContractRead<T = unknown>({
  address,
  abi,
  functionName,
  args,
  chainId,
  enabled = true,
  cacheTime = 0,
  staleTime = 0,
}: UseContractReadProps): UseContractReadReturn<T> {
  const { data, ...result } = useReadContract({
    address,
    abi,
    functionName,
    args,
    chainId,
    query: {
      enabled,
      gcTime: cacheTime,
      staleTime,
    },
  });

  return {
    data: data as T,
    ...result,
  };
}
