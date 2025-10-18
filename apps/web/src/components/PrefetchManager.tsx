"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// ⭐ 全局标记，不会被清理
let isQuicklinkInitialized = false;
let quicklinkCleanup: (() => void) | null = null;

export function PrefetchManager() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // ⭐ 只在第一次挂载时初始化
    if (!isFirstMount.current) {
      console.log("⏭️ 路由切换，Quicklink 继续运行（不重新初始化）");
      return;
    }

    // 检查是否已经初始化
    if (isQuicklinkInitialized) {
      console.log("⏭️ Quicklink 已初始化，跳过");
      isFirstMount.current = false;
      return;
    }

    const initQuicklink = async () => {
      try {
        const { listen } = await import("quicklink");

        isQuicklinkInitialized = true;
        const currentPath = window.location.pathname;

        quicklinkCleanup = listen({
          limit: 2,
          timeout: 2000,
          throttle: 300,
          el: document.body,
          ignores: [
            // 忽略当前页面
            (uri: string, elem?: HTMLAnchorElement) => {
              if (elem) {
                const linkPath = new URL(elem.href).pathname;
                if (linkPath === currentPath) {
                  return true;
                }
              }
              return false;
            },
            // 忽略外部链接
            (uri: string) =>
              uri.includes("://") && !uri.includes(window.location.hostname),
            // 忽略哈希链接
            (uri: string) => uri.includes("#"),
            // 忽略 API 路由
            /\/api\//,
            // 忽略文件下载
            /\.(pdf|zip|rar)$/,
            // 忽略 _rsc 参数
            (uri: string) => uri.includes("_rsc="),
          ],
        });

        console.log("✅ Quicklink 预加载已启动");
        isFirstMount.current = false;
      } catch (error) {
        console.error("❌ Quicklink 初始化失败:", error);
        isQuicklinkInitialized = false;
      }
    };

    const checkNetworkAndInit = () => {
      if ("connection" in navigator) {
        const conn = (navigator as any).connection;
        if (conn && (conn.effectiveType === "2g" || conn.saveData)) {
          console.log("⚠️ 检测到慢速网络或省流量模式，跳过预加载");
          return;
        }
      }
      initQuicklink();
    };

    if ("requestIdleCallback" in window) {
      const idleCallback = window.requestIdleCallback(
        () => {
          checkNetworkAndInit();
        },
        { timeout: 3000 },
      );

      return () => {
        window.cancelIdleCallback(idleCallback);
        // ⚠️ 注意：这里不清理 quicklinkCleanup
        // 让 Quicklink 在整个应用生命周期内持续运行
      };
    } else {
      const timer = setTimeout(checkNetworkAndInit, 3000);
      return () => {
        clearTimeout(timer);
        // ⚠️ 注意：这里不清理 quicklinkCleanup
      };
    }
  }, [pathname]); // 依赖 pathname，但不会重复初始化

  // ⭐ 组件完全卸载时才清理（例如整个应用关闭）
  useEffect(() => {
    return () => {
      if (
        quicklinkCleanup &&
        !document.querySelector("[data-quicklink-active]")
      ) {
        // 只有在页面真正关闭时才清理
        console.log("🧹 应用关闭，清理 Quicklink");
        quicklinkCleanup();
        isQuicklinkInitialized = false;
        quicklinkCleanup = null;
      }
    };
  }, []);

  return null;
}
