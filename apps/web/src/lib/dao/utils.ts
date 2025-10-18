/**
 * DAO 治理相关工具函数
 */

import type { Proposal, QuorumStats, VoteStats } from "@/types/dao";

/**
 * 计算提案的投票百分比
 */
export function calculateVotePercentages(proposal: Proposal): VoteStats {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;

  const forPercentage =
    totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  const againstPercentage =
    totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  return {
    forPercentage: Number(forPercentage.toFixed(1)),
    againstPercentage: Number(againstPercentage.toFixed(1)),
    totalVotes,
  };
}

/**
 * 计算法定人数进度
 */
export function calculateQuorumProgress(proposal: Proposal): QuorumStats {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const quorumProgress = (totalVotes / proposal.quorum) * 100;

  return {
    quorumProgress: Number(quorumProgress.toFixed(1)),
    quorumReached: totalVotes >= proposal.quorum,
    passed:
      totalVotes >= proposal.quorum &&
      proposal.votesFor > proposal.votesAgainst,
  };
}

/**
 * 检查提案是否已结束
 */
export function isProposalEnded(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

/**
 * 检查提案是否处于投票中
 */
export function isProposalActive(proposal: Proposal): boolean {
  return proposal.status === "active" && !isProposalEnded(proposal.endTime);
}

/**
 * 格式化投票数量
 */
export function formatVoteCount(votes: number): string {
  if (votes >= 1000000) {
    return `${(votes / 1000000).toFixed(1)}M`;
  }
  if (votes >= 1000) {
    return `${(votes / 1000).toFixed(1)}K`;
  }
  return votes.toLocaleString();
}

/**
 * 计算剩余时间
 */
export function getTimeRemaining(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "已结束";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `剩余 ${days} 天`;
  if (hours > 0) return `剩余 ${hours} 小时`;
  if (minutes > 0) return `剩余 ${minutes} 分钟`;
  return "即将结束";
}

/**
 * 验证地址格式
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 缩短地址显示
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * 格式化日期显示
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * 获取提案状态文本
 */
export function getProposalStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "待开始",
    active: "进行中",
    passed: "已通过",
    rejected: "未通过",
    executed: "已执行",
    cancelled: "已取消",
  };
  return statusMap[status] || status;
}
