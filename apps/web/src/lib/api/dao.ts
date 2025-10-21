import { http } from "@/lib/http";

// ========== 类型定义 ==========

/** 提案状态 */
export type ProposalStatus =
  | "Active"
  | "Succeeded"
  | "Failed"
  | "Canceled"
  | "Executed";

/** 投票选项 */
export enum VoteOption {
  For = 0, // 支持课程
  Against = 1, // 反对课程
}

/** 课程信息 */
export interface Course {
  courseId: number;
  title: string;
  instructorWallet: string;
}

/** 投票记录 */
export interface Vote {
  id: number;
  voterWallet: string;
  option: number;
  votingPower: string;
  rewardClaimed: boolean;
  createdAt?: string;
}

/** 提案信息 */
export interface Proposal {
  proposalId: number;
  courseId: number;
  proposerWallet: string;
  reason: string;
  proposalDeposit?: number;
  votingStartTime: string;
  votingEndTime: string;
  forVotes: string;
  againstVotes: string;
  totalVotingPower: string;
  status: ProposalStatus;
  executed: boolean;
  executedAt?: string;
  course?: Course;
  votes?: Vote[];
}

/** 创建提案请求 */
export interface CreateProposalRequest {
  courseId: number | string;
  reason: string;
  proposerWallet: string;
  proposalDeposit?: number | string;
}

/** 投票请求 */
export interface VoteRequest {
  option: VoteOption | number;
  voterWallet: string;
  votingPower: string;
}

/** 获取提案列表查询参数 */
export interface GetProposalsQuery {
  page?: number;
  limit?: number;
  courseId?: number;
  status?: ProposalStatus;
  proposerWallet?: string;
  sortBy?: "createdAt" | "votingEndTime" | "forVotes" | "againstVotes";
  sortOrder?: "ASC" | "DESC";
}

/** 提案列表响应 */
export interface ProposalsResponse {
  proposals: Proposal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** DAO 统计信息 */
export interface DAOStats {
  totalProposals: number;
  activeProposals: number;
  succeededProposals: number;
  failedProposals: number;
  totalVoters: number;
}

/** 提案结果 */
export interface ProposalResult {
  proposalId: number;
  status: ProposalStatus;
  forVotes: string;
  againstVotes: string;
  totalVotingPower: string;
  hasReachedQuorum: boolean;
  isPassed: boolean;
}

/** 执行提案响应 */
export interface ExecuteProposalResponse {
  proposalId: number;
  status: ProposalStatus;
  executed: boolean;
  executedAt: string;
}

/** 领取奖励请求 */
export interface ClaimRewardRequest {
  voterWallet: string;
}

/** 领取奖励响应 */
export interface ClaimRewardResponse {
  reward: string;
}

/** 取消提案请求 */
export interface CancelProposalRequest {
  proposerWallet: string;
}

/** 取消提案响应 */
export interface CancelProposalResponse {
  proposalId: number;
  status: ProposalStatus;
  proposerWallet: string;
}

/** DAO 配置 */
export interface DAOConfig {
  proposalDeposit?: number;
  minVotingPower: string;
  votingPeriod: number;
  quorumPercentage: number;
  passThreshold: number;
  rewardPoolPercentage: number;
  cancelTimeLimit: number;
  isEnabled: boolean;
}

/** 通用 API 响应 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  statusCode?: number;
}

// ========== API 接口 ==========

/**
 * 创建课程质量投票提案
 * @param data 提案信息
 * @returns 创建的提案
 */
export const createProposal = (data: CreateProposalRequest) =>
  http<Proposal>("/dao/proposals", {
    method: "POST",
    body: data,
  });

/**
 * 对提案进行投票
 * @param proposalId 提案ID
 * @param data 投票信息
 * @returns 投票记录
 */
export const vote = (proposalId: number, data: VoteRequest) =>
  http<Vote>(`/dao/proposals/${proposalId}/vote`, {
    method: "POST",
    body: data,
  });

/**
 * 获取提案列表
 * @param params 查询参数
 * @returns 提案列表及分页信息
 */
export const getProposals = (params?: GetProposalsQuery) =>
  http<ProposalsResponse>("/dao/proposals", {
    method: "GET",
    params,
  });

/**
 * 获取单个提案详情
 * @param proposalId 提案ID
 * @returns 提案详情
 */
export const getProposalById = (proposalId: number) =>
  http<Proposal>(`/dao/proposals/${proposalId}`, {
    method: "GET",
  });

/**
 * 获取 DAO 统计信息
 * @returns DAO 统计数据
 */
export const getDAOStats = () =>
  http<DAOStats>("/dao/stats", {
    method: "GET",
  });

/**
 * 结束提案投票
 * @param proposalId 提案ID
 * @returns 投票结果
 */
export const finalizeProposal = (proposalId: number) =>
  http<ProposalResult>(`/dao/proposals/${proposalId}/finalize`, {
    method: "POST",
  });

/**
 * 执行提案
 * @param proposalId 提案ID
 * @returns 执行结果
 */
export const executeProposal = (proposalId: number) =>
  http<ExecuteProposalResponse>(`/dao/proposals/${proposalId}/execute`, {
    method: "POST",
  });

/**
 * 领取投票奖励
 * @param proposalId 提案ID
 * @param data 投票人信息
 * @returns 奖励金额
 */
export const claimReward = (proposalId: number, data: ClaimRewardRequest) =>
  http<ClaimRewardResponse>(`/dao/proposals/${proposalId}/claim-reward`, {
    method: "POST",
    body: data,
  });

/**
 * 取消提案
 * @param proposalId 提案ID
 * @param data 提案人信息
 * @returns 取消结果
 */
export const cancelProposal = (
  proposalId: number,
  data: CancelProposalRequest,
) =>
  http<CancelProposalResponse>(`/dao/proposals/${proposalId}/cancel`, {
    method: "POST",
    body: data,
  });

/**
 * 获取 DAO 配置
 * @returns DAO 配置参数
 */
export const getDAOConfig = () =>
  http<DAOConfig>("/dao/config", {
    method: "GET",
  });

// ========== 辅助函数 ==========

/**
 * 检查提案是否可以投票
 * @param proposal 提案
 * @returns 是否可投票
 */
export const canVote = (proposal: Proposal): boolean => {
  const now = new Date();
  const startTime = new Date(proposal.votingStartTime);
  const endTime = new Date(proposal.votingEndTime);
  return proposal.status === "Active" && now >= startTime && now <= endTime;
};

/**
 * 检查提案是否已结束
 * @param proposal 提案
 * @returns 是否已结束
 */
export const isProposalEnded = (proposal: Proposal): boolean => {
  const now = new Date();
  const endTime = new Date(proposal.votingEndTime);
  return now > endTime;
};

/**
 * 计算投票率
 * @param forVotes 支持票数
 * @param againstVotes 反对票数
 * @returns 支持率百分比
 */
export const calculateVoteRate = (
  forVotes: string,
  againstVotes: string,
): number => {
  const forNum = parseFloat(forVotes);
  const againstNum = parseFloat(againstVotes);
  const total = forNum + againstNum;
  return total > 0 ? (forNum / total) * 100 : 0;
};
