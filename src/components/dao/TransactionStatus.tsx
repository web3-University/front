"use client";

import React from "react";

interface TransactionStatusProps {
  status: string;
}

/**
 * 💬 交易状态提示组件
 */
export function TransactionStatus({ status }: TransactionStatusProps) {
  if (!status) return null;

  const [prefix, message] = status.includes("|")
    ? status.split("|", 2)
    : ["", status];

  const normalizedPrefix = prefix as "pending" | "success" | "error" | "";

  const isLoading =
    normalizedPrefix === "pending" ||
    (!normalizedPrefix && (status.includes("等待") || status.includes("中")));
  const isSuccess =
    normalizedPrefix === "success" ||
    (!normalizedPrefix && status.includes("成功"));
  const isError =
    normalizedPrefix === "error" ||
    (!normalizedPrefix && status.includes("失败"));

  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center gap-2">
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}

        {isSuccess && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}

        {isError && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}

        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
