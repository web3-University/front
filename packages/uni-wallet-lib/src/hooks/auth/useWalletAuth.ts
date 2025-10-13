import { useState, useCallback } from "react";
import { useWalletConnection } from "../wallet/useWalletConnection";
import { useWalletSign } from "./useWalletSign";
import type {
  AuthConfig,
  NonceResponse,
  VerifyResponse,
} from "../../types/auth";
import { SignInStatus } from "../../types/auth";

/**
 * 钱包认证 Hook
 * 提供完整的签名登录流程
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
    setTimeout(() => {}, 3000);
    return {
      nonce: "2b5f8d3a9c1234567890abcdef",
      message: "example.com wants you to sign in with your Ethereum account...",
      expiresAt: 1696147200,
    };

    /**
     * 暂时先不使用接口调用，setTimeout模拟请求
     */
    const response = await fetch(`${apiBaseUrl}/nonce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: walletAddress }),
    });

    if (!response.ok) {
      throw new Error("Failed to request nonce from server");
    }

    return response.json();
  };

  /**
   * 验证签名
   */
  const verifySignature = async (
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<VerifyResponse> => {
    setTimeout(() => {}, 3000);
    return {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      user: {},
      tokenType: "Bearer",
      expiresIn: 900,
    };

    /**
     * 暂时先不使用接口调用，setTimeout模拟请求
     */
    const response = await fetch(`${apiBaseUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, signature, message }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Verification failed");
    }
    return response.json();
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
      const { signature } = await signSIWEMessage(domain, nonce);

      // 步骤 3: 验证签名
      updateStatus(SignInStatus.VERIFYING);
      const { accessToken, refreshToken } = await verifySignature(
        walletAddress,
        signature,
        nonce,
      );

      // 步骤 4: 保存 token
      localStorage.setItem(tokenStorageKey, accessToken);
      localStorage.setItem(refreshTokenStorageKey, refreshToken);
      localStorage.setItem(`${tokenStorageKey}_address`, walletAddress);

      // 成功
      updateStatus(SignInStatus.SUCCESS);
      onSuccess?.(accessToken);

      // 延迟重置状态
      setTimeout(() => updateStatus(SignInStatus.IDLE), 2000);

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

      // 延迟重置状态
      setTimeout(() => {
        updateStatus(SignInStatus.IDLE);
        setError(null);
      }, 3000);

      return null;
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
   */
  const signOut = useCallback(() => {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(refreshTokenStorageKey);
    localStorage.removeItem(`${tokenStorageKey}_address`);
    updateStatus(SignInStatus.IDLE);
    setError(null);
  }, [tokenStorageKey, updateStatus]);

  /**
   * 检查是否已认证
   */
  const isAuthenticated = useCallback((): boolean => {
    const token = localStorage.getItem(tokenStorageKey);
    const storedAddress = localStorage.getItem(`${tokenStorageKey}_address`);
    return !!(token && storedAddress && storedAddress === walletAddress);
  }, [tokenStorageKey, walletAddress]);

  /**
   * 重新加载认证状态
   */
  const reload = useCallback(() => {
    // 如果当前地址与存储的地址不匹配,自动登出
    const storedAddress = localStorage.getItem(`${tokenStorageKey}_address`);
    if (storedAddress && walletAddress && storedAddress !== walletAddress) {
      signOut();
    }
  }, [walletAddress, tokenStorageKey, signOut]);

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
  };
}
