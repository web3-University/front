"use client";

import {
  useCourseContract,
  useSimpleYDToken,
  useWalletConnection,
} from "@web3-university/uni-wallet-lib";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatUnits } from "viem";
import { purchaseCourse as purchaseCourseAPI } from "@/lib/api/course";

/**
 * 购买状态枚举
 */
export enum PurchaseStatus {
  IDLE = "IDLE", // 空闲状态
  CHECKING_WALLET = "CHECKING_WALLET", // 检查钱包连接
  AUTHENTICATING = "AUTHENTICATING", // 进行签名认证
  CHECKING_ALLOWANCE = "CHECKING_ALLOWANCE", // 检查授权额度
  APPROVING_TOKEN = "APPROVING_TOKEN", // 授权 Token
  WAITING_APPROVE = "WAITING_APPROVE", // 等待授权确认
  PURCHASING_COURSE = "PURCHASING_COURSE", // 调用购买合约
  WAITING_TRANSACTION = "WAITING_TRANSACTION", // 等待交易确认
  SAVING_TO_DB = "SAVING_TO_DB", // 保存到数据库
  SUCCESS = "SUCCESS", // 购买成功
  ERROR = "ERROR", // 购买失败
}

/**
 * 购买课程参数
 */
export interface PurchaseCourseParams {
  courseId: bigint; // 链上课程ID
  coursePrice: bigint; // 课程价格（bigint 格式）
}

/**
 * Hook 返回类型
 */
export interface UsePurchaseCourseReturn {
  // 状态
  status: PurchaseStatus;
  loading: boolean;
  error: string | null;
  transactionHash: string | null;

  // 方法
  purchaseCourse: (params: PurchaseCourseParams) => Promise<boolean>;
  reset: () => void;

  // 状态检查
  isWalletConnected: boolean;
  walletAddress: string | undefined;
}

/**
 * 购买课程自定义 Hook
 *
 * 完整流程：
 * 1. 检查钱包是否连接
 * 2. 检查是否已签名认证，未认证则触发签名
 * 3. 调用合约购买课程
 * 4. 等待交易确认
 * 5. 调用后端接口保存购买记录
 *
 * @example
 * ```tsx
 * const { purchaseCourse, loading, status } = usePurchaseCourse();
 *
 * const handleBuy = async () => {
 *   const success = await purchaseCourse({
 *     courseId: 1n,
 *     coursePrice: "299"
 *   });
 *   if (success) {
 *     console.log("购买成功！");
 *   }
 * };
 * ```
 */
