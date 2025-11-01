// src/lib/auth-event-handler.ts

import { useAuth } from "@web3-university/uni-wallet-lib";
import React from "react";

/**
 * 认证事件处理器
 * 监听来自 HTTP 客户端的重新签名事件
 */
export class AuthEventHandler {
  private static instance: AuthEventHandler | null = null;
  private isListening = false;

  private constructor() {}

  static getInstance(): AuthEventHandler {
    if (!AuthEventHandler.instance) {
      AuthEventHandler.instance = new AuthEventHandler();
    }
    return AuthEventHandler.instance;
  }

  /**
   * 开始监听认证事件
   */
  startListening(): void {
    if (this.isListening || typeof window === "undefined") {
      return;
    }

    this.isListening = true;

    // 监听重新签名事件
    window.addEventListener(
      "auth:re-signin-required",
      this.handleReSignInRequired,
    );

    console.log("认证事件监听器已启动");
  }

  /**
   * 停止监听认证事件
   */
  stopListening(): void {
    if (!this.isListening || typeof window === "undefined") {
      return;
    }

    this.isListening = false;

    window.removeEventListener(
      "auth:re-signin-required",
      this.handleReSignInRequired,
    );

    console.log("认证事件监听器已停止");
  }

  /**
   * 处理重新签名事件
   */
  private handleReSignInRequired = async (event: Event) => {
    const customEvent = event as CustomEvent;
    console.warn("收到重新签名事件:", customEvent.detail);

    try {
      // 尝试获取认证上下文并触发重新签名
      // 注意：这里需要在 React 组件中使用，不能直接在这里调用 useAuth
      // 所以我们通过全局事件来通知 React 组件
      const signInEvent = new CustomEvent("auth:trigger-signin", {
        detail: {
          reason: customEvent.detail?.reason || "token_expired",
          timestamp: Date.now(),
        },
      });

      window.dispatchEvent(signInEvent);
    } catch (error) {
      console.error("处理重新签名事件失败:", error);
    }
  };
}

/**
 * React Hook 用于处理认证事件
 */
export function useAuthEventHandler() {
  const auth = useAuth();

  React.useEffect(() => {
    const handler = AuthEventHandler.getInstance();
    handler.startListening();

    // 监听触发签名事件
    const handleTriggerSignIn = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("触发重新签名:", customEvent.detail);

      try {
        // 如果用户已经连接钱包但未认证，自动触发签名
        if (auth.address && !auth.isAuthenticated) {
          await auth.signIn();
        } else {
          // 否则显示提示信息
          console.warn("需要重新连接钱包并签名");
          // 这里可以显示一个 toast 或 modal 提示用户
        }
      } catch (error) {
        console.error("重新签名失败:", error);
      }
    };

    window.addEventListener("auth:trigger-signin", handleTriggerSignIn);

    return () => {
      handler.stopListening();
      window.removeEventListener("auth:trigger-signin", handleTriggerSignIn);
    };
  }, [auth]);

  return {
    isListening: true, // 简化返回值
  };
}

// 导出单例实例
export const authEventHandler = AuthEventHandler.getInstance();
