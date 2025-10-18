"use client";

import { Button } from "../ui/button";

interface CourseButtonProps {
  onPurchase?: () => void; // 不需要参数，在 CourseItem 中已绑定
  isPurchasing?: boolean;
}

/**
 * 课程购买按钮 - 纯展示组件
 * 不持有课程数据，只负责显示和触发回调
 */
const CourseButton = ({ onPurchase, isPurchasing }: CourseButtonProps) => {
  return (
    <Button
      variant="primary"
      fullWidth
      className="mt-auto"
      onClick={onPurchase}
      disabled={isPurchasing}
    >
      {isPurchasing ? (
        <span className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          处理中...
        </span>
      ) : (
        "立即购买"
      )}
    </Button>
  );
};

export default CourseButton;
