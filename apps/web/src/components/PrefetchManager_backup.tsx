"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// 在文件顶部添加
class PerformanceStats {
  prefetchCount = 0;
  hitCount = 0;

  recordPrefetch() {
    this.prefetchCount++;
  }

  recordHit() {
    this.hitCount++;
  }

  getHitRate() {
    return this.prefetchCount > 0
      ? ((this.hitCount / this.prefetchCount) * 100).toFixed(1)
      : "0";
  }
}
const stats = new PerformanceStats();

// 路由权重配置（基于业务重要性）
const ROUTE_WEIGHTS = {
  "/": 10, // 首页：高权重
  "/market": 8, // 课程市场：高权重（核心业务）
  "/learn": 7, // 学习中心：中高权重
  "/dao": 5, // DAO治理：中等权重
  "/profile": 3, // 个人中心：低权重
} as const;

// 路由转换概率（从当前页面到目标页面的可能性）
const ROUTE_TRANSITIONS = {
  "/": {
    "/market": 0.6, // 首页 → 市场 60%
    "/learn": 0.3, // 首页 → 学习 30%
    "/dao": 0.1, // 首页 → DAO 10%
  },
  "/market": {
    "/learn": 0.5, // 市场 → 学习 50%
    "/": 0.3, // 市场 → 首页 30%
    "/dao": 0.2, // 市场 → DAO 20%
  },
  "/learn": {
    "/market": 0.4, // 学习 → 市场 40%
    "/": 0.3, // 学习 → 首页 30%
    "/dao": 0.3, // 学习 → DAO 30%
  },
  "/dao": {
    "/": 0.5, // DAO → 首页 50%
    "/market": 0.3, // DAO → 市场 30%
    "/learn": 0.2, // DAO → 学习 20%
  },
} as const;

// 用户行为追踪
class UserBehaviorTracker {
  private visitHistory: string[] = [];
  private visitCounts: Map<string, number> = new Map();
  private transitionCounts: Map<string, number> = new Map();

  // 记录访问
  recordVisit(path: string) {
    // 更新访问历史
    this.visitHistory.push(path);
    if (this.visitHistory.length > 10) {
      this.visitHistory.shift(); // 保持最近10次访问
    }

    // 更新访问计数
    this.visitCounts.set(path, (this.visitCounts.get(path) || 0) + 1);

    // 记录路径转换
    if (this.visitHistory.length >= 2) {
      const prevPath = this.visitHistory[this.visitHistory.length - 2];
      const transitionKey = `${prevPath}->${path}`;
      this.transitionCounts.set(
        transitionKey,
        (this.transitionCounts.get(transitionKey) || 0) + 1,
      );
    }

    // 保存到 sessionStorage
    this.save();
  }

  // 预测下一个最可能访问的路由
  predictNextRoutes(currentPath: string, topN: number = 3): string[] {
    const scores = new Map<string, number>();

    // 1. 基于预定义的转换概率
    const transitions =
      ROUTE_TRANSITIONS[currentPath as keyof typeof ROUTE_TRANSITIONS];
    if (transitions) {
      Object.entries(transitions).forEach(([route, probability]) => {
        scores.set(route, (scores.get(route) || 0) + probability * 100);
      });
    }

    // 2. 基于用户历史行为
    this.transitionCounts.forEach((count, key) => {
      const [from, to] = key.split("->");
      if (from === currentPath) {
        scores.set(to, (scores.get(to) || 0) + count * 10);
      }
    });

    // 3. 基于路由权重
    Object.entries(ROUTE_WEIGHTS).forEach(([route, weight]) => {
      if (route !== currentPath) {
        scores.set(route, (scores.get(route) || 0) + weight);
      }
    });

    // 排序并返回 top N
    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([route]) => route);
  }

  // 保存到 sessionStorage
  private save() {
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        sessionStorage.setItem(
          "userBehavior",
          JSON.stringify({
            visitHistory: this.visitHistory,
            visitCounts: Array.from(this.visitCounts.entries()),
            transitionCounts: Array.from(this.transitionCounts.entries()),
          }),
        );
      } catch (e) {
        // 忽略存储错误
      }
    }
  }

  // 从 sessionStorage 加载
  load() {
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const data = sessionStorage.getItem("userBehavior");
        if (data) {
          const parsed = JSON.parse(data);
          this.visitHistory = parsed.visitHistory || [];
          this.visitCounts = new Map(parsed.visitCounts || []);
          this.transitionCounts = new Map(parsed.transitionCounts || []);
        }
      } catch (e) {
        // 忽略加载错误
      }
    }
  }
}

