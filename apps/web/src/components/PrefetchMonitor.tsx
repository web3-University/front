"use client";

import { useEffect, useState } from "react";

interface PrefetchStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
  urls: string[];
}

export function PrefetchMonitor() {
  const [stats, setStats] = useState<PrefetchStats>({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0,
    urls: [],
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 监听浏览器的资源加载事件
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // 过滤出预加载的资源（Next.js 的资源通常包含 /_next/）
      const prefetchEntries = entries.filter(
        (entry) =>
          entry.entryType === "resource" && entry.name.includes("/_next/"),
      );

      if (prefetchEntries.length > 0) {
        setStats((prev) => ({
          ...prev,
          total: prev.total + prefetchEntries.length,
          success:
            prev.success +
            prefetchEntries.filter((e: any) => e.responseStatus === 200).length,
          urls: [
            ...new Set([...prev.urls, ...prefetchEntries.map((e) => e.name)]),
          ],
        }));
      }
    });

    try {
      observer.observe({ entryTypes: ["resource"] });
    } catch (error) {
      console.warn("Performance Observer 不支持");
    }

    // 键盘快捷键：Ctrl/Cmd + Shift + P
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // 如果面板隐藏，显示一个小按钮
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs shadow-lg hover:bg-blue-600 transition-colors z-50"
        title="显示预加载监控 (Ctrl/Cmd + Shift + P)"
      >
        📊 预加载监控
      </button>
    );
  }

  // 显示完整的监控面板
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-80 z-50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
          🚀 Quicklink 监控
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">总预加载:</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {stats.total}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">成功:</span>
          <span className="font-bold text-green-600">{stats.success}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">失败:</span>
          <span className="font-bold text-red-600">{stats.failed}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 mb-2">
            最近预加载:
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {stats.urls.slice(-5).map((url, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-500 dark:text-gray-400 truncate"
                title={url}
              >
                {url.split("/").pop()}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
          按{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
            Ctrl+Shift+P
          </kbd>{" "}
          切换
        </div>
      </div>
    </div>
  );
}