export function usePurchaseCourse(): UsePurchaseCourseReturn {
  // 钱包连接状态
  const { address: walletAddress, isConnected } = useWalletConnection();
  // 课程合约地址
  const COURSE_CONTRACT_ADDRESS =
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" as `0x${string}`;

  // YD Token 合约交互
  const {
    allowance,
    approve,
    approveReceipt,
    refetchAllowance,
    balance: tokenBalance,
  } = useSimpleYDToken({
    spenderAddress: COURSE_CONTRACT_ADDRESS,
    enabled: true,
  });

  // 课程合约交互
  const { purchaseCourse: purchaseCourseContract, purchaseCourseReceipt } =
    useCourseContract({
      address: COURSE_CONTRACT_ADDRESS,
      tokenDecimals: 18,
    });

  // 本地状态
  const [status, setStatus] = useState<PurchaseStatus>(PurchaseStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // 用于存储购买参数，供 useEffect 使用
  const purchaseParamsRef = useRef<{
    courseId: bigint;
    coursePrice: bigint;
  } | null>(null);
  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setStatus(PurchaseStatus.IDLE);
    setError(null);
    setTransactionHash(null);
    purchaseParamsRef.current = null;
  }, []);
  // ========== 监听授权交易状态 ==========
  useEffect(() => {
    if (status === PurchaseStatus.WAITING_APPROVE) {
      if (approveReceipt.isSuccess) {
        console.log("✅ 授权交易确认成功！");
        // 授权成功后，会自动继续购买流程（通过 purchaseCourse 函数继续执行）
      } else if (approveReceipt.isError) {
        setError(
          "授权交易失败: " + (approveReceipt.error?.message || "未知错误"),
        );
        setStatus(PurchaseStatus.ERROR);
      }
    }
  }, [approveReceipt.isSuccess, approveReceipt.isError, status]);

  // ========== 监听购买交易状态 ==========
  useEffect(() => {
    if (status === PurchaseStatus.WAITING_TRANSACTION && transactionHash) {
      if (purchaseCourseReceipt.isSuccess) {
        // 调用后端 API 保存购买记录
        const saveToDB = async () => {
          if (!walletAddress || !purchaseParamsRef.current) {
            console.error("缺少必要参数");
            setStatus(PurchaseStatus.ERROR);
            return;
          }
          try {
            setStatus(PurchaseStatus.SAVING_TO_DB);
            console.log("💾 保存购买记录到数据库...");
            await purchaseCourseAPI({
              walletAddress,
              courseId: Number(purchaseParamsRef.current.courseId),
              transactionHash,
              amount: formatUnits(purchaseParamsRef.current.coursePrice, 18),
            });
            setStatus(PurchaseStatus.SUCCESS);
          } catch (err) {
            // 即使保存失败，链上交易已成功，所以仍然标记为成功
            setError(
              "保存到数据库失败，但链上交易已成功: " +
                (err instanceof Error ? err.message : "未知错误"),
            );
            setStatus(PurchaseStatus.ERROR);
          }
        };

        saveToDB();
      } else if (purchaseCourseReceipt.isError) {
        setError(
          "购买交易失败: " +
            (purchaseCourseReceipt.error?.message || "未知错误"),
        );
        setStatus(PurchaseStatus.ERROR);
      }
    }
  }, [
    purchaseCourseReceipt.isSuccess,
    purchaseCourseReceipt.isError,
    status,
    transactionHash,
    walletAddress,
  ]);

  /**
   * 购买课程主流程
   */
  const purchaseCourse = useCallback(
    async (params: PurchaseCourseParams): Promise<boolean> => {
      const { courseId, coursePrice } = params;
      console.log("购买课程参数:", courseId, coursePrice);

      try {
        // ========== 步骤 1: 检查钱包连接 ==========
        setStatus(PurchaseStatus.CHECKING_WALLET);
        setError(null);

        if (!isConnected || !walletAddress) {
          throw new Error("请先连接钱包");
        }
        // ========== 步骤 2: 检查签名认证 ==========
        setStatus(PurchaseStatus.AUTHENTICATING);
        // 获取 token（用于后端 API 调用）
        if (typeof window === "undefined") {
          throw new Error("无法在服务端访问认证令牌");
        }
        // const token = localStorage.getItem("AUTH_TOKEN");
        // if (!token) {
        //   throw new Error("未找到认证令牌，请重新登录");
        // }
        // ========== 步骤 3: 检查 Token 余额 ==========
        console.log("当前 YD Token 余额:", tokenBalance);
        console.log("课程价格:", coursePrice);

        if (!tokenBalance || tokenBalance < coursePrice) {
          throw new Error(
            `YD Token 余额不足。需要 ${formatUnits(coursePrice, 18)} YD，当前余额 ${formatUnits(tokenBalance, 18)} YD`,
          );
        }

        // ========== 步骤 4: 检查并授权 Token ==========
        setStatus(PurchaseStatus.CHECKING_ALLOWANCE);
        // 刷新授权额度
        await refetchAllowance();
        if (!allowance || allowance < coursePrice) {
          setStatus(PurchaseStatus.APPROVING_TOKEN);
          // 授权足够的金额（授权课程价格的 1.5 倍，避免频繁授权）
          const approveAmount = (coursePrice * BigInt(150)) / BigInt(100);
          console.log("授权金额:", approveAmount);

          const approveAmountStr = formatUnits(approveAmount, 18);
          const approveResult = await approve(
            COURSE_CONTRACT_ADDRESS,
            approveAmountStr,
          );
          if (!approveResult) {
            throw new Error("授权失败，未返回交易哈希");
          }
          setStatus(PurchaseStatus.WAITING_APPROVE);
        }
        // ========== 步骤 5: 调用智能合约购买课程 ==========
        setStatus(PurchaseStatus.PURCHASING_COURSE);
        const contractResult = await purchaseCourseContract(courseId);
        if (!contractResult) {
          throw new Error("合约调用失败，未返回交易哈希");
        }
        const txHash = contractResult;
        setTransactionHash(txHash);
        // ========== 步骤 6: 等待交易确认 ==========
        // 保存购买参数供 useEffect 使用
        purchaseParamsRef.current = { courseId, coursePrice };
        setStatus(PurchaseStatus.WAITING_TRANSACTION);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "购买课程失败，请稍后重试";
        setError(errorMessage);
        setStatus(PurchaseStatus.ERROR);
        return false;
      }
    },
    [
      isConnected,
      walletAddress,
      tokenBalance,
      allowance,
      approve,
      approveReceipt,
      refetchAllowance,
      purchaseCourseContract,
      purchaseCourseReceipt,
      COURSE_CONTRACT_ADDRESS,
    ],
  );
  return {
    // 状态
    status,
    loading:
      status !== PurchaseStatus.IDLE &&
      status !== PurchaseStatus.SUCCESS &&
      status !== PurchaseStatus.ERROR,
    error,
    transactionHash,
    // 方法
    purchaseCourse,
    reset,
    // 状态检查
    isWalletConnected: isConnected,
    walletAddress,
  };
}
