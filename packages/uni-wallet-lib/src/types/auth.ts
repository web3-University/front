/**
 * 签名登录状态枚举
 */
export enum SignInStatus {
  IDLE = "idle", // 空闲状态
  REQUESTING_NONCE = "requesting", // 请求 nonce 中
  WAITING_SIGNATURE = "waiting", // 等待用户签名
  VERIFYING = "verifying", // 验证签名中
  SUCCESS = "success", // 成功
  ERROR = "error", // 失败
}

/**
 * 认证配置选项
 */
export interface AuthConfig {
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
export interface AuthContextValue {
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
export interface NonceResponse {
  nonce: string;
  message?: string;
  expiresAt: number;
}

/**
 * 签名验证响应
 */
export interface VerifyResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  tokenType: string;
  expiresIn: number;
}

export interface User {
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
