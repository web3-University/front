import { parseUnits } from "viem";
import type { Address } from "viem";
import { useContractRead } from "./useContractRead";
import { useContractWrite } from "./useContractWrite";
import { ERC20_ABI } from "../../contract/";
import { useAccount } from "wagmi";
import type { UseWaitForTransactionReceiptReturnType as ReceiptReturnType } from "wagmi";

interface UseERC20Props {
  address: Address; // 代币合约地址
  spenderAddress?: Address; // 支付者地址
  enabled?: boolean; // 是否启用
}

export function useERC20({
  address,
  spenderAddress,
  enabled = true,
}: UseERC20Props): {
  // 代币总供应量
  totalSupply: bigint;
  // 当前用户的代币余额
  balance: bigint;
  // 当前用户对指定地址的授权额度
  allowance: bigint;
  // 转账收据
  transferReceipt: ReceiptReturnType;
  // 授权数据
  approveReceipt: ReceiptReturnType;
  // 代理转账数据
  transferFromReceipt: ReceiptReturnType;
  // 重新获取余额
  refetchBalance: () => void;
  // 重新获取授权额度
  refetchAllowance: () => void;
  // 转账
  transfer: (to: Address, amount: string) => Promise<any>;
  // 授权函数
  approve: (spender: Address, amount: string) => Promise<any>;
  // 代理转账函数（从其他地址转账
  transferFrom: (from: Address, to: Address, amount: string) => Promise<any>;
} {
  const { address: userAddress } = useAccount();

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

  /* ========== 读取合约数据 ========== */

  // 读取代币总供应量
  const { data: totalSupply } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    enabled,
  });

  // 读取当前用户的代币余额
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    enabled: enabled && !!userAddress,
  });

  // 读取代币精度
  const { data: decimals } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "decimals",
    enabled,
  });

  // 读取当前用户对指定地址的授权额度
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "allowance",
    args:
      userAddress && spenderAddress ? [userAddress, spenderAddress] : undefined,
    enabled: enabled && !!userAddress && !!spenderAddress,
  });

  /* ========== 合约写入方法 ========== */

  // 转账
  const transferWrite = useContractWrite({
    address,
    abi: ERC20_ABI,
    functionName: "transfer",
  });
  /**
   * 转账函数
   * 将代币从当前用户转账到指定地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '100.5'）
   * @returns 交易的 Promise
   * @throws 如果转账功能不可用，抛出错误
   */
  const transfer = async (to: Address, amount: string) => {
    if (!transferWrite.writeAsync) throw new Error("Transfer not available");
    const parsedAmount = parseAmount(amount);
    return transferWrite.writeAsync({ args: [to, parsedAmount] });
  };

  // 授权
  const approveWrite = useContractWrite({
    address,
    abi: ERC20_ABI,
    functionName: "approve",
  });
  /**
   * 授权函数
   * 授权指定地址可以支配的代币数量
   * @param spender - 被授权地址
   * @param amount - 授权金额（字符串形式，如 '1000'）
   * @returns 交易的 Promise
   * @throws 如果授权功能不可用，抛出错误
   */
  const approve = async (spender: Address, amount: string) => {
    if (!approveWrite.writeAsync) throw new Error("Approve not available");
    const parsedAmount = parseAmount(amount);
    return approveWrite.writeAsync({ args: [spender, parsedAmount] });
  };

  // 代理转账函数的写入 Hook
  const transferFromWrite = useContractWrite({
    address,
    abi: ERC20_ABI,
    functionName: "transferFrom",
  });
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
    if (!transferFromWrite.writeAsync)
      throw new Error("TransferFrom not available");
    const parsedAmount = parseAmount(amount);
    return transferFromWrite.writeAsync({ args: [from, to, parsedAmount] });
  };

  return {
    /* 代币基本信息 */
    totalSupply: totalSupply as bigint,
    balance: balance as bigint,
    allowance: allowance as bigint,
    transferReceipt: transferWrite.receipt,
    approveReceipt: approveWrite.receipt,
    transferFromReceipt: transferFromWrite.receipt,

    /* 方法 */
    refetchBalance,
    refetchAllowance,
    transfer,
    approve,
    transferFrom,
  };
}
