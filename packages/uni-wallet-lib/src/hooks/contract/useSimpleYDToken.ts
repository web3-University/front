import { useState, useMemo } from "react";
import type { Address } from "viem";
import { parseEther, parseUnits, formatUnits } from "viem";
import type { UseWaitForTransactionReceiptReturnType as ReceiptReturnType } from "wagmi";
import { useAccount, useEstimateGas } from "wagmi";
import { SIMPLE_YD_TOKEN_ABI } from "../../contract";
import type { WriteReturnType } from "./contractFactory";
import { contractFactory } from "./contractFactory";
import type { UseContractReadReturn } from "./useContractRead";

interface UseSimpleYDTokenProps {
  address?: Address; // YD币合约地址 默认：0xA812265c869F2BCB755980677812F253459A0cc7
  spenderAddress?: Address; // 支付者地址
  enabled?: boolean; // 是否启用
}

interface StakeInfo {
  amount: bigint; // 质押金额
  startTime: number; // 质押开始时间
  lockPeriod: number; // 锁定期（秒）
  rewardRate: number; // 年化收益率（基点，10000 = 100%）
  lastClaimTime: number; // 上次领取收益时间
}

// const YD_CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const YD_CONTRACT_ADDRESS = "0x6Ebb0dAeEA2f89648aa077C57687fC851d199767";

