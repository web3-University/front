import React from "react";
import {
  State,
  Config,
  UseWaitForTransactionReceiptReturnType,
  UseReadContractReturnType,
} from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import * as viem from "viem";
import { Address, Chain, Abi, Hash, TransactionReceipt } from "viem";

interface WalletConfigOptions {
  appName: string;
  projectId: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
}

interface WalletProviderProps extends WalletConfigOptions {
  children: React.ReactNode;
  theme?: "light" | "dark" | "auto";
  queryClient?: QueryClient;
  initialState?: State | undefined;
}
declare function WalletProvider({
  children,
  theme,
  queryClient,
  initialState,
  ...configOptions
}: WalletProviderProps): React.ReactElement;

interface WalletState {
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
interface WalletError {
  code: number;
  message: string;
  data?: unknown;
}
interface NetworkSwitchOptions {
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

interface ContractConfig {
  address: Address;
  abi: Abi;
  chainId?: number;
}
interface ERC20TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: bigint;
}
interface ERC721TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  totalSupply?: bigint;
}
interface TokenBalance {
  value: bigint;
  formatted: string;
  symbol: string;
  totalSupply?: bigint;
}
interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface TransactionRequest {
  to?: string;
  value?: bigint;
  data?: string;
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}
interface TransactionStatus {
  hash: Hash;
  status: "pending" | "success" | "failed" | "replaced";
  confirmations: number;
  receipt?: TransactionReceipt;
  error?: Error;
}
interface GasEstimate {
  gasLimit: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedCost: bigint;
}
interface TransactionHistory {
  hash: Hash;
  from: string;
  to?: string;
  value: bigint;
  timestamp: number;
  status: "pending" | "success" | "failed";
  gasUsed?: bigint;
  gasPrice?: bigint;
  blockNumber?: number;
}

declare function useWalletConnection(): WalletState & {
  connect: (connectorId?: string) => void;
  reconnect: (config: Config | undefined) => void;
  disconnect: () => void;
};

declare function useWalletInfo(): {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  ensName: viem.GetEnsNameReturnType | undefined;
  chainId: number;
  connector:
    | {
        id: string;
        name: string;
        type: string;
        icon: string | undefined;
      }
    | undefined;
  chain: viem.Chain | undefined;
  balance:
    | {
        value: bigint;
        formatted: string;
        symbol: string;
        decimals: number;
      }
    | undefined;
  isBalanceLoading: boolean;
};

declare function useNetworkSwitch(): {
  currentChain: Chain | undefined;
  switchToNetwork: (options: NetworkSwitchOptions) => void;
  isPending: boolean;
  error: Error | null;
  isSuccess: boolean;
  reset: () => void;
  isCurrentChain: (chainId: number) => boolean;
  canSwitchNetwork: boolean;
};

interface UseERC20Props {
  address: Address;
  spenderAddress?: Address;
  enabled?: boolean;
}
declare function useERC20({
  address,
  spenderAddress,
  enabled,
}: UseERC20Props): {
  totalSupply: bigint;
  balance: bigint;
  allowance: bigint;
  transferReceipt: UseWaitForTransactionReceiptReturnType;
  approveReceipt: UseWaitForTransactionReceiptReturnType;
  transferFromReceipt: UseWaitForTransactionReceiptReturnType;
  refetchBalance: () => void;
  refetchAllowance: () => void;
  transfer: (to: Address, amount: string) => Promise<any>;
  approve: (spender: Address, amount: string) => Promise<any>;
  transferFrom: (from: Address, to: Address, amount: string) => Promise<any>;
};

interface UseSimpleYDTokenProps {
  address?: Address;
  spenderAddress?: Address;
  enabled?: boolean;
}
declare function useSimpleYDToken({
  address,
  spenderAddress,
  enabled,
}: UseSimpleYDTokenProps): {
  totalSupply: bigint;
  balance: bigint;
  allowance: bigint;
  transferReceipt: UseWaitForTransactionReceiptReturnType;
  approveReceipt: UseWaitForTransactionReceiptReturnType;
  transferFromReceipt: UseWaitForTransactionReceiptReturnType;
  refetchBalance: () => void;
  refetchAllowance: () => void;
  transfer: (to: Address, amount: string) => Promise<any>;
  approve: (spender: Address, amount: string) => Promise<any>;
  transferFrom: (from: Address, to: Address, amount: string) => Promise<any>;
  exchangeETHForTokens: (ether: string) => Promise<any>;
};

type UseContractReadReturn<T> = Omit<UseReadContractReturnType, "data"> & {
  data: T;
};

/**
 * 课程信息结构体
 */
interface Course {
  id: bigint;
  title: string;
  instructor: Address;
  price: bigint;
  isPublished: boolean;
}
interface UseCourseContractProps {
  address: Address;
  tokenDecimals: number;
}
declare function useCourseContract({
  address,
  tokenDecimals,
}: UseCourseContractProps): {
  createCourseReceipt: UseWaitForTransactionReceiptReturnType;
  purchaseCourseReceipt: UseWaitForTransactionReceiptReturnType;
  hasAccess: (
    studentAddress?: Address,
    courseId?: bigint,
  ) => UseContractReadReturn<boolean>;
  getCourse: (courseId?: bigint) => UseContractReadReturn<Course>;
  getStudentCourses: (
    studentAddress: Address,
  ) => UseContractReadReturn<bigint[]>;
  getCourseStudents: (courseId: bigint) => UseContractReadReturn<Address[]>;
  getInstructorCourses: (
    instructorAddress: Address,
  ) => UseContractReadReturn<bigint[]>;
  getTotalCourses: () => UseContractReadReturn<bigint>;
  getCourseStudentCount: (courseId: bigint) => UseContractReadReturn<bigint>;
  batchCheckAccess: (
    student: Address,
    courseIds: bigint[],
  ) => UseContractReadReturn<boolean[]>;
  createCourse: (
    title: string,
    instructor: Address,
    price: string,
  ) => Promise<any>;
  purchaseCourse: (courseId: bigint) => Promise<any>;
};

interface WalletButtonProps {
  label?: string;
  showBalance?: boolean;
  showChainName?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}
declare const WalletButton: React.FC<WalletButtonProps>;

export {
  WalletButton,
  WalletProvider,
  useCourseContract,
  useERC20,
  useNetworkSwitch,
  useSimpleYDToken,
  useWalletConnection,
  useWalletInfo,
};
export type {
  ContractConfig,
  ERC20TokenInfo,
  ERC721TokenInfo,
  GasEstimate,
  NFTMetadata,
  NetworkSwitchOptions,
  TokenBalance,
  TransactionHistory,
  TransactionRequest,
  TransactionStatus,
  WalletButtonProps,
  WalletError,
  WalletProviderProps,
  WalletState,
};
