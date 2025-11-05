// src/lib/token-refresh-manager.ts

import {
  clearAuthTokens,
  getRefreshToken,
  setAuthToken,
} from "./utils/storage";

const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "/api/v1/auth") ||
  "http://localhost:3000/api/v1/auth";

/**
 * Token 刷新状态
 */
type RefreshStatus = "idle" | "refreshing" | "failed";

/**
 * 待处理的请求
 */
interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
  requestInfo: string; // 用于日志记录
}

/**
 * Token 刷新管理器
 * 负责管理 token 刷新流程和请求队列
 *
 * 核心功能：
 * 1. 单例模式确保同一时间只有一个刷新请求
 * 2. 请求队列存储刷新期间的所有待处理请求
 * 3. 刷新成功后统一分发新 token
 * 4. 刷新失败时统一处理错误
 */
export class TokenRefreshManager {
  private static instance: TokenRefreshManager | null = null;

  // 当前刷新状态
  private status: RefreshStatus = "idle";

  // 待处理的请求队列
  private pendingRequests: PendingRequest[] = [];

  // 当前刷新的 Promise
  private refreshPromise: Promise<string> | null = null;

  // 刷新失败次数计数器
  private failureCount = 0;

  // 最大失败次数，超过后不再尝试刷新
  private readonly MAX_FAILURES = 3;

  // 上次刷新失败的时间戳
  private lastFailureTime: number | null = null;

