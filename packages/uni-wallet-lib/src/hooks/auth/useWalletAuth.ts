import { useCallback, useState } from "react";
import type {
  AuthConfig,
  NonceResponse,
  VerifyResponse,
} from "../../types/auth";
import { SignInStatus } from "../../types/auth";
import { safeStorage } from "../../utils/safeStorage";
import { useWalletConnection } from "../wallet/useWalletConnection";
import { useWalletSign } from "./useWalletSign";

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
export function useWalletAuth(config: AuthConfig = {}) {
  const {
    domain = typeof window !== "undefined" ? window.location.host : "localhost",
    apiBaseUrl = "/api/v1/auth",
    onSuccess,
    onError,
    onStatusChange,
  } = config;

  const tokenStorageKey = "AUTH_TOKEN";
  const refreshTokenStorageKey = "REFRESH_TOKEN";
  const userStorageKey = "USER";
  const signatureStorageKey = "WALLET_SIGNATURE";
  const walletAddressStorageKey = "TOKEN_BY_ADDRESS";

  const { signSIWEMessage } = useWalletSign();
  const { address: walletAddress, isConnected } = useWalletConnection();

  const [status, setStatus] = useState<SignInStatus>(SignInStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  /**
   * 更新状态并触发回调
   */
  const updateStatus = useCallback(
    (newStatus: SignInStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange],
  );

  /**
   * 请求 nonce
   */
  const requestNonce = async (
    walletAddress: string,
  ): Promise<NonceResponse> => {
    const response = await fetch(`${domain}${apiBaseUrl}/nonce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: walletAddress }),
    });

    if (!response.ok) {
      throw new Error("Failed to request nonce from server");
    }
    const json = await response.json();

    return {
      nonce: json.data.nonce,
      message: json.data.message,
      expiresAt: json.data.expiresAt,
    };
  };

  /**
   * 验证签名
   */
  const verifySignature = async (
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<VerifyResponse> => {
    const response = await fetch(`${domain}${apiBaseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, signature, message }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Verification failed");
    }

    const json = await response.json();

    return json.data;
  };

  /**
   * 完整的签名登录流程
   */
  const signIn = useCallback(async (): Promise<string | null> => {
    if (!walletAddress || !isConnected) {
      const err = new Error("Wallet not connected");
      setError(err.message);
      onError?.(err);
      return null;
    }

    setError(null);

    try {
      // 步骤 1: 请求 nonce
      updateStatus(SignInStatus.REQUESTING_NONCE);
      const { nonce } = await requestNonce(walletAddress);

      // 步骤 2: 等待用户签名
      updateStatus(SignInStatus.WAITING_SIGNATURE);
      // 触发 MetaMask 签名弹窗
      const { signature, message } = await signSIWEMessage(domain, nonce);

      // 步骤 3: 验证签名
      updateStatus(SignInStatus.VERIFYING);
      const { accessToken, refreshToken, user } = await verifySignature(
        walletAddress,
        signature,
        message.toMessage(),
      );

      // 步骤 4: 保存 token / user / signature
      safeStorage.setItem(tokenStorageKey, accessToken);
      safeStorage.setItem(refreshTokenStorageKey, refreshToken);
      safeStorage.setItem(walletAddressStorageKey, walletAddress);
      safeStorage.setItem(userStorageKey, JSON.stringify(user));
      safeStorage.setItem(signatureStorageKey, signature);

      // 成功
      updateStatus(SignInStatus.SUCCESS);
      onSuccess?.(accessToken);

      return accessToken;
    } catch (err) {
      // 处理用户拒绝签名的情况
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";

      // 用户拒绝签名通常包含 "rejected" 或 "denied"
      const isUserRejection =
        errorMessage.toLowerCase().includes("rejected") ||
        errorMessage.toLowerCase().includes("denied") ||
        errorMessage.toLowerCase().includes("user rejected");

      const displayError = isUserRejection ? "用户取消签名" : errorMessage;

      setError(displayError);
      updateStatus(SignInStatus.ERROR);
      onError?.(err instanceof Error ? err : new Error(displayError));

      return null;
    } finally {
      setTimeout(() => {
        reset(); // 重置状态
      }, 3000);
    }
  }, [
    walletAddress,
    isConnected,
    domain,
    apiBaseUrl,
    tokenStorageKey,
    updateStatus,
    onSuccess,
    onError,
  ]);

  /**
   * 退出登录
   * 清除所有认证相关的存储数据
   */
  const signOut = useCallback(() => {
    safeStorage.removeItem(tokenStorageKey);
    safeStorage.removeItem(refreshTokenStorageKey);
    safeStorage.removeItem(walletAddressStorageKey);
    updateStatus(SignInStatus.IDLE);
    setError(null);
  }, [tokenStorageKey, refreshTokenStorageKey, updateStatus]);

  /**
   * 检查是否已认证
   * 验证 token 和钱包地址是否匹配
   *
   * @returns 是否已通过认证
   */
  const isAuthenticated = useCallback((): boolean => {
    const token = safeStorage.getItem(tokenStorageKey);
    const storedAddress = safeStorage.getItem(walletAddressStorageKey);
    return !!(token && storedAddress && storedAddress === walletAddress);
  }, [tokenStorageKey, walletAddress]);

  /**
   * 重新加载认证状态
   * 如果钱包地址变化，自动登出
   */
  const reload = useCallback(() => {
    // 如果当前地址与存储的地址不匹配,自动登出
    const storedAddress = safeStorage.getItem(walletAddressStorageKey);
    if (storedAddress && walletAddress && storedAddress !== walletAddress) {
      signOut();
    }
  }, [walletAddress, tokenStorageKey, signOut]);

  /**
   * 重置状态（用于关闭 Modal）
   */
  const reset = useCallback(() => {
    updateStatus(SignInStatus.IDLE);
    setError(null);
  }, [updateStatus]);

  return {
    status,
    isAuthenticated: isAuthenticated(),
    isAuthenticating:
      status !== SignInStatus.IDLE &&
      status !== SignInStatus.SUCCESS &&
      status !== SignInStatus.ERROR,
    error,
    address: walletAddress,

    signIn,
    signOut,
    reload,
    reset,
  };
}