export function useSimpleYDToken({
  address = YD_CONTRACT_ADDRESS,
  spenderAddress,
  enabled = true,
}: UseSimpleYDTokenProps): {
  // 代币总供应量
  totalSupply: bigint;
  // 当前用户的代币余额
  balance: bigint;
  // 格式化的余额（字符串）
  formattedBalance: string;
  // 代币精度
  decimals: number;
  // 当前用户对指定地址的授权额度
  allowance: bigint;
  // 转账收据
  transferReceipt: ReceiptReturnType;
  // 授权数据
  approveReceipt: ReceiptReturnType;
  // 代理转账数据
  transferFromReceipt: ReceiptReturnType;
  // 兑换YD币数据
  exchangeETHForTokensReceipt: ReceiptReturnType;
  // 质押YD代币数据
  stakeReceipt: ReceiptReturnType;
  // 解除质押数据
  unstakeReceipt: ReceiptReturnType;
  // 领取质押收益数据
  claimRewardReceipt: ReceiptReturnType;
  // 重新获取余额
  refetchBalance: () => void;
  // 重新获取授权额度
  refetchAllowance: () => void;
  // 获取质押信息
  getStakeInfo: (user: Address) => UseContractReadReturn<StakeInfo>;
  // 计算待领取奖励
  calculatePendingReward: (user: Address) => UseContractReadReturn<bigint>;
  // 检测是否可解除质押
  canUnstake: (user: Address) => UseContractReadReturn<boolean>;

  // 转账
  transfer: (to: Address, amount: string) => Promise<WriteReturnType>;
  // 授权函数
  approve: (spender: Address, amount: string) => Promise<WriteReturnType>;
  // 代理转账函数（从其他地址转账
  transferFrom: (
    from: Address,
    to: Address,
    amount: string,
  ) => Promise<WriteReturnType>;
  // ETH兑换YD币
  exchangeETHForTokens: (ether: string) => Promise<WriteReturnType>;
  // 质押YD代币
  stake: (amount: bigint, lockPeriod: bigint) => Promise<WriteReturnType>;
  // 解除质押
  unstake: (forceUnlock: boolean) => Promise<WriteReturnType>;
  // 领取质押收益
  claimReward: () => Promise<WriteReturnType>;
} {
  const { address: userAddress } = useAccount();

  const [estGasTo, setEstGasTo] = useState<Address>();
  const [estGasValue, setEstGasValue] = useState<bigint>();
  const { data: gasEstimate, refetch: refetchEstimateGas } = useEstimateGas({
    account: userAddress,
    to: estGasTo,
    value: estGasValue,
    query: {
      enabled: false,
    },
  });

  /* ========== 辅助方法 ========== */
  /**
   * 解析金额
   * 将字符串形式的金额转换为 bigint（考虑代币精度）
   * @param amount - 字符串形式的金额，如 '100.5'
   * @returns bigint 类型的代币数量
   * @throws 如果代币精度未加载，抛出错误
   */
  const parseAmount = (amount: string) => {
    if (!decimals) throw new Error("Decimals not loaded");
    return parseUnits(amount, decimals as number);
  };

  const prepareRefetchEstimateGas = async (to?: Address, value?: bigint) => {
    setEstGasTo(to);
    setEstGasValue(value);

    // 等待 React 下一次渲染周期，确保 state 更新
    await new Promise((resolve) => setTimeout(resolve, 0));

    console.log(`🔢 请求参数: to->${to} / value->${value}`);
    // 然后调用 refetch
    await refetchEstimateGas();
    console.log("⛽️ Estimate Gas:", gasEstimate);

    // ✅ 立即清理
    setEstGasTo(undefined);
    setEstGasValue(undefined);
  };

  const factory = contractFactory(address, SIMPLE_YD_TOKEN_ABI);

  /* ========== 读取合约数据 ========== */

  // 读取代币总供应量
  const { data: totalSupply } = factory.read("totalSupply")();

  // 读取当前用户的代币余额
  const { data: balance, refetch: refetchBalance } = factory.read<bigint>(
    "balanceOf",
    enabled && !!userAddress,
  )(userAddress);

  // 读取代币精度
  const { data: decimals } = factory.read<number>("decimals")();

  // 格式化代币
  const formattedBalance = useMemo(() => {
    if (balance && decimals) {
      const balanceString = formatUnits(balance, decimals);

      return `${Number(balanceString).toFixed(4)}`;
    }
    return "0.0000";
  }, [balance, decimals]);

  // 读取当前用户对指定地址的授权额度
  const { data: allowance, refetch: refetchAllowance } = factory.read(
    "allowance",
  )(userAddress, spenderAddress);

  // 获取质押信息
  const getStakeInfo = (user: Address) => {
    return factory.read<StakeInfo>("getStakeInfo")(user);
  };

  // 计算待领取奖励
  const calculatePendingReward = (user: Address) => {
    return factory.read<bigint>("calculatePendingReward")(user);
  };

  // 查检是否可解除质押
  const canUnstake = (user: Address) => {
    return factory.read<boolean>("canUnstake")(user);
  };

  /* ========== 合约写入方法 ========== */

  // 转账
  const transferWriter = factory.write("transfer");
  /**
   * 转账函数
   * 将代币从当前用户转账到指定地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '100.5'）
   * @returns 交易的 Promise
   * @throws 如果转账功能不可用，抛出错误
   */
  const transfer = async (to: Address, amount: string) => {
    const parsedAmount = parseAmount(amount);

    await prepareRefetchEstimateGas(to, parsedAmount);

    return transferWriter.send(to, parsedAmount, {
      gas: gasEstimate,
    });
  };

  // 授权
  const approveWriter = factory.write("approve");
  /**
   * 授权函数
   * 授权指定地址可以支配的代币数量
   * @param spender - 被授权地址
   * @param amount - 授权金额（字符串形式，如 '1000'）
   * @returns 交易的 Promise
   * @throws 如果授权功能不可用，抛出错误
   */
  const approve = async (spender: Address, amount: string) => {
    const parsedAmount = parseAmount(amount);
    // await prepareRefetchEstimateGas(YD_CONTRACT_ADDRESS, undefined);
    // , {
    //       gas: gasEstimate,
    //     }
    return approveWriter.send(spender, parsedAmount);
  };

  // 代理转账函数的写入 Hook
  const transferFromWriter = factory.write("transferFrom");
  /**
   * 代理转账函数
   * 从指定地址转账到另一个地址（需要提前授权）
   * @param from - 转出地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '50'）
   * @returns 交易的 Promise
   * @throws 如果代理转账功能不可用，抛出错误
   */
  const transferFrom = async (from: Address, to: Address, amount: string) => {
    const parsedAmount = parseAmount(amount);

    await prepareRefetchEstimateGas(to, parsedAmount);

    return transferFromWriter.send(from, to, parsedAmount);
  };

  // 兑换YD币
  const exchangeETHForTokensWriter = factory.write("exchangeETHForTokens");
  /**
   * 兑换YD币 (ETH -> YD)
   * @param ether 兑换的ETH金额
   * @returns
   */
  const exchangeETHForTokens = async (ether: string) => {
    await prepareRefetchEstimateGas(YD_CONTRACT_ADDRESS, parseEther(ether));

    return exchangeETHForTokensWriter.send({
      value: parseEther(ether),
      gas: gasEstimate,
    });
  };

  // 质押YD代币
  const stakeWriter = factory.write("stake");
  /**
   * 质押YD代币
   * @param amount 质押数量
   * @param lockPeriod 锁定期（30/90/180天）
   * @returns
   */
  const stake = async (amount: bigint, lockPeriod: bigint) => {
    return stakeWriter.send(amount, lockPeriod);
  };

  // 解除质押
  const unstakeWriter = factory.write("unstake");
  /**
   * 解除质押
   * @param forceUnlock 是否强制解锁（会扣除20%惩罚）
   * @returns
   */
  const unstake = async (forceUnlock: boolean) => {
    return unstakeWriter.send(forceUnlock);
  };

  // 领取质押收益
  const claimRewardWriter = factory.write("claimReward");
  /**
   * 领取质押收益
   * @returns
   */
  const claimReward = async () => {
    return claimRewardWriter.send();
  };

  return {
    /* 代币基本信息 */
    totalSupply: totalSupply as bigint,
    balance: balance as bigint,
    formattedBalance,
    decimals: decimals as number,
    allowance: allowance as bigint,
    transferReceipt: transferWriter.receipt,
    approveReceipt: approveWriter.receipt,
    transferFromReceipt: transferFromWriter.receipt,
    exchangeETHForTokensReceipt: exchangeETHForTokensWriter.receipt,
    stakeReceipt: stakeWriter.receipt,
    unstakeReceipt: unstakeWriter.receipt,
    claimRewardReceipt: claimRewardWriter.receipt,

    /* 方法 */
    refetchBalance,
    refetchAllowance,
    getStakeInfo,
    calculatePendingReward,
    canUnstake,

    transfer,
    approve,
    transferFrom,
    exchangeETHForTokens,
    stake,
    unstake,
    claimReward,
  };
}
