/**
 * Safe Storage Utility for Web App
 * 提供 SSR 安全的 localStorage 访问方法
 */

/**
 * 检查是否在浏览器环境
 */
const isBrowser = (): boolean => {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
};

/**
 * 安全地获取 localStorage 中的值
 *
 * @param key - 存储键名
 * @returns 存储的值，如果不存在或在服务端则返回 null
 */
export const getStorageItem = (key: string): string | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`[Storage] Failed to get item "${key}":`, error);
    return null;
  }
};

/**
 * 安全地设置 localStorage 的值
 *
 * @param key - 存储键名
 * @param value - 要存储的值
 * @returns 是否成功设置
 */
export const setStorageItem = (key: string, value: string): boolean => {
  if (!isBrowser()) {
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to set item "${key}":`, error);
    return false;
  }
};

/**
 * 安全地删除 localStorage 的值
 *
 * @param key - 存储键名
 * @returns 是否成功删除
 */
export const removeStorageItem = (key: string): boolean => {
  if (!isBrowser()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to remove item "${key}":`, error);
    return false;
  }
};

/**
 * 获取认证 Token
 *
 * @returns JWT Token 或 null
 */
export const getAuthToken = (): string | null => {
  return getStorageItem("AUTH_TOKEN");
};

/**
 * 获取刷新 Token
 *
 * @returns Refresh Token 或 null
 */
export const getRefreshToken = (): string | null => {
  return getStorageItem("REFRESH_TOKEN");
};

/**
 * 设置认证 Token
 *
 * @param token - JWT Token
 * @returns 是否成功设置
 */
export const setAuthToken = (token: string): boolean => {
  return setStorageItem("AUTH_TOKEN", token);
};

/**
 * 清除所有认证相关的 Token
 */
export const clearAuthTokens = (): void => {
  removeStorageItem("AUTH_TOKEN");
  removeStorageItem("REFRESH_TOKEN");
  removeStorageItem("AUTH_TOKEN_address");
};