  // 失败后的冷却时间（毫秒）
  private readonly FAILURE_COOLDOWN = 5000;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): TokenRefreshManager {
    if (!TokenRefreshManager.instance) {
      TokenRefreshManager.instance = new TokenRefreshManager();
    }
    return TokenRefreshManager.instance;
  }

  /**
   * 等待获取有效的 token
   * 如果正在刷新，请求会进入队列等待
   * 如果没有刷新，会触发新的刷新流程
   *
   * @param requestInfo - 请求信息，用于日志
   * @returns 有效的 access token
   * @throws 如果刷新失败或需要重新登录
   */
  async waitForValidToken(requestInfo = "unknown request"): Promise<string> {
    // 检查是否在冷却期
    if (this.isInCooldown()) {
      const remainingTime = this.getRemainingCooldownTime();
      console.warn(`[TokenRefreshManager] 在冷却期内，剩余 ${remainingTime}ms`);
      throw new Error("TOKEN_REFRESH_IN_COOLDOWN");
    }

    // 检查是否超过最大失败次数
    if (this.failureCount >= this.MAX_FAILURES) {
      console.error(
        `[TokenRefreshManager] 已达到最大失败次数 (${this.MAX_FAILURES})，需要重新登录`,
      );
      this.triggerReSignIn();
      throw new Error("TOKEN_REFRESH_MAX_FAILURES");
    }

    return new Promise<string>((resolve, reject) => {
      // 将请求添加到队列
      this.pendingRequests.push({
        resolve,
        reject,
        requestInfo,
      });

      console.log(
        `[TokenRefreshManager] 请求进入队列: ${requestInfo}, 当前队列长度: ${this.pendingRequests.length}`,
      );

      // 如果当前没有在刷新，启动刷新流程
      if (this.status === "idle") {
        this.startRefresh();
      } else {
        console.log(
          `[TokenRefreshManager] 刷新正在进行中，请求 ${requestInfo} 等待中...`,
        );
      }
    });
  }

  /**
   * 启动 token 刷新流程
   */
  private async startRefresh(): Promise<void> {
    if (this.status === "refreshing") {
      console.warn("[TokenRefreshManager] 刷新已在进行中，跳过重复启动");
      return;
    }

    this.status = "refreshing";
    console.log(
      `[TokenRefreshManager] 开始刷新 token, 待处理请求: ${this.pendingRequests.length}`,
    );

    try {
      this.refreshPromise = this.executeRefresh();
      const newToken = await this.refreshPromise;

      // 刷新成功
      this.status = "idle";
      this.failureCount = 0; // 重置失败计数
      this.lastFailureTime = null;

      console.log(
        `[TokenRefreshManager] Token 刷新成功，处理 ${this.pendingRequests.length} 个待处理请求`,
      );

      // 分发新 token 给所有等待的请求
      this.resolvePendingRequests(newToken);
    } catch (error) {
      // 刷新失败
      this.status = "failed";
      this.failureCount++;
      this.lastFailureTime = Date.now();

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `[TokenRefreshManager] Token 刷新失败 (${this.failureCount}/${this.MAX_FAILURES}):`,
        errorMessage,
      );

      // 拒绝所有等待的请求
      this.rejectPendingRequests(
        error instanceof Error ? error : new Error(errorMessage),
      );

      // 如果达到最大失败次数，触发重新登录
      if (this.failureCount >= this.MAX_FAILURES) {
        this.triggerReSignIn();
      }

      // 重置状态以允许后续尝试（除非已达到最大失败次数）
      if (this.failureCount < this.MAX_FAILURES) {
        setTimeout(() => {
          this.status = "idle";
        }, this.FAILURE_COOLDOWN);
      }
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * 执行实际的 token 刷新请求
   */
  private async executeRefresh(): Promise<string> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      console.error("[TokenRefreshManager] 没有找到 refresh token");
      throw new Error("NO_REFRESH_TOKEN");
    }

    try {
      const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error(
          `[TokenRefreshManager] 刷新请求失败: ${response.status} ${response.statusText}`,
          text,
        );

        // 如果是 401/403，说明 refresh token 也过期了
        if (response.status === 401 || response.status === 403) {
          clearAuthTokens();
          throw new Error("REFRESH_TOKEN_EXPIRED");
        }

        throw new Error(
          `REFRESH_FAILED: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      const newAccessToken = data.data?.accessToken;

      if (!newAccessToken) {
        console.error("[TokenRefreshManager] 响应中没有 accessToken");
        throw new Error("NO_ACCESS_TOKEN_IN_RESPONSE");
      }

      // 保存新的 access token
      setAuthToken(newAccessToken);
      console.log("[TokenRefreshManager] 新 token 已保存到 localStorage");

      return newAccessToken;
    } catch (error) {
      // 网络错误或其他异常
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`REFRESH_ERROR: ${String(error)}`);
    }
  }

  /**
   * 处理所有待处理的请求（刷新成功时调用）
   */
  private resolvePendingRequests(token: string): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = []; // 清空队列

    console.log(
      `[TokenRefreshManager] 分发新 token 给 ${requests.length} 个请求`,
    );

    requests.forEach(({ resolve, requestInfo }) => {
      console.log(`[TokenRefreshManager] 处理请求: ${requestInfo}`);
      resolve(token);
    });
  }

  /**
   * 拒绝所有待处理的请求（刷新失败时调用）
   */
  private rejectPendingRequests(error: Error): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = []; // 清空队列

    console.log(
      `[TokenRefreshManager] 拒绝 ${requests.length} 个请求, 原因: ${error.message}`,
    );

    requests.forEach(({ reject, requestInfo }) => {
      console.log(`[TokenRefreshManager] 拒绝请求: ${requestInfo}`);
      reject(error);
    });
  }

  /**
   * 触发重新登录流程
   */
  private triggerReSignIn(): void {
    try {
      if (typeof window === "undefined") {
        return;
      }

      console.warn("[TokenRefreshManager] 触发重新登录事件");

      // 清除所有认证信息
      clearAuthTokens();

      // 触发全局事件
      const event = new CustomEvent("auth:re-signin-required", {
        detail: {
          reason: "token_refresh_failed",
          failureCount: this.failureCount,
        },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("[TokenRefreshManager] 触发重新登录失败:", error);
    }
  }

  /**
   * 检查是否在冷却期内
   */
  private isInCooldown(): boolean {
    if (!this.lastFailureTime) {
      return false;
    }

    const elapsed = Date.now() - this.lastFailureTime;
    return elapsed < this.FAILURE_COOLDOWN;
  }

  /**
   * 获取剩余冷却时间（毫秒）
   */
  private getRemainingCooldownTime(): number {
    if (!this.lastFailureTime) {
      return 0;
    }

    const elapsed = Date.now() - this.lastFailureTime;
    const remaining = this.FAILURE_COOLDOWN - elapsed;
    return Math.max(0, remaining);
  }

  /**
   * 重置管理器状态（用于测试或强制重置）
   */
  reset(): void {
    console.log("[TokenRefreshManager] 重置管理器状态");
    this.status = "idle";
    this.pendingRequests = [];
    this.refreshPromise = null;
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  /**
   * 获取当前状态（用于调试）
   */
  getStatus(): {
    status: RefreshStatus;
    queueLength: number;
    failureCount: number;
    isInCooldown: boolean;
    remainingCooldownTime: number;
  } {
    return {
      status: this.status,
      queueLength: this.pendingRequests.length,
      failureCount: this.failureCount,
      isInCooldown: this.isInCooldown(),
      remainingCooldownTime: this.getRemainingCooldownTime(),
    };
  }
}

// 导出单例实例
export const tokenRefreshManager = TokenRefreshManager.getInstance();
