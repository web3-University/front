"use client";

import {
  useCourseContract,
  useSimpleYDToken,
  useWalletConnection,
  useWalletInfo,
} from "@web3-university/uni-wallet-lib";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";

interface CourseButtonProps {
  course: {
    id: string | number;
    price: number;
    title: string;
  };
}

const COURSE_CONTRACT_ADDRESS =
  "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d" as const;

const CourseButton = ({ course }: CourseButtonProps) => {
  const { isConnected } = useWalletInfo();
  const { connect } = useWalletConnection();

  const [isApproving, setIsApproving] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { approve, approveReceipt, refetchAllowance } = useSimpleYDToken({
    spenderAddress: COURSE_CONTRACT_ADDRESS,
  });

  const { purchaseCourse, purchaseCourseReceipt } = useCourseContract({
    address: COURSE_CONTRACT_ADDRESS,
    tokenDecimals: 18,
  });

  const approveLabel = useMemo(() => {
    if (!isConnected) return "连接钱包";
    return isApproving ? "授权中..." : "授权购买";
  }, [isConnected, isApproving]);

  const buyLabel = useMemo(() => {
    if (!isConnected) return "连接钱包";
    return isPurchasing ? "购买中..." : "立即购买";
  }, [isConnected, isPurchasing]);

  const ensureConnected = async () => {
    if (!isConnected) {
      try {
        connect();
        alert("正在尝试连接钱包，请在钱包中确认");
      } catch {
        alert("连接钱包失败，请重试");
      }
      return false;
    }
    return true;
  };

  const handleApprove = async () => {
    const ok = await ensureConnected();
    if (!ok) return;
    try {
      setIsApproving(true);
      await approve(COURSE_CONTRACT_ADDRESS, String(course.price));
      if (approveReceipt?.status === "success") {
        alert("授权成功！现在可以购买课程了");
        refetchAllowance();
      } else {
        alert("已提交授权交易，请等待确认");
      }
    } catch {
      alert("授权失败，请重试");
    } finally {
      setIsApproving(false);
    }
  };

  const handlePurchase = async () => {
    const ok = await ensureConnected();
    if (!ok) return;
    try {
      setIsPurchasing(true);
      const courseIdNum =
        typeof course.id === "string" ? parseInt(course.id) : course.id;
      await purchaseCourse(BigInt(courseIdNum));
      if (purchaseCourseReceipt?.status === "success") {
        alert(`成功购买课程：${course.title}`);
      } else {
        alert("已提交购买交易，请等待确认");
      }
    } catch {
      alert("购买失败，请重试");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        className="mt-auto"
        onClick={handleApprove}
        disabled={isApproving}
      >
        {approveLabel}
      </Button>
      <Button
        variant="primary"
        className="mt-auto"
        onClick={handlePurchase}
        disabled={isPurchasing}
      >
        {buyLabel}
      </Button>
    </div>
  );
};

export default CourseButton;
