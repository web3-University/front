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
export type DaoTabKey = "proposal" | "dispute" | "history";
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
// 转换函数
export function convertApiToMockFormat(apiResponse: ApiResponse): Proposal[] {
  return apiResponse.proposals.map((proposal) => {
    const formatWallet = (wallet: string): string => {
      if (!wallet || wallet.length < 10) return wallet;
      return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
    };

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

    const convertStatus = (status: string): ProposalStatus => {
      const statusMap: Record<string, ProposalStatus> = {
        Active: "active",
        Pending: "pending",
        Succeeded: "passed",
        Failed: "rejected",
        Executed: "executed",
        Cancelled: "cancelled",
        Rejected: "rejected", // 添加这个映射
      };
      if (statusMap[status]) return statusMap[status];
      const lower = status.toLowerCase();
      if (
        lower === "active" ||
        lower === "pending" ||
        lower === "passed" ||
        lower === "rejected" ||
        lower === "executed" ||
        lower === "cancelled"
      ) {
        return lower as ProposalStatus;
      }
      return "pending";
    };

    const getCategory = (reason: string): ProposalCategory => {
      if (reason.includes("课程") || reason.includes("内容")) {
        return "课程规则";
      } else if (reason.includes("奖励") || reason.includes("代币")) {
        return "奖励分配";
      } else if (reason.includes("NFT")) {
        return "NFT规则";
      } else if (reason.includes("定价") || reason.includes("价格")) {
        return "定价规则";
      } else {
        return "平台规则";
      }
    };

    return {
      id: proposal.proposalId,
      title: `关于"${proposal.course?.title || "平台规则"}"的${proposal.courseId ? "争议" : ""}提案`,
      description: proposal.reason,
      author: formatWallet(proposal.proposerWallet),
      startTime: formatDate(proposal.votingStartTime),
      endTime: formatDate(proposal.votingEndTime),
      status: convertStatus(proposal.status),
      votesFor: parseInt(proposal.forVotes) || 0,
      votesAgainst: parseInt(proposal.againstVotes) || 0,
      quorum: parseInt(proposal.totalVotingPower) || 100000,
      category: getCategory(proposal.reason),
      courseId: proposal.courseId, // 保留 courseId 用于分类
    };
  });
}
