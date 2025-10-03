/**
 * DAO 治理相关类型定义
 */

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

export interface Proposal {
  id: number;
  title: string;
  description: string;
  author: string;
  startTime: string;
  endTime: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  category: ProposalCategory;
  executed?: boolean;
  executionTime?: string;
}

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
