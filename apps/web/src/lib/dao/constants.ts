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
  COURSE_RULES: "courseRules",
  REWARD_DISTRIBUTION: "rewardDistribution",
  NFT_RULES: "nftRules",
  PLATFORM_RULES: "platformRules",
  PRICING_RULES: "pricingRules",
} as const;

// 提案类别颜色映射
export const CATEGORY_COLORS: Record<
  (typeof PROPOSAL_CATEGORIES)[keyof typeof PROPOSAL_CATEGORIES],
  string
> = {
  courseRules: "bg-blue-500",
  rewardDistribution: "bg-green-500",
  nftRules: "bg-purple-500",
  platformRules: "bg-orange-500",
  pricingRules: "bg-pink-500",
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
export const PROPOSAL_TABS_DAO = [
  { key: "proposal", labelKey: "proposal" },
  { key: "dispute", labelKey: "dispute" },
  { key: "history", labelKey: "history" },
] as const;
export const PROPOSAL_TABS = [
  { key: "active", labelKey: "filters.active" },
  { key: "passed", labelKey: "filters.passed" },
  { key: "rejected", labelKey: "filters.rejected" },
] as const;
// 合约地址（根据网络动态获取）
export const DAO_CONTRACTS = {
  GOVERNANCE: process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  TOKEN: process.env.NEXT_PUBLIC_TOKEN_CONTRACT,
  NFT: process.env.NEXT_PUBLIC_NFT_CONTRACT,
} as const;
