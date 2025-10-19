import type React from "react";
import { createContext, useContext, useEffect, useMemo } from "react";
import { AuthModal } from "../components/AuthModal/AuthModal";
import { useWalletAuth } from "../hooks/auth/useWalletAuth";
import { useWalletConnection } from "../hooks/wallet/useWalletConnection";
import type { AuthConfig, AuthContextValue } from "../types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps extends AuthConfig {
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
export function AuthProvider({
  children,
  autoSignOnConnect = false,
  ...authConfig
}: AuthProviderProps): React.ReactElement {
  const { isConnected } = useWalletConnection();

  const {
    signIn,
    signOut,
    reload,
    reset,
    status,
    isAuthenticated,
    isAuthenticating,
    error,
    address,
  } = useWalletAuth(authConfig);

  // 监听钱包连接状态,自动签名
  useEffect(() => {
    if (autoSignOnConnect && isConnected && !isAuthenticated) {
      signIn();
    }
  }, [autoSignOnConnect, isConnected, isAuthenticated]);

  // 监听地址变化,自动重载认证状态
  useEffect(() => {
    reload();
  }, [address, reload]);

  // 构建上下文值
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated,
      isAuthenticating,
      error,
      address,
      signIn,
      signOut,
      reload,
      reset,
    }),
    [
      status,
      isAuthenticated,
      isAuthenticating,
      error,
      address,
      signIn,
      signOut,
      reload,
      reset,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {/* OpenSea 风格的签名 Modal */}
      <AuthModal status={status} error={error} onClose={reset} />
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook - 获取认证上下文
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
