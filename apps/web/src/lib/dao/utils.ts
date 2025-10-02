import { Proposal, VotingResult, ProposalStatus } from "@/types/dao";
import { DAO_CONFIG } from "./constants";

// ==================== 投票相关工具函数 ====================

/**
 * 计算投票结果统计
 */
export function calculateVotingResult(proposal: Proposal): VotingResult {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage =
    totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage =
    totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  const quorumProgress = (totalVotes / proposal.quorum) * 100;
  const quorumReached = totalVotes >= proposal.quorum;
  const passed = quorumReached && proposal.votesFor > proposal.votesAgainst;

  return {
    proposalId: proposal.id,
    votesFor: proposal.votesFor,
    votesAgainst: proposal.votesAgainst,
    totalVotes,
    forPercentage: Number(forPercentage.toFixed(1)),
    againstPercentage: Number(againstPercentage.toFixed(1)),
    quorumProgress: Number(quorumProgress.toFixed(1)),
    quorumReached,
    passed,
  };
}

/**
 * 检查提案是否已结束
 */
export function isProposalEnded(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

/**
 * 检查提案是否仍在进行中
 */
export function isProposalActive(proposal: Proposal): boolean {
  return proposal.status === "active" && !isProposalEnded(proposal.endTime);
}

/**
 * 计算提案剩余时间
 * @returns 返回格式化的剩余时间字符串
 */
export function getTimeRemaining(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return "已结束";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} 天 ${hours} 小时`;
  } else if (hours > 0) {
    return `${hours} 小时 ${minutes} 分钟`;
  } else {
    return `${minutes} 分钟`;
  }
}

/**
 * 根据投票结果自动更新提案状态
 */
export function determineProposalStatus(proposal: Proposal): ProposalStatus {
  // 如果提案还在进行中，保持 active 状态
  if (!isProposalEnded(proposal.endTime)) {
    return "active";
  }

  // 投票已结束，计算结果
  const result = calculateVotingResult(proposal);

  if (result.passed) {
    return "passed";
  } else {
    return "rejected";
  }
}

// ==================== 验证相关工具函数 ====================

/**
 * 验证提案标题
 */
export function validateProposalTitle(title: string): {
  valid: boolean;
  error?: string;
} {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: "标题不能为空" };
  }

  if (title.length > DAO_CONFIG.MAX_TITLE_LENGTH) {
    return {
      valid: false,
      error: `标题不能超过 ${DAO_CONFIG.MAX_TITLE_LENGTH} 个字符`,
    };
  }

  return { valid: true };
}

/**
 * 验证提案描述
 */
export function validateProposalDescription(description: string): {
  valid: boolean;
  error?: string;
} {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: "描述不能为空" };
  }

  if (description.length > DAO_CONFIG.MAX_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: `描述不能超过 ${DAO_CONFIG.MAX_DESCRIPTION_LENGTH} 个字符`,
    };
  }

  return { valid: true };
}

/**
 * 验证投票时长
 */
export function validateVotingPeriod(days: number): {
  valid: boolean;
  error?: string;
} {
  if (days < DAO_CONFIG.MIN_VOTING_PERIOD) {
    return {
      valid: false,
      error: `投票时长不能少于 ${DAO_CONFIG.MIN_VOTING_PERIOD} 天`,
    };
  }

  if (days > DAO_CONFIG.MAX_VOTING_PERIOD) {
    return {
      valid: false,
      error: `投票时长不能超过 ${DAO_CONFIG.MAX_VOTING_PERIOD} 天`,
    };
  }

  return { valid: true };
}

/**
 * 验证法定人数
 */
export function validateQuorum(quorum: number): {
  valid: boolean;
  error?: string;
} {
  if (quorum < DAO_CONFIG.MIN_QUORUM) {
    return {
      valid: false,
      error: `法定人数不能少于 ${DAO_CONFIG.MIN_QUORUM}`,
    };
  }

  return { valid: true };
}

// ==================== 格式化工具函数 ====================

/**
 * 格式化投票数量（添加千位分隔符）
 */
export function formatVoteCount(count: number): string {
  return count.toLocaleString("zh-CN");
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * 格式化日期时间
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 格式化相对时间（如：3天前，2小时前）
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} 天前`;
  } else if (hours > 0) {
    return `${hours} 小时前`;
  } else if (minutes > 0) {
    return `${minutes} 分钟前`;
  } else {
    return "刚刚";
  }
}

// ==================== 钱包地址相关 ====================

/**
 * 缩短钱包地址显示
 * @example "0x1234...5678"
 */
export function shortenAddress(
  address: string,
  startLength = 6,
  endLength = 4,
): string {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * 验证以太坊地址格式
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
