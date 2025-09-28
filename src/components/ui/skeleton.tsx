import clsx from "clsx";
// 这个组件用于展示骨架屏效果
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-xl bg-gradient-to-r from-[#F2F2FF] via-[#FFFFFF] to-[#F2F2FF]",
        className,
      )}
    />
  );
}
