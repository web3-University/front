"use client";

import { useWalletInfo } from "@web3-university/uni-wallet-lib";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  CircleDollarSign,
  Filter,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";

// 交易类型
type TransactionType = "swap" | "purchase" | "refund";

// 交易记录接口
interface Transaction {
  id: number;
  type: TransactionType;
  amount: string;
  tokenSymbol: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  txHash?: string;
  // Swap 相关
  fromToken?: string;
  toToken?: string;
  fromAmount?: string;
  toAmount?: string;
  // 课程相关
  courseName?: string;
  courseId?: number;
}

// API 返回的交易数据结构
interface TransactionResponse {
  transactionId: number;
  transactionType: string;
  amount: string;
  status: string;
  createdAt: string;
  txHash?: string;
  fromToken?: string;
  toToken?: string;
  fromAmount?: string;
  toAmount?: string;
  course?: {
    courseId: number;
    title: string;
  };
}

const transactionTypeConfig = {
  swap: {
    label: "代币兑换",
    icon: RefreshCw,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  purchase: {
    label: "购买课程",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  refund: {
    label: "课程退款",
    icon: CircleDollarSign,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
};

const statusConfig = {
  completed: { label: "已完成", color: "text-green-600", bg: "bg-green-100" },
  pending: { label: "进行中", color: "text-yellow-600", bg: "bg-yellow-100" },
  failed: { label: "失败", color: "text-red-600", bg: "bg-red-100" },
};

export default function TransactionHistory() {
  const { address, isConnected } = useWalletInfo();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");

  useEffect(() => {
    if (address) {
      loadTransactions();
    }
  }, [address]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await http<
        { data: TransactionResponse[] } | TransactionResponse[]
      >(`/transactions/user?walletAddress=${address}`);

      // 处理可能包含 data 字段的响应
      let data: TransactionResponse[];
      if (response && typeof response === "object" && "data" in response) {
        data = response.data;
      } else {
        data = response as TransactionResponse[];
      }

      console.log("交易记录接口返回数据:", data);

      if (Array.isArray(data)) {
        const transformedTransactions = data.map(transformTransaction);
        setTransactions(transformedTransactions);
      } else {
        console.warn("交易记录接口返回的数据格式不正确:", data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("加载交易记录失败:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const transformTransaction = (tx: TransactionResponse): Transaction => {
    const type = tx.transactionType.toLowerCase() as TransactionType;
    return {
      id: tx.transactionId,
      type,
      amount: tx.amount,
      tokenSymbol: "YD",
      status: tx.status.toLowerCase() as Transaction["status"],
      timestamp: new Date(tx.createdAt).toLocaleString("zh-CN"),
      txHash: tx.txHash,
      fromToken: tx.fromToken,
      toToken: tx.toToken,
      fromAmount: tx.fromAmount,
      toAmount: tx.toAmount,
      courseName: tx.course?.title,
      courseId: tx.course?.courseId,
    };
  };

  const filteredTransactions =
    filterType === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filterType);

  const openBlockExplorer = (txHash: string) => {
    const url = `https://sepolia.etherscan.io/tx/${txHash}`;
    window.open(url, "_blank");
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Wallet className="mb-4 h-16 w-16 text-[#6A6D94]" />
        <p className="text-lg text-[#6A6D94]">请先连接钱包查看交易记录</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-[#8A71FF]" />
        <p className="text-lg text-[#6A6D94]">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm shadow-sm ring-1 ring-white/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#2B2558] mb-1">交易记录</h2>
            <p className="text-sm text-[#6A6D94]">
              共 {filteredTransactions.length} 笔交易
            </p>
          </div>
          <button
            onClick={loadTransactions}
            className="flex items-center gap-2 rounded-xl bg-[#F5F0FF] px-4 py-2 text-sm font-medium text-[#8A71FF] transition-all hover:bg-[#8A71FF] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            刷新
          </button>
        </div>

        {/* 筛选器 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#6A6D94]" />
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filterType === "all"
                  ? "bg-[#8A71FF] text-white"
                  : "bg-white/50 text-[#6A6D94] hover:bg-white"
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType("swap")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filterType === "swap"
                  ? "bg-[#8A71FF] text-white"
                  : "bg-white/50 text-[#6A6D94] hover:bg-white"
              }`}
            >
              代币兑换
            </button>
            <button
              onClick={() => setFilterType("purchase")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filterType === "purchase"
                  ? "bg-[#8A71FF] text-white"
                  : "bg-white/50 text-[#6A6D94] hover:bg-white"
              }`}
            >
              购买课程
            </button>
            <button
              onClick={() => setFilterType("refund")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filterType === "refund"
                  ? "bg-[#8A71FF] text-white"
                  : "bg-white/50 text-[#6A6D94] hover:bg-white"
              }`}
            >
              课程退款
            </button>
          </div>
        </div>
      </div>

      {/* 交易列表 */}
      {filteredTransactions.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white/60 p-12 backdrop-blur-sm shadow-sm ring-1 ring-white/60">
          <CircleDollarSign className="mb-4 h-16 w-16 text-[#6A6D94]" />
          <p className="text-lg text-[#6A6D94]">暂无交易记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => {
            const config = transactionTypeConfig[tx.type];
            const Icon = config.icon;
            const statusConf = statusConfig[tx.status];

            return (
              <div
                key={tx.id}
                className={`group overflow-hidden rounded-2xl bg-white/60 p-5 backdrop-blur-sm shadow-sm ring-1 ring-white/60 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  {/* 图标 */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${config.bgColor} ${config.borderColor}`}
                  >
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>

                  {/* 交易信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-[#2B2558] mb-1">
                          {config.label}
                        </h4>
                        <p className="text-sm text-[#6A6D94]">{tx.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#2B2558] mb-1">
                          {tx.type === "refund" ? "+" : "-"}
                          {tx.amount} {tx.tokenSymbol}
                        </p>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusConf.bg} ${statusConf.color}`}
                        >
                          {statusConf.label}
                        </span>
                      </div>
                    </div>

                    {/* 详细信息 */}
                    <div className="rounded-xl bg-[#F5F0FF] p-3 text-sm">
                      {tx.type === "swap" && (
                        <div className="flex items-center gap-2 text-[#6A6D94]">
                          <span className="font-medium">
                            {tx.fromAmount} {tx.fromToken}
                          </span>
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="font-medium">
                            {tx.toAmount} {tx.toToken}
                          </span>
                        </div>
                      )}
                      {(tx.type === "purchase" || tx.type === "refund") &&
                        tx.courseName && (
                          <div className="flex items-center gap-2 text-[#6A6D94]">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">{tx.courseName}</span>
                          </div>
                        )}
                      {tx.txHash && (
                        <button
                          onClick={() => openBlockExplorer(tx.txHash!)}
                          className="mt-2 flex items-center gap-1 text-xs text-[#8A71FF] hover:underline"
                        >
                          <span className="font-mono">
                            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                          </span>
                          <ArrowDownLeft className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
