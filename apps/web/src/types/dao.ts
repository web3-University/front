// ==================== DAO 相关类型定义 ====================

/**
 * 提案状态
 */
export type ProposalStatus = "active" | "passed" | "rejected" | "executed";

/**
 * 提案类别
 */
export type ProposalCategory =
  | "课程购买"
  | "奖励分配"
  | "NFT铸造"
  | "平台规则"
  | "促销规则";

/**
 * 提案数据结构
 */
export interface Proposal {
  /** 提案 ID */
  id: number;
  /** 提案标题 */
  title: string;
  /** 提案详细描述 */
  description: string;
  /** 提案类别 */
  category: ProposalCategory;
  /** 提案状态 */
  status: ProposalStatus;
  /** 赞成票数 */
  votesFor: number;
  /** 反对票数 */
  votesAgainst: number;
  /** 法定投票人数（达到此数量提案才有效） */
  quorum: number;
  /** 投票结束时间 (ISO 8601 格式) */
  endTime: string;
  /** 提案发起人钱包地址 */
  proposer: string;
  /** 创建时间 */
  createdAt?: string;
  /** 执行时间（仅当 status 为 executed 时） */
  executedAt?: string;
  /** 链上交易哈希 */
  txHash?: string;
}

/**
 * 投票记录
 */
export interface Vote {
  /** 提案 ID */
  proposalId: number;
  /** 投票人钱包地址 */
  voter: string;
  /** 是否支持提案（true=赞成, false=反对） */
  support: boolean;
  /** 投票权重（基于代币持有量） */
  votingPower: number;
  /** 投票时间戳 */
  timestamp: string;
  /** 链上交易哈希 */
  txHash?: string;
}

/**
 * DAO 成员信息
 */
export interface DAOMember {
  /** 钱包地址 */
  address: string;
  /** 投票权（基于代币持有量） */
  votingPower: number;
  /** 创建的提案数量 */
  proposalsCreated: number;
  /** 参与投票的次数 */
  votesParticipated: number;
  /** 加入 DAO 的时间 */
  joinedAt: string;
  /** 会员等级（可选） */
  memberLevel?: "bronze" | "silver" | "gold" | "diamond";
}

/**
 * DAO 统计数据
 */
export interface DAOStats {
  /** 总提案数 */
  totalProposals: number;
  /** 进行中的提案数 */
  activeProposals: number;
  /** 已通过的提案数 */
  passedProposals: number;
  /** 已驳回的提案数 */
  rejectedProposals: number;
  /** DAO 成员总数 */
  totalMembers: number;
  /** 总投票次数 */
  totalVotes: number;
  /** 金库余额（ETH） */
  treasuryBalance: string;
  /** 治理代币总供应量 */
  totalTokenSupply?: string;
}

/**
 * 创建提案的表单数据
 */
export interface CreateProposalForm {
  /** 提案标题 */
  title: string;
  /** 提案描述 */
  description: string;
  /** 提案类别 */
  category: ProposalCategory;
  /** 投票时长（天） */
  votingPeriod: number;
  /** 法定人数 */
  quorum: number;
}

/**
 * 提案筛选参数
 */
export interface ProposalFilter {
  /** 按状态筛选 */
  status?: ProposalStatus;
  /** 按类别筛选 */
  category?: ProposalCategory;
  /** 按发起人筛选 */
  proposer?: string;
  /** 搜索关键词 */
  searchKeyword?: string;
}

/**
 * 提案排序方式
 */
export type ProposalSortBy =
  | "newest" // 最新
  | "oldest" // 最早
  | "mostVotes" // 票数最多
  | "endingSoon"; // 即将结束

/**
 * 投票结果统计
 */
export interface VotingResult {
  /** 提案 ID */
  proposalId: number;
  /** 赞成票数 */
  votesFor: number;
  /** 反对票数 */
  votesAgainst: number;
  /** 总投票数 */
  totalVotes: number;
  /** 赞成百分比 */
  forPercentage: number;
  /** 反对百分比 */
  againstPercentage: number;
  /** 法定人数进度百分比 */
  quorumProgress: number;
  /** 是否达到法定人数 */
  quorumReached: boolean;
  /** 是否通过（赞成票 > 反对票 且达到法定人数） */
  passed: boolean;
}
