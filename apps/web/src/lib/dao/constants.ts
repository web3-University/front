/**
 * DAO 治理相关常量
 */

// 提案状态
export const PROPOSAL_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  PASSED: "passed",
  REJECTED: "rejected",
  EXECUTED: "executed",
  CANCELLED: "cancelled",
} as const;

// 提案类别
export const PROPOSAL_CATEGORIES = {
  COURSE_RULES: "课程规则",
  REWARD_DISTRIBUTION: "奖励分配",
  NFT_RULES: "NFT规则",
  PLATFORM_RULES: "平台规则",
  PRICING_RULES: "定价规则",
} as const;

// 提案类别颜色映射
export const CATEGORY_COLORS: Record<string, string> = {
  课程规则: "bg-blue-500",
  奖励分配: "bg-green-500",
  NFT规则: "bg-purple-500",
  平台规则: "bg-orange-500",
  定价规则: "bg-pink-500",
} as const;

// 投票权重计算
export const VOTING_POWER = {
  MIN_TOKEN_FOR_PROPOSAL: 10000, // 创建提案需要的最小代币数
  MIN_TOKEN_FOR_VOTE: 1, // 投票需要的最小代币数
  QUORUM_PERCENTAGE: 10, // 法定人数百分比
} as const;

// 时间配置
export const TIME_CONFIG = {
  VOTING_PERIOD: 7 * 24 * 60 * 60 * 1000, // 7天投票期（毫秒）
  EXECUTION_DELAY: 2 * 24 * 60 * 60 * 1000, // 2天执行延迟
} as const;

// Tab 配置
export const PROPOSAL_TABS = [
  { key: "active", label: "进行中" },
  { key: "passed", label: "已通过" },
  { key: "rejected", label: "未通过" },
] as const;

// 合约地址（根据网络动态获取）
export const DAO_CONTRACTS = {
  GOVERNANCE: process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  TOKEN: process.env.NEXT_PUBLIC_TOKEN_CONTRACT,
  NFT: process.env.NEXT_PUBLIC_NFT_CONTRACT,
} as const;
