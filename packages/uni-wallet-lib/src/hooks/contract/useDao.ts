import { contractFactory } from "./contractFactory";
import type { Address } from "viem";
import { DAO_ABI } from "../../contract";

/**
 * DAO 提案状态枚举
 */
export enum ProposalStatus {
  Pending = 0,
  Active = 1,
  Defeated = 2,
  Succeeded = 3,
  Executed = 4,
  Cancelled = 5,
}

/**
 * 提案数据类型
 */
export interface Proposal {
  id: string;
  proposer: Address;
  startTime: bigint;
  endTime: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  status: ProposalStatus;
}

/**
 * DAO 合约 Hooks
 *
 * @param daoAddress DAO 合约地址
 * @returns DAO 合约的所有读写方法
 *
 * @example
 * ```tsx
 * const dao = useDAO('0x...')
 *
 * // 读取提案
 * const { data: proposal } = dao.getProposal('proposal-1')
 *
 * // 创建提案
 * const createProposal = dao.createProposal()
 * await createProposal.send('proposal-1')
 *
 * // 投票
 * const vote = dao.vote()
 * await vote.send('proposal-1', true)
 * ```
 */
export function useDAO(daoAddress: Address) {
  const factory = contractFactory(daoAddress, DAO_ABI);

  return {
    // ============================================
    // 📖 读取方法 (View Functions)
    // ============================================

    /**
     * 获取 YD Token 地址
     * @returns YD Token 合约地址
     */
    ydToken: () => factory.read<Address>("ydToken")(),

    /**
     * 获取创建提案所需的费用
     * @returns 费用金额 (wei)
     */
    createProposalFee: () => factory.read<bigint>("createProposalFee")(),

    /**
     * 获取投票周期时长
     * @returns 投票周期 (秒)
     */
    votingPeriod: () => factory.read<bigint>("votingPeriod")(),

    /**
     * 获取合约所有者地址
     * @returns 所有者地址
     */
    owner: () => factory.read<Address>("owner")(),

    /**
     * 获取提案详细信息
     * @param proposalId 提案 ID
     * @returns 提案完整数据
     *
     * @example
     * const { data: proposal } = dao.getProposal('proposal-1')
     * console.log(proposal.forVotes, proposal.againstVotes)
     */
    getProposal: (proposalId: string) => {
      const result =
        factory.read<[string, Address, bigint, bigint, bigint, bigint, number]>(
          "getProposal",
        )(proposalId);

      // 转换返回数据为更友好的格式
      return {
        ...result,
        data: result.data
          ? ({
              id: result.data[0],
              proposer: result.data[1],
              startTime: result.data[2],
              endTime: result.data[3],
              forVotes: result.data[4],
              againstVotes: result.data[5],
              status: result.data[6] as ProposalStatus,
            } as Proposal)
          : undefined,
      };
    },

    /**
     * 直接获取提案存储数据 (mapping 访问)
     * @param proposalId 提案 ID
     * @returns 提案完整数据
     */
    proposals: (proposalId: string) => {
      const result =
        factory.read<[string, Address, bigint, bigint, bigint, bigint, number]>(
          "proposals",
        )(proposalId);

      return {
        ...result,
        data: result.data
          ? ({
              id: result.data[0],
              proposer: result.data[1],
              startTime: result.data[2],
              endTime: result.data[3],
              forVotes: result.data[4],
              againstVotes: result.data[5],
              status: result.data[6] as ProposalStatus,
            } as Proposal)
          : undefined,
      };
    },

    /**
     * 检查提案是否可以执行
     * @param proposalId 提案 ID
     * @returns true 表示可以执行
     *
     * @example
     * const { data: canExec } = dao.canExecute('proposal-1')
     * if (canExec) {
     *   await executeProposal.send('proposal-1')
     * }
     */
    canExecute: (proposalId: string) =>
      factory.read<boolean>("canExecute")(proposalId),

    /**
     * 检查地址是否已投票
     * @param proposalId 提案 ID
     * @param voter 投票者地址
     * @returns true 表示已投票
     *
     * @example
     * const { data: voted } = dao.hasVoted('proposal-1', userAddress)
     */
    hasVoted: (proposalId: string, voter: Address) =>
      factory.read<boolean>("hasVoted")(proposalId, voter),

    /**
     * 获取投票选择
     * @param proposalId 提案 ID
     * @param voter 投票者地址
     * @returns true 表示支持，false 表示反对
     *
     * @example
     * const { data: support } = dao.getVoteChoice('proposal-1', userAddress)
     */
    getVoteChoice: (proposalId: string, voter: Address) =>
      factory.read<boolean>("getVoteChoice")(proposalId, voter),

    // ============================================
    // ✍️ 写入方法 (Write Functions)
    // ============================================

    /**
     * 创建新提案
     * @returns { send, receipt, writer }
     *
     * @example
     * const createProposal = dao.createProposal()
     * await createProposal.send('proposal-1')
     * console.log(createProposal.receipt.data?.transactionHash)
     */
    createProposal: () => factory.write("createProposal"),

    /**
     * 对提案投票
     * @returns { send, receipt, writer }
     *
     * @example
     * const vote = dao.vote()
     * await vote.send('proposal-1', true)  // true = 支持, false = 反对
     */
    vote: () => factory.write("vote"),

    /**
     * 执行提案
     * @returns { send, receipt, writer }
     *
     * @example
     * const executeProposal = dao.executeProposal()
     * await executeProposal.send('proposal-1')
     */
    executeProposal: () => factory.write("executeProposal"),

    /**
     * 取消提案
     * @returns { send, receipt, writer }
     *
     * @example
     * const cancelProposal = dao.cancelProposal()
     * await cancelProposal.send('proposal-1')
     */
    cancelProposal: () => factory.write("cancelProposal"),

    /**
     * 设置创建提案费用 (仅所有者)
     * @returns { send, receipt, writer }
     *
     * @example
     * const setFee = dao.setCreateProposalFee()
     * await setFee.send(parseEther('1'))
     */
    setCreateProposalFee: () => factory.write("setCreateProposalFee"),

    /**
     * 设置投票周期 (仅所有者)
     * @returns { send, receipt, writer }
     *
     * @example
     * const setPeriod = dao.setVotingPeriod()
     * await setPeriod.send(86400n) // 24小时
     */
    setVotingPeriod: () => factory.write("setVotingPeriod"),

    /**
     * 提取代币 (仅所有者)
     * @returns { send, receipt, writer }
     *
     * @example
     * const withdraw = dao.withdrawTokens()
     * await withdraw.send(recipientAddress, parseEther('100'))
     */
    withdrawTokens: () => factory.write("withdrawTokens"),

    /**
     * 转移合约所有权 (仅所有者)
     * @returns { send, receipt, writer }
     *
     * @example
     * const transfer = dao.transferOwnership()
     * await transfer.send(newOwnerAddress)
     */
    transferOwnership: () => factory.write("transferOwnership"),
  };
}

/**
 * 导出 ABI 供其他地方使用
 */
export { DAO_ABI };
