import { useState } from "react";
import { useWalletSign } from "./useWalletSign";

export interface AuthConfig {
  domain?: string;
  apiBaseUrl?: string;
  tokenStorageKey?: string;
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
}

export function useWalletAuth(config: AuthConfig = {}) {
  const {
    domain = "https://web3-university-backend-dzj19l9n2-shuokun-tangs-projects.vercel.app",
    apiBaseUrl = "/api/v1/auth/nonce",
    onSuccess,
    onError,
  } = config;

  const {
    address: connectedAddress,
    signSIWEMessage,
    isPending: isSigning,
    isSuccess,
  } = useWalletSign();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenStorageKey = "AUTH_TOKEN";
  const refreshTokenStorageKey = "REFRESH_TOKEN";

  const requestNonce = async (
    walletAddress: string,
  ): Promise<{ nonce: string }> => {
    setTimeout(() => {}, 3000);
    return { nonce: "2b5f8d3a9c1234567890abcdef" };

    /*
     * 暂时先不使用接口调用，setTimeout模拟请求
    const response = await fetch(`${domain}${apiBaseUrl}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress: connectedAddress})
    })
    if (!response.ok) throw new Error('Failed to request nonce')
    return response.json()
    */
  };

  /**
   * 验证签名
   */
  const verifySignature = async (
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {};
    tokenType: string;
    expiresIn: number;
  }> => {
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
    const response = await fetch(`${apiBaseUrl}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, signature, message }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Verification failed')
    }
    return response.json()
    */
  };

  const signIn = async () => {
    if (!connectedAddress) {
      const error = new Error("❗️ 钱包未连接");
      setError(error.message);
      onError?.(error);
      return null;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // 1. 请求nonce
      const { nonce } = await requestNonce(connectedAddress);
      // 2. 签名
      const { signature } = await signSIWEMessage(domain, nonce);
      // 3. 验证签名获取token
      const { accessToken, refreshToken } = await verifySignature(
        connectedAddress,
        signature,
        nonce,
      );
      // 4. 保存token
      localStorage.setItem(tokenStorageKey, accessToken);
      localStorage.setItem(refreshTokenStorageKey, refreshToken);
      localStorage.setItem(`${tokenStorageKey}_address`, connectedAddress);

      onSuccess?.(accessToken);
      return accessToken;
    } catch (error) {
      const errorData =
        error instanceof Error ? error : new Error("Authentication failed");
      setError(errorData.message);
      onError?.(errorData);
      return null;
    } finally {
      setIsAuthenticating(false);
      signIn;
    }
  };

  const signOut = (): void => {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(refreshTokenStorageKey);
    localStorage.removeItem(`${tokenStorageKey}_address`);
  };

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem(tokenStorageKey);
    return !!token;
  };

  return {
    isAuthenticating,
    error,
    isAuthenticated: isAuthenticated(),

    signIn,
    signOut,
  };
}
