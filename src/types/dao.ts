/**
 * DAO 治理相关类型定义
 */
import { Proposal } from "@/lib/api/dao";
export type ProposalStatus =
  | "pending"
  | "active"
  | "passed"
  | "rejected"
  | "executed"
  | "cancelled";

export type ProposalCategory =
  | "课程规则"
  | "奖励分配"
  | "NFT规则"
  | "平台规则"
  | "定价规则";

export type ProposalTabKey = "active" | "passed" | "rejected";
export type DaoTabKey = "proposal" | "dispute" | "history";
// export interface Proposal {
//   id: number;
//   title: string;
//   description: string;
//   author: string;
//   startTime: string;
//   endTime: string;
//   status: ProposalStatus;
//   votesFor: number;
//   votesAgainst: number;
//   quorum: number;
//   category: ProposalCategory;
//   executed?: boolean;
//   executionTime?: string;
// }

export interface VoteStats {
  forPercentage: number;
  againstPercentage: number;
  totalVotes: number;
}

export interface QuorumStats {
  quorumProgress: number;
  quorumReached: boolean;
  passed: boolean;
}

export interface UserVotingPower {
  tokenBalance: number;
  votingPower: number;
  hasVoted: boolean;
  voteChoice?: "for" | "against";
}

export interface DAOStats {
  totalVotes: string;
  holders: string;
  treasury: string;
  proposalsCount: number;
}

export interface ProposalsByStatus {
  active: Proposal[];
  passed: Proposal[];
  rejected: Proposal[];
}
export interface DaoByStatus {
  proposal: Proposal[];
  dispute: Proposal[];
  history: Proposal[];
}
/**
 * 创建课程质量投票提案 - 入参接口
 */
export interface CreateProposalRequest {
  /** 课程ID */
  courseId: number;

  /** 发起原因/描述（10-500字） */
  reason: string;

  /** 提案人钱包地址 */
  proposerWallet: string;

  /** 提案押金（YD币数量） */
  proposalDeposit: string;
}
// API 响应数据类型
export interface ApiProposal {
  proposalId: number;
  courseId: number;
  proposerWallet: string;
  reason: string;
  proposalDeposit: string;
  votingStartTime: string;
  votingEndTime: string;
  forVotes: string;
  againstVotes: string;
  totalVotingPower: string;
  status: string;
  executed: boolean;
  course: {
    courseId: number;
    title: string;
    instructorWallet: string;
  };
  votes: Array<{
    id: number;
    voterWallet: string;
    option: number;
    votingPower: string;
    rewardClaimed: boolean;
  }>;
}

export interface ApiResponse {
  proposals: ApiProposal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
