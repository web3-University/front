import React from 'react';
import { State, Config, UseWaitForTransactionReceiptReturnType, UseReadContractReturnType } from 'wagmi';
import { QueryClient } from '@tanstack/react-query';
import * as viem from 'viem';
import { Address, Chain, Abi, Hash, TransactionReceipt } from 'viem';
import { SiweMessage } from 'siwe';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface WalletConfigOptions {
    appName: string;
    projectId: string;
    alchemyApiKey?: string;
    infuraApiKey?: string;
}

/**
 * 签名登录状态枚举
 */
declare enum SignInStatus {
    IDLE = "idle",// 空闲状态
    REQUESTING_NONCE = "requesting",// 请求 nonce 中
    WAITING_SIGNATURE = "waiting",// 等待用户签名
    VERIFYING = "verifying",// 验证签名中
    SUCCESS = "success",// 成功
    ERROR = "error"
}
/**
 * 认证配置选项
 */
interface AuthConfig {
    /** 域名(默认为当前域名) */
    domain?: string;
    /** 后端 API 基础路径 */
    apiBaseUrl?: string;
    /** Token 存储的 localStorage key */
    tokenStorageKey?: string;
    /** 是否在连接钱包后自动签名 */
    autoSignOnConnect?: boolean;
    /** 签名成功回调 */
    onSuccess?: (token: string) => void;
    /** 签名失败回调 */
    onError?: (error: Error) => void;
    /** 状态变化回调 */
    onStatusChange?: (status: SignInStatus) => void;
}
/**
 * 认证上下文值
 */
interface AuthContextValue {
    /** 当前签名状态 */
    status: SignInStatus;
    /** 是否已认证 */
    isAuthenticated: boolean;
    /** 是否正在认证中 */
    isAuthenticating: boolean;
    /** 错误信息 */
    error: string | null;
    /** 当前认证的地址 */
    address: string | undefined;
    /** 触发签名登录 */
    signIn: () => Promise<string | null>;
    /** 退出登录 */
    signOut: () => void;
    /** 重新加载认证状态 */
    reload: () => void;
    /** 重置状态（关闭 Modal） */
    reset: () => void;
}
/**
 * Nonce 响应
 */
interface NonceResponse {
    nonce: string;
    message?: string;
    expiresAt: number;
}
/**
 * 签名验证响应
 */
interface VerifyResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    tokenType: string;
    expiresIn: number;
}
interface User {
    createdAt: string;
    updatedAt: string;
    userId: number;
    walletAddress: string;
    username: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    specializations: string | null;
    rating: number;
    isInstructorRegistered: boolean;
    isInstructorApproved: boolean;
}

interface WalletProviderProps extends WalletConfigOptions {
    children: React.ReactNode;
    theme?: "light" | "dark" | "auto";
    queryClient?: QueryClient;
    initialState?: State | undefined;
    enableAuth?: boolean;
    authConfig?: AuthConfig;
}
declare function WalletProvider({ children, theme, queryClient, initialState, enableAuth, authConfig, ...configOptions }: WalletProviderProps): React.ReactElement;

interface AuthProviderProps extends AuthConfig {
    children: React.ReactNode;
}
/**
 * AuthProvider - 全局认证状态管理
 *
 * 功能:
 * 1. 监听钱包连接状态
 * 2. 自动触发签名流程(如果配置了 autoSignOnConnect)
 * 3. 管理认证 Modal 显示
 * 4. 提供认证上下文给所有子组件
 *
 * @example
 * ```tsx
 * <WalletProvider>
 *   <AuthProvider autoSignOnConnect>
 *     <App />
 *   </AuthProvider>
 * </WalletProvider>
 * ```
 */
declare function AuthProvider({ children, autoSignOnConnect, ...authConfig }: AuthProviderProps): React.ReactElement;
/**
 * useAuth Hook - 获取认证上下文
 */
declare function useAuth(): AuthContextValue;

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
    connector: {
        id: string;
        name: string;
        type: string;
        icon: string | undefined;
    } | undefined;
    chain: viem.Chain | undefined;
    balance: {
        value: bigint;
        formatted: string;
        symbol: string;
        decimals: number;
    } | undefined;
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

