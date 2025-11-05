// src/lib/http.ts
import { clearAuthTokens, getAuthToken } from "./utils/storage";
import { tokenRefreshManager } from "./token-refresh-manager";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

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
  const isFormData = body instanceof FormData;
  const isJson = body !== undefined && !isFormData;

  // 如果没有提供 token，尝试从存储中获取
  let authToken = token;
  if (!authToken && !skipAuth) {
    authToken = getAuthToken();
  }

  let requestOptions: RequestInit = {
    method,
    headers: {
      // FormData 不需要手动设置 Content-Type，浏览器会自动设置正确的 boundary
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      Authorization: authToken ? `Bearer ${authToken}` : "",
      ...headers,
    },
    body: isJson ? JSON.stringify(body) : isFormData ? body : undefined,
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
        console.warn(
          `[HTTP] 收到 401 响应，请求进入 token 刷新队列: ${method} ${path}`,
        );
        hasTriedRefresh = true;

        try {
          // 使用 TokenRefreshManager 获取有效的 token
          // 如果正在刷新，请求会自动进入队列等待
          const newToken = await tokenRefreshManager.waitForValidToken(
            `${method} ${path}`,
          );

          console.log(`[HTTP] Token 刷新成功，重试请求: ${method} ${path}`);

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
        } catch (refreshError) {
          // Token 刷新失败
          const errorMsg =
            refreshError instanceof Error
              ? refreshError.message
              : String(refreshError);

          console.error(`[HTTP] Token 刷新失败: ${errorMsg}`);

          // 检查是否是特定的错误类型
          if (
            errorMsg.includes("NO_REFRESH_TOKEN") ||
            errorMsg.includes("REFRESH_TOKEN_EXPIRED") ||
            errorMsg.includes("TOKEN_REFRESH_MAX_FAILURES")
          ) {
            // 这些错误意味着需要重新登录，TokenRefreshManager 已经触发了事件
            throw new Error("AUTHENTICATION_REQUIRED");
          }

          // 其他刷新错误，也抛出认证错误
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
