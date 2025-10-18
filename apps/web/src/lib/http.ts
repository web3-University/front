// src/lib/http.ts
import {
  clearAuthTokens,
  getAuthToken,
  getRefreshToken,
  setAuthToken,
} from "./utils/storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "/api/v1/auth") ||
  "http://localhost:3000/api/v1/auth";

type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  token?: string | null; // 可选：JWT
  body?: any; // 自动转 JSON
  headers?: Record<string, string>;
  nextOptions?: RequestInit; // 透传其他 fetch 选项
  skipAuth?: boolean; // 跳过自动认证处理
  maxRetries?: number; // 最大重试次数
  retryDelay?: number; // 重试延迟（毫秒）
};

// 防止并发刷新令牌
let refreshPromise: Promise<string | null> | null = null;

/**
 * 刷新访问令牌
 */
async function refreshAccessToken(): Promise<string | null> {
  // 如果已经有刷新请求在进行中，等待它完成
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // 刷新令牌也过期了，清除所有令牌
        clearAuthTokens();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.data?.accessToken;

      if (newAccessToken) {
        setAuthToken(newAccessToken);
        return newAccessToken;
      }

      return null;
    } catch (error) {
      console.error("刷新令牌失败:", error);
      clearAuthTokens();
      return null;
    } finally {
      // 清除刷新 Promise，允许后续请求重新刷新
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * 触发重新签名流程
 */
async function triggerReSignIn(): Promise<string | null> {
  try {
    // 检查是否在浏览器环境
    if (typeof window === "undefined") {
      return null;
    }

    // 清除所有认证相关的存储
    clearAuthTokens();

    // 触发全局事件，通知应用需要重新签名
    const event = new CustomEvent("auth:re-signin-required", {
      detail: { reason: "token_expired" },
    });
    window.dispatchEvent(event);

    return null;
  } catch (error) {
    console.error("触发重新签名失败:", error);
    return null;
  }
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 判断错误是否可以重试
 */
function isRetryableError(error: Error): boolean {
  const retryableMessages = ["network error", "timeout", "connection", "fetch"];

  const message = error.message.toLowerCase();
  return retryableMessages.some((keyword) => message.includes(keyword));
}

export async function http<T>(
  path: string,
  {
    method = "GET",
    token,
    body,
    headers = {},
    nextOptions = {},
    skipAuth = false,
    maxRetries = 1,
    retryDelay = 1000,
  }: HttpOptions = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const isJson = body !== undefined;

  // 如果没有提供 token，尝试从存储中获取
  let authToken = token;
  if (!authToken && !skipAuth) {
    authToken = getAuthToken();
  }

  let requestOptions: RequestInit = {
    method,
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIweGFhY2VmZDM0YmU4ZDgyMzE1YTNhY2ZjM2NkZjg4OTc4Njc4YjE4YzQiLCJ1c2VySWQiOjQ2LCJ1c2VybmFtZSI6IlVzZXJfMHhhYWNlZmQiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzYwNzgxMjE3LCJleHAiOjE3NjA3ODIxMTd9.mquZ2441MbKS7UcW7C8ZRjfJ2mZowNh3vlzFyKk4y-U`,
      ...headers,
    },
    body: isJson ? JSON.stringify(body) : undefined,
    ...nextOptions,
  };

  let lastError: Error | null = null;
  let retryCount = 0;
  let hasTriedRefresh = false; // 防止无限刷新令牌

  while (retryCount <= maxRetries) {
    try {
      const response = await fetch(url, requestOptions);

      // 处理 401 未授权错误
      console.log("response.status:", response.status);
      if (response.status === 401 && !skipAuth && !hasTriedRefresh) {
        console.warn("收到 401 响应，尝试刷新令牌...");
        hasTriedRefresh = true;

        // 尝试刷新访问令牌
        const newToken = await refreshAccessToken();

        if (newToken) {
          console.log("令牌刷新成功，重试请求");
          // 更新请求头中的令牌
          requestOptions = {
            ...requestOptions,
            headers: {
              ...requestOptions.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };
          // 不增加重试计数，因为这是令牌刷新重试
          continue;
        } else {
          // 刷新令牌失败，触发重新签名
          console.warn("刷新令牌失败，需要重新签名");
          await triggerReSignIn();

          // 抛出特定的认证错误
          throw new Error("AUTHENTICATION_REQUIRED");
        }
      }

      // 处理其他错误状态
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        const error = new Error(
          `HTTP ${response.status} ${response.statusText} - ${text}`,
        );

        // 对于 5xx 错误，可以考虑重试
        if (response.status >= 500 && retryCount < maxRetries) {
          throw error; // 让下面的 catch 处理重试逻辑
        }

        throw error;
      }

      // 成功响应，解析内容
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return response.json() as Promise<T>;
      }

      // 非 JSON 可返回文本/空
      // @ts-expect-error
      return response.text?.() ?? (undefined as T);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 如果是认证错误，直接抛出，不重试
      if (lastError.message === "AUTHENTICATION_REQUIRED") {
        throw lastError;
      }

      // 如果已经达到最大重试次数，抛出错误
      if (retryCount >= maxRetries) {
        throw lastError;
      }

      // 只对可重试的错误进行重试
      if (isRetryableError(lastError)) {
        console.warn(
          `请求失败，${retryDelay}ms 后重试 (${retryCount + 1}/${maxRetries}):`,
          lastError.message,
        );
        await delay(retryDelay);
        retryCount++;
      } else {
        // 不可重试的错误直接抛出
        throw lastError;
      }
    }
  }

  // 如果所有重试都失败了，抛出最后一个错误
  throw lastError || new Error("请求失败");
}
