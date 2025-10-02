import { ProposalCategory, ProposalStatus } from "@/types/dao";

// ==================== 提案类别 ====================

/**
 * 所有提案类别
 */
export const PROPOSAL_CATEGORIES: readonly ProposalCategory[] = [
  "课程购买",
  "奖励分配",
  "NFT铸造",
  "平台规则",
  "促销规则",
] as const;

/**
 * 提案类别对应的颜色（Tailwind CSS）
 */
export const CATEGORY_COLORS: Record<ProposalCategory, string> = {
  课程购买: "bg-blue-500",
  奖励分配: "bg-green-500",
  NFT铸造: "bg-purple-500",
  平台规则: "bg-orange-500",
  促销规则: "bg-pink-500",
};

/**
 * 提案类别对应的图标（可选，使用 lucide-react）
 */
export const CATEGORY_ICONS: Record<ProposalCategory, string> = {
  课程购买: "BookOpen",
  奖励分配: "Gift",
  NFT铸造: "Sparkles",
  平台规则: "Shield",
  促销规则: "Tag",
};

/**
 * 提案类别描述
 */
export const CATEGORY_DESCRIPTIONS: Record<ProposalCategory, string> = {
  课程购买: "提议购买或引进新的课程内容",
  奖励分配: "关于社区奖励和激励措施的提案",
  NFT铸造: "提议铸造新的 NFT 或 NFT 系列",
  平台规则: "修改或新增平台治理规则",
  促销规则: "关于平台促销活动的提案",
};

// ==================== 提案状态 ====================

/**
 * 提案状态标签（中文）
 */
export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  active: "进行中",
  passed: "已通过",
  rejected: "已驳回",
  executed: "已执行",
};

/**
 * 提案状态对应的颜色
 */
export const STATUS_COLORS: Record<ProposalStatus, string> = {
  active: "bg-blue-100 text-blue-700",
  passed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  executed: "bg-purple-100 text-purple-700",
};

/**
 * 提案状态对应的图标
 */
export const STATUS_ICONS: Record<ProposalStatus, string> = {
  active: "Clock",
  passed: "CheckCircle",
  rejected: "XCircle",
  executed: "Check",
};

// ==================== DAO 配置 ====================

/**
 * DAO 默认配置
 */
export const DAO_CONFIG = {
  /** 创建提案所需的最小代币数量 */
  MIN_TOKENS_TO_PROPOSE: 100,

  /** 默认投票时长（天） */
  DEFAULT_VOTING_PERIOD: 7,

  /** 最小投票时长（天） */
  MIN_VOTING_PERIOD: 1,

  /** 最大投票时长（天） */
  MAX_VOTING_PERIOD: 30,

  /** 默认法定人数 */
  DEFAULT_QUORUM: 1000,

  /** 最小法定人数 */
  MIN_QUORUM: 100,

  /** 提案通过所需的最低赞成票百分比 */
  PASS_THRESHOLD_PERCENTAGE: 50,

  /** 提案标题最大长度 */
  MAX_TITLE_LENGTH: 100,

  /** 提案描述最大长度 */
  MAX_DESCRIPTION_LENGTH: 2000,

  /** 每页显示的提案数量 */
  PROPOSALS_PER_PAGE: 10,
} as const;

// ==================== 会员等级 ====================

/**
 * 会员等级配置
 */
export const MEMBER_LEVELS = {
  bronze: {
    name: "青铜会员",
    minTokens: 0,
    color: "text-amber-700",
    benefits: ["基础投票权", "参与讨论"],
  },
  silver: {
    name: "白银会员",
    minTokens: 100,
    color: "text-gray-400",
    benefits: ["提案权", "优先投票", "社区徽章"],
  },
  gold: {
    name: "黄金会员",
    minTokens: 500,
    color: "text-yellow-500",
    benefits: ["双倍投票权", "专属频道", "月度奖励"],
  },
  diamond: {
    name: "钻石会员",
    minTokens: 1000,
    color: "text-blue-400",
    benefits: ["三倍投票权", "治理委员会", "年度分红"],
  },
} as const;

// ==================== 错误消息 ====================

/**
 * DAO 相关错误消息
 */
export const DAO_ERROR_MESSAGES = {
  INSUFFICIENT_TOKENS: "代币不足，无法创建提案",
  INVALID_VOTING_PERIOD: "投票时长不在有效范围内",
  INVALID_QUORUM: "法定人数设置不合理",
  PROPOSAL_NOT_FOUND: "提案不存在",
  VOTING_ENDED: "投票已结束",
  ALREADY_VOTED: "您已经投过票了",
  NOT_MEMBER: "您还不是 DAO 成员",
  WALLET_NOT_CONNECTED: "请先连接钱包",
  TRANSACTION_FAILED: "交易失败，请重试",
  TITLE_TOO_LONG: `标题不能超过 ${DAO_CONFIG.MAX_TITLE_LENGTH} 个字符`,
  DESCRIPTION_TOO_LONG: `描述不能超过 ${DAO_CONFIG.MAX_DESCRIPTION_LENGTH} 个字符`,
} as const;

// ==================== 成功消息 ====================

/**
 * DAO 相关成功消息
 */
export const DAO_SUCCESS_MESSAGES = {
  PROPOSAL_CREATED: "提案创建成功！",
  VOTE_SUBMITTED: "投票提交成功！",
  PROPOSAL_EXECUTED: "提案执行成功！",
  MEMBER_JOINED: "欢迎加入 DAO！",
} as const;
