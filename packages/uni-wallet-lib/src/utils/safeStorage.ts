/**
 * Safe Storage Utility
 * 提供 SSR 安全的 localStorage 访问方法
 *
 * @description
 * 在 Next.js 等 SSR 框架中，localStorage 只在浏览器环境可用。
 * 这个工具提供了安全的访问方法，避免 "localStorage is not defined" 错误。
 *
 * @example
 * ```typescript
 * import { safeStorage } from './utils/safeStorage';
 *
 * // 读取
 * const token = safeStorage.getItem('AUTH_TOKEN');
 *
 * // 写入
 * safeStorage.setItem('AUTH_TOKEN', 'your-token');
 *
 * // 删除
 * safeStorage.removeItem('AUTH_TOKEN');
 *
 * // 清空
 * safeStorage.clear();
 * ```
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
 * 安全的 localStorage 工具
 */
export const safeStorage = {
  /**
   * 获取存储的值
   *
   * @param key - 存储键名
   * @returns 存储的值，如果不存在或在服务端则返回 null
   *
   * @example
   * ```typescript
   * const token = safeStorage.getItem('AUTH_TOKEN');
   * if (token) {
   *   console.log('Token found:', token);
   * }
   * ```
   */
  getItem(key: string): string | null {
    if (!isBrowser()) {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`[safeStorage] Failed to get item "${key}":`, error);
      return null;
    }
  },

  /**
   * 设置存储值
   *
   * @param key - 存储键名
   * @param value - 要存储的值
   * @returns 是否成功设置
   *
   * @example
   * ```typescript
   * const success = safeStorage.setItem('AUTH_TOKEN', 'abc123');
   * if (!success) {
   *   console.error('Failed to save token');
   * }
   * ```
   */
  setItem(key: string, value: string): boolean {
    if (!isBrowser()) {
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      // 可能是存储空间已满或隐私模式
      console.warn(`[safeStorage] Failed to set item "${key}":`, error);
      return false;
    }
  },

  /**
   * 删除存储值
   *
   * @param key - 存储键名
   * @returns 是否成功删除
   *
   * @example
   * ```typescript
   * safeStorage.removeItem('AUTH_TOKEN');
   * ```
   */
  removeItem(key: string): boolean {
    if (!isBrowser()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[safeStorage] Failed to remove item "${key}":`, error);
      return false;
    }
  },

  /**
   * 清空所有存储
   *
   * @returns 是否成功清空
   *
   * @example
   * ```typescript
   * safeStorage.clear();
   * ```
   */
  clear(): boolean {
    if (!isBrowser()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn("[safeStorage] Failed to clear storage:", error);
      return false;
    }
  },

  /**
   * 获取所有存储的键名
   *
   * @returns 所有键名的数组，服务端返回空数组
   *
   * @example
   * ```typescript
   * const keys = safeStorage.getAllKeys();
   * console.log('Stored keys:', keys);
   * ```
   */
  getAllKeys(): string[] {
    if (!isBrowser()) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.warn("[safeStorage] Failed to get all keys:", error);
      return [];
    }
  },

  /**
   * 检查键是否存在
   *
   * @param key - 存储键名
   * @returns 是否存在
   *
   * @example
   * ```typescript
   * if (safeStorage.hasItem('AUTH_TOKEN')) {
   *   console.log('Token exists');
   * }
   * ```
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  },

  /**
   * 获取并解析 JSON 值
   *
   * @param key - 存储键名
   * @returns 解析后的对象，解析失败返回 null
   *
   * @example
   * ```typescript
   * const user = safeStorage.getJSON<User>('USER_DATA');
   * if (user) {
   *   console.log('User:', user.name);
   * }
   * ```
   */
  getJSON<T = unknown>(key: string): T | null {
    const value = this.getItem(key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn(`[safeStorage] Failed to parse JSON for "${key}":`, error);
      return null;
    }
  },

  /**
   * 将对象序列化为 JSON 并存储
   *
   * @param key - 存储键名
   * @param value - 要存储的对象
   * @returns 是否成功设置
   *
   * @example
   * ```typescript
   * const user = { name: 'John', age: 30 };
   * safeStorage.setJSON('USER_DATA', user);
   * ```
   */
  setJSON<T = unknown>(key: string, value: T): boolean {
    try {
      const jsonString = JSON.stringify(value);
      return this.setItem(key, jsonString);
    } catch (error) {
      console.warn(
        `[safeStorage] Failed to stringify JSON for "${key}":`,
        error,
      );
      return false;
    }
  },
};

/**
 * 默认导出
 */
export default safeStorage;
