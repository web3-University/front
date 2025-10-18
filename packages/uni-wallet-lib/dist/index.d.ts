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
import * as _wagmi_core from "@wagmi/core";
import * as wagmi_query from "wagmi/query";

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

declare function useWalletSign(): {
  signMessage: wagmi_query.SignMessageMutate<unknown>;
  signMessageAsync: wagmi_query.SignMessageMutateAsync<unknown>;
  signature: `0x${string}` | undefined;
  error: _wagmi_core.SignMessageErrorType | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
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

type UseContractReadReturn<T> = Omit<UseReadContractReturnType, "data"> & {
  data: T;
};

type WriteReturnType = Hash | undefined;

interface UseSimpleYDTokenProps {
  address?: Address;
  spenderAddress?: Address;
  enabled?: boolean;
}
interface StakeInfo {
  amount: bigint;
  startTime: number;
  lockPeriod: number;
  rewardRate: number;
  lastClaimTime: number;
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
  exchangeETHForTokensReceipt: UseWaitForTransactionReceiptReturnType;
  stakeReceipt: UseWaitForTransactionReceiptReturnType;
  unstakeReceipt: UseWaitForTransactionReceiptReturnType;
  claimRewardReceipt: UseWaitForTransactionReceiptReturnType;
  refetchBalance: () => void;
  refetchAllowance: () => void;
  getStakeInfo: (user: Address) => UseContractReadReturn<StakeInfo>;
  calculatePendingReward: (user: Address) => UseContractReadReturn<bigint>;
  canUnstake: (user: Address) => UseContractReadReturn<boolean>;
  transfer: (to: Address, amount: string) => Promise<WriteReturnType>;
  approve: (spender: Address, amount: string) => Promise<WriteReturnType>;
  transferFrom: (
    from: Address,
    to: Address,
    amount: string,
  ) => Promise<WriteReturnType>;
  exchangeETHForTokens: (ether: string) => Promise<WriteReturnType>;
  stake: (amount: bigint, lockPeriod: bigint) => Promise<WriteReturnType>;
  unstake: (forceUnlock: boolean) => Promise<WriteReturnType>;
  claimReward: () => Promise<WriteReturnType>;
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
/**
 * 学习进度信息结构体
 */
interface LearningProgress {
  courseId: bigint;
  completedLessons: bigint;
  totalLessons: bigint;
  progressPercent: bigint;
  lastUpdateTime: bigint;
}
/**
 * @dev 退款申请信息
 */
interface RefundRequest {
  courseId: bigint;
  student: Address;
  refundAmount: bigint;
  requestTime: bigint;
  processed: boolean;
  approved: boolean;
}
interface UseCourseContractProps {
  address: Address;
  tokenDecimals: number;
}
declare function useCourseContract({
  address,
  tokenDecimals,
}: UseCourseContractProps): {
  hasAccess: (
    student?: Address,
    courseId?: bigint,
  ) => UseContractReadReturn<boolean>;
  getCourse: (courseId?: bigint) => UseContractReadReturn<Course>;
  getStudentCourses: (student: Address) => UseContractReadReturn<bigint[]>;
  getCourseStudents: (courseId: bigint) => UseContractReadReturn<Address[]>;
  getInstructorCourses: (
    instructor: Address,
  ) => UseContractReadReturn<bigint[]>;
  getTotalCourses: () => UseContractReadReturn<bigint>;
  getCourseStudentCount: (courseId: bigint) => UseContractReadReturn<bigint>;
  batchCheckAccess: (
    student: Address,
    courseIds: bigint[],
  ) => UseContractReadReturn<boolean[]>;
  getCourseProgress: (
    student: Address,
    courseId: bigint,
  ) => UseContractReadReturn<LearningProgress>;
  getRefundRequest: (requestId: bigint) => UseContractReadReturn<RefundRequest>;
  getRefundEligibilityDetails: (
    student: Address,
    courseId: bigint,
  ) => UseContractReadReturn<[boolean, string, bigint, bigint, bigint, bigint]>;
  isCertifiedInstructor(instructor: Address): UseContractReadReturn<boolean>;
  createCourse: (
    title: string,
    instructor: Address,
    price: string,
    totalLessons: bigint,
  ) => Promise<WriteReturnType>;
  purchaseCourse: (courseId: bigint) => Promise<WriteReturnType>;
  updateCoursePrice: (
    courseId: bigint,
    newPrice: string,
  ) => Promise<WriteReturnType>;
  updateCourseProgress: (
    courseId: bigint,
    completedLessons: bigint,
  ) => Promise<WriteReturnType>;
  requestRefund: (courseId: bigint) => Promise<WriteReturnType>;
  certifyInstructor: (instructor: Address) => Promise<WriteReturnType>;
  revokeInstructor: (instructor: Address) => Promise<WriteReturnType>;
  batchCertifyInstructors: (instructors: Address[]) => Promise<WriteReturnType>;
  updateCourse: (
    courseId: bigint,
    title: string,
    totalLessons: bigint,
  ) => Promise<WriteReturnType>;
  updatePlatformAddress: (
    newPlatformAddress: Address,
  ) => Promise<WriteReturnType>;
  publishCourse: (courseId: bigint) => Promise<WriteReturnType>;
  unpublishCourse: (courseId: bigint) => Promise<WriteReturnType>;
  deleteCourse: (courseId: bigint) => Promise<WriteReturnType>;
  createCourseReceipt: UseWaitForTransactionReceiptReturnType;
  purchaseCourseReceipt: UseWaitForTransactionReceiptReturnType;
  updateCoursePriceReceipt: UseWaitForTransactionReceiptReturnType;
  updateCourseProgressReceipt: UseWaitForTransactionReceiptReturnType;
  requestRefundReceipt: UseWaitForTransactionReceiptReturnType;
  certifyInstructorReceipt: UseWaitForTransactionReceiptReturnType;
  revokeInstructorReceipt: UseWaitForTransactionReceiptReturnType;
  batchCertifyInstructorsReceipt: UseWaitForTransactionReceiptReturnType;
  updatePlatformAddressReceipt: UseWaitForTransactionReceiptReturnType;
  updateCourseReceipt: UseWaitForTransactionReceiptReturnType;
  publishCourseReceipt: UseWaitForTransactionReceiptReturnType;
  unpublishCourseReceipt: UseWaitForTransactionReceiptReturnType;
  deleteCourseReceipt: UseWaitForTransactionReceiptReturnType;
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
  useWalletSign,
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
