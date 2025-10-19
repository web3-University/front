"use client";

import {
  useCourseContract,
  useSimpleYDToken,
  useWalletConnection,
} from "@web3-university/uni-wallet-lib";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { COURSE_CONTRACT_ADDRESS } from "@/config";
import { PurchaseStatus } from "@/hooks/usePurchaseCourse";
import { purchaseCourse as purchaseCourseAPI } from "@/lib/api/course";
import { Button } from "../ui/button";

interface CourseButtonProps {
  courseId: string;
  coursePrice: number;
  courseTitle?: string;
  onPurchaseSuccess?: (transactionHash: string) => void;
  onPurchaseError?: (error: string) => void;
}

/**
 * 课程购买按钮 - 集成approve和购买功能
 */
const CourseButton = ({
  courseId,
  coursePrice,
  onPurchaseSuccess,
  onPurchaseError,
}: CourseButtonProps) => {
  const [status, setStatus] = useState<PurchaseStatus>(PurchaseStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // 钱包连接状态
  const { address: walletAddress, isConnected } = useWalletConnection();

  // YD Token 合约交互
  const {
    allowance,
    approve,
    approveReceipt,
    refetchAllowance,
    balance: tokenBalance,
  } = useSimpleYDToken({
    spenderAddress: COURSE_CONTRACT_ADDRESS,
    enabled: isConnected,
  });

  // 课程合约交互
  const { purchaseCourse: purchaseCourseContract, purchaseCourseReceipt } =
    useCourseContract();

  // 将价格转换为 bigint
  const coursePriceBigInt = useMemo(() => {
    return parseUnits(coursePrice.toString(), 18);
  }, [coursePrice]);

  // 检查是否需要授权
  const needsApproval = useMemo(() => {
    if (!allowance || !coursePriceBigInt) return true;
    return allowance < coursePriceBigInt;
  }, [allowance, coursePriceBigInt]);

  // 检查余额是否足够
  const hasEnoughBalance = useMemo(() => {
    if (!tokenBalance || !coursePriceBigInt) return false;
    return tokenBalance >= coursePriceBigInt;
  }, [tokenBalance, coursePriceBigInt]);

  /**
   * 处理授权
   */
  const handleApprove = useCallback(async () => {
    if (!isConnected || !walletAddress) {
      setError("请先连接钱包");
      return;
    }
    if (!hasEnoughBalance) {
      setError(`YD Token 余额不足`);
      return;
    }
    try {
      setStatus(PurchaseStatus.CHECKING_ALLOWANCE);
      setError(null);

      // 刷新授权额度
      await refetchAllowance();

      // 如果已经有足够的授权额度，仍然允许用户重新授权（增加额度）
      setStatus(PurchaseStatus.APPROVING_TOKEN);

      // 授权课程价格
      const approveAmountStr = formatUnits(coursePriceBigInt, 18);

      const approveResult = await approve(
        COURSE_CONTRACT_ADDRESS,
        approveAmountStr,
      );

      if (!approveResult) {
        throw new Error("授权失败，未返回交易哈希");
      }

      setStatus(PurchaseStatus.WAITING_APPROVE);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "授权失败，请稍后重试";
      setError(errorMessage);
      setStatus(PurchaseStatus.ERROR);
      onPurchaseError?.(errorMessage);
    }
  }, [
    isConnected,
    walletAddress,
    hasEnoughBalance,
    coursePriceBigInt,
    needsApproval,
    refetchAllowance,
    approve,
    COURSE_CONTRACT_ADDRESS,
    onPurchaseError,
  ]);

  /**
   * 处理购买
   */
  const handlePurchase = useCallback(async () => {
    if (!isConnected || !walletAddress) {
      setError("请先连接钱包");
      return;
    }

    if (!hasEnoughBalance) {
      setError(`YD Token 余额不足。`);
      return;
    }

    if (needsApproval) {
      setError("请先授权 YD Token");
      return;
    }

    // 验证 courseId
    const courseIdNum = Number(courseId);

    if (!courseId || courseIdNum <= 0 || isNaN(courseIdNum)) {
      setError("无效的课程ID");
      return;
    }

    try {
      setStatus(PurchaseStatus.PURCHASING_COURSE);
      setError(null);

      // 调用智能合约购买课程
      console.log(courseId);

      const contractResult = await purchaseCourseContract(courseId);

      if (!contractResult) {
        throw new Error("合约调用失败，未返回交易哈希");
      }

      const txHash = contractResult;
      setTransactionHash(txHash);
      setStatus(PurchaseStatus.WAITING_TRANSACTION);
    } catch (err) {
      console.error("购买课程失败:", err);
      const errorMessage =
        err instanceof Error ? err.message : "购买失败，请稍后重试";
      setError(errorMessage);
      setStatus(PurchaseStatus.ERROR);
      onPurchaseError?.(errorMessage);
    }
  }, [
    isConnected,
    walletAddress,
    hasEnoughBalance,
    needsApproval,
    coursePriceBigInt,
    courseId,
    purchaseCourseContract,
    onPurchaseError,
  ]);

  /**
   * 监听授权交易确认
   */
  useEffect(() => {
    if (approveReceipt && status === PurchaseStatus.WAITING_APPROVE) {
      console.log("授权交易确认:", approveReceipt);
      // 刷新授权额度
      refetchAllowance();
      // 延迟重置状态，确保allowance有时间更新
      setTimeout(() => {
        setStatus(PurchaseStatus.IDLE);
      }, 1000);
    }
  }, [approveReceipt, status, refetchAllowance]);

  /**
   * 监听购买交易确认
   */
  useEffect(() => {
    if (
      purchaseCourseReceipt &&
      status === PurchaseStatus.WAITING_TRANSACTION &&
      transactionHash
    ) {
      // 保存购买记录到数据库
      setStatus(PurchaseStatus.SAVING_TO_DB);

      purchaseCourseAPI({
        walletAddress: walletAddress!,
        courseId: Number(courseId),
        transactionHash,
        amount: formatUnits(coursePriceBigInt, 18),
      })
        .then(() => {
          setStatus(PurchaseStatus.SUCCESS);
          onPurchaseSuccess?.(transactionHash);
        })
        .catch((err) => {
          console.error("保存购买记录失败:", err);
          // 即使保存失败，购买也是成功的
          setStatus(PurchaseStatus.SUCCESS);
          onPurchaseSuccess?.(transactionHash);
        });
    }
  }, [
    purchaseCourseReceipt,
    status,
    transactionHash,
    walletAddress,
    courseId,
    coursePriceBigInt,
    onPurchaseSuccess,
  ]);

  // 计算按钮状态
  const isApproving =
    status === PurchaseStatus.CHECKING_ALLOWANCE ||
    status === PurchaseStatus.APPROVING_TOKEN ||
    status === PurchaseStatus.WAITING_APPROVE;

  const isPurchasing =
    status === PurchaseStatus.PURCHASING_COURSE ||
    status === PurchaseStatus.WAITING_TRANSACTION ||
    status === PurchaseStatus.SAVING_TO_DB;

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-2 mt-auto">
        <Button variant="secondary" fullWidth disabled>
          请先连接钱包
        </Button>
      </div>
    );
  }

  if (!hasEnoughBalance) {
    return (
      <div className="flex flex-col gap-2 mt-auto">
        <Button variant="secondary" fullWidth disabled>
          YD Token 余额不足
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-auto">
      {/* 按钮组 - 授权和购买按钮在同一排 */}
      <div className="flex gap-2">
        {/* 授权按钮 - 一直显示 */}
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleApprove}
          disabled={isApproving}
        >
          {isApproving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              授权中...
            </span>
          ) : (
            `授权 ${formatUnits(coursePriceBigInt, 18)} YD`
          )}
        </Button>

        {/* 购买按钮 */}
        <Button
          variant="primary"
          className="flex-1"
          onClick={handlePurchase}
          disabled={isPurchasing || needsApproval}
        >
          {isPurchasing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              购买中...
            </span>
          ) : needsApproval ? (
            "请先授权"
          ) : (
            "立即购买"
          )}
        </Button>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="text-red-500 text-sm mt-1">❌购买失败，请重试</div>
      )}

      {/* 成功信息 */}
      {status === PurchaseStatus.SUCCESS && (
        <div className="text-green-500 text-sm mt-1">🎉 购买成功！</div>
      )}
    </div>
  );
};

export default CourseButton;