interface NetworkChangeHandler {
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
declare function useWatchNetwork({ onNetworkChange, onAccountChange, }?: NetworkChangeHandler): {
    currentChainId: number;
    currentAddress: `0x${string}` | undefined;
};

interface UseERC20Props {
    address: Address;
    spenderAddress?: Address;
    enabled?: boolean;
}
declare function useERC20({ address, spenderAddress, enabled, }: UseERC20Props): {
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
declare function useSimpleYDToken({ address, spenderAddress, enabled, }: UseSimpleYDTokenProps): {
    totalSupply: bigint;
    balance: bigint;
    formattedBalance: string;
    decimals: number;
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
    transferFrom: (from: Address, to: Address, amount: string) => Promise<WriteReturnType>;
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
    address?: Address;
    tokenDecimals?: number;
}
declare function useCourseContract({ address, tokenDecimals, }?: UseCourseContractProps): {
    hasAccess: (student?: Address, courseId?: bigint) => UseContractReadReturn<boolean>;
    getCourse: (courseId?: bigint) => UseContractReadReturn<Course>;
    getStudentCourses: (student: Address) => UseContractReadReturn<bigint[]>;
    getCourseStudents: (courseId: bigint) => UseContractReadReturn<Address[]>;
    getInstructorCourses: (instructor: Address) => UseContractReadReturn<bigint[]>;
    getTotalCourses: () => UseContractReadReturn<bigint>;
    getCourseStudentCount: (courseId: bigint) => UseContractReadReturn<bigint>;
    batchCheckAccess: (student: Address, courseIds: bigint[]) => UseContractReadReturn<boolean[]>;
    getCourseProgress: (student: Address, courseId: bigint) => UseContractReadReturn<LearningProgress>;
    getRefundRequest: (requestId: bigint) => UseContractReadReturn<RefundRequest>;
    getRefundEligibilityDetails: (student: Address, courseId: bigint) => UseContractReadReturn<[boolean, string, bigint, bigint, bigint, bigint]>;
    isCertifiedInstructor(instructor: Address): UseContractReadReturn<boolean>;
    createCourse: (title: string, instructor: Address, price: string, totalLessons: bigint) => Promise<WriteReturnType>;
    purchaseCourse: (courseId: string) => Promise<WriteReturnType>;
    updateCoursePrice: (courseId: bigint, newPrice: string) => Promise<WriteReturnType>;
    updateCourseProgress: (courseId: bigint, completedLessons: bigint) => Promise<WriteReturnType>;
    requestRefund: (courseId: bigint) => Promise<WriteReturnType>;
    certifyInstructor: (instructor: Address) => Promise<WriteReturnType>;
    revokeInstructor: (instructor: Address) => Promise<WriteReturnType>;
    batchCertifyInstructors: (instructors: Address[]) => Promise<WriteReturnType>;
    updateCourse: (courseId: bigint, title: string, totalLessons: bigint) => Promise<WriteReturnType>;
    updatePlatformAddress: (newPlatformAddress: Address) => Promise<WriteReturnType>;
    registerCourse: (courseId: string, price: bigint) => Promise<WriteReturnType>;
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
    registerCourseReceipt: UseWaitForTransactionReceiptReturnType;
    publishCourseReceipt: UseWaitForTransactionReceiptReturnType;
    unpublishCourseReceipt: UseWaitForTransactionReceiptReturnType;
    deleteCourseReceipt: UseWaitForTransactionReceiptReturnType;
};

/**
 * 钱包认证 Hook
 * 提供完整的签名登录流程
 *
 * @description
 * 集成 SIWE (Sign-In with Ethereum) 标准的钱包认证流程：
 * 1. 请求 nonce
 * 2. 用户签名
 * 3. 验证签名
 * 4. 获取并存储 JWT token
 *
 * @example
 * ```typescript
 * const { signIn, signOut, isAuthenticated, status } = useWalletAuth({
 *   domain: 'http://localhost:3000',
 *   apiBaseUrl: '/api/v1/auth',
 *   onSuccess: (token) => console.log('Logged in:', token),
 * });
 * ```
 */
declare function useWalletAuth(config?: AuthConfig): {
    status: SignInStatus;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    error: string | null;
    address: `0x${string}` | undefined;
    signIn: () => Promise<string | null>;
    signOut: () => void;
    reload: () => void;
    reset: () => void;
};

declare function useWalletSign(): {
    address: `0x${string}` | undefined;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    signMessage: (message: string) => Promise<{
        message: string;
        signature: `0x${string}`;
        address: `0x${string}`;
    }>;
    signSIWEMessage: (domain: string, nonce: string, chainId?: number) => Promise<{
        message: SiweMessage;
        signature: `0x${string}`;
        address: `0x${string}`;
    }>;
    generateSIWEMessage: (domain: string, address: string, nonce: string, chainId?: number, statement?: string) => SiweMessage;
};

interface WalletButtonProps {
    label?: string;
    showBalance?: boolean;
    showChainName?: boolean;
    className?: string;
    size?: "small" | "medium" | "large";
    onOpenProfile: () => void;
}
declare const WalletButton: React.FC<WalletButtonProps>;

interface AuthModalProps {
    status: SignInStatus;
    error?: string | null;
    onClose?: () => void;
}
declare function AuthModal({ status, error, onClose, }: AuthModalProps): React.ReactElement | null;

interface NetworkSyncProps extends NetworkChangeHandler {
    /**
     * 是否在控制台显示调试信息
     * @default false
     */
    debug?: boolean;
}
/**
 * 网络同步组件
 *
 * 用于监听钱包网络和账户变化，确保应用状态与钱包同步
 *
 * @example
 * ```tsx
 * // 在根组件中使用
 * <WalletProvider {...config}>
 *   <NetworkSync
 *     debug={true}
 *     onNetworkChange={(chainId) => {
 *       // 网络切换时的处理逻辑
 *       console.log('切换到网络:', chainId);
 *     }}
 *     onAccountChange={(address) => {
 *       // 账户切换时的处理逻辑
 *       console.log('切换到账户:', address);
 *     }}
 *   />
 *   <App />
 * </WalletProvider>
 * ```
 */
declare function NetworkSync({ debug, onNetworkChange, onAccountChange, }: NetworkSyncProps): react_jsx_runtime.JSX.Element | null;

export { AuthModal, AuthProvider, NetworkSync, SignInStatus, WalletButton, WalletProvider, useAuth, useCourseContract, useERC20, useNetworkSwitch, useSimpleYDToken, useWalletAuth, useWalletConnection, useWalletInfo, useWalletSign, useWatchNetwork };
export type { AuthConfig, AuthContextValue, AuthModalProps, AuthProviderProps, ContractConfig, ERC20TokenInfo, ERC721TokenInfo, GasEstimate, NFTMetadata, NetworkChangeHandler, NetworkSwitchOptions, NetworkSyncProps, NonceResponse, TokenBalance, TransactionHistory, TransactionRequest, TransactionStatus, User, VerifyResponse, WalletButtonProps, WalletError, WalletProviderProps, WalletState };