// 全局跟踪器实例
let behaviorTracker: UserBehaviorTracker | null = null;
let isQuicklinkInitialized = false;
let quicklinkCleanup: (() => void) | null = null;

export function PredictivePrefetchManager() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);
  // 预测并预加载
  const predictAndPrefetch = async (togger: boolean = false) => {
    if (!behaviorTracker) return;

    const predictedRoutes = behaviorTracker.predictNextRoutes(pathname, 2);

    if (predictedRoutes.length > 0) {
      console.log(`🔮 预测用户可能访问: ${predictedRoutes.join(", ")}`);
      // 检查新路由是否在之前预测的列表中
      if (togger && predictedRoutes.includes(pathname)) {
        stats.recordHit();
        console.log(`🎯 预测命中! 命中率: ${stats.getHitRate()}%`);
      }
      try {
        const { prefetch } = await import("quicklink");

        // 预加载预测的路由
        predictedRoutes.forEach((route, index) => {
          setTimeout(() => {
            prefetch(route, { priority: true })
              .then(() => console.log(`✅ 预测预加载: ${route}`))
              .catch(() => {});
          }, index * 500); // 错开预加载，避免同时请求
        });
      } catch (e) {
        // 忽略错误
      }
    }
  };

  useEffect(() => {
    // 初始化行为跟踪器
    if (!behaviorTracker) {
      behaviorTracker = new UserBehaviorTracker();
      behaviorTracker.load();
    }

    // 记录当前访问
    behaviorTracker.recordVisit(pathname);

    // 只在第一次挂载时初始化 Quicklink
    if (!isFirstMount.current) {
      // 路由切换时，预测并预加载
      predictAndPrefetch(true);
      return;
    }

    if (isQuicklinkInitialized) {
      isFirstMount.current = false;
      return;
    }

    const initQuicklink = async () => {
      try {
        const { listen, prefetch } = await import("quicklink");

        isQuicklinkInitialized = true;

        // 启动 Quicklink（视口预加载）
        quicklinkCleanup = listen({
          limit: 2,
          timeout: 2000,
          throttle: 300,
          el: document.body,
          ignores: [
            (uri: string, elem?: HTMLAnchorElement) => {
              if (elem) {
                const linkPath = new URL(elem.href).pathname;
                if (linkPath === window.location.pathname) {
                  return true;
                }
              }
              return false;
            },
            (uri: string) =>
              uri.includes("://") && !uri.includes(window.location.hostname),
            (uri: string) => uri.includes("#"),
            /\/api\//,
            /\.(pdf|zip|rar)$/,
            (uri: string) => uri.includes("_rsc="),
          ],
        });

        console.log("✅ Quicklink 预加载已启动");

        // 立即执行预测式预加载
        // 禁用预测式预加载（保留 Quicklink） 就注释这行代码
        predictAndPrefetch();

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
      };
    } else {
      const timer = setTimeout(checkNetworkAndInit, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (
        quicklinkCleanup &&
        !document.querySelector("[data-quicklink-active]")
      ) {
        quicklinkCleanup();
        isQuicklinkInitialized = false;
        quicklinkCleanup = null;
      }
    };
  }, []);

  return null;
}
