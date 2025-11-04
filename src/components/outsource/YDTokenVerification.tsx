"use client";

interface YDTokenVerificationProps {
  isAuthenticated: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  ydBalance: string;
  minRequired: number;
}

export default function YDTokenVerification({
  isAuthenticated,
  isVerifying,
  isVerified,
  ydBalance,
  minRequired,
}: YDTokenVerificationProps) {
  // 未连接钱包
  if (!isAuthenticated) {
    return (
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#EF4444] p-8 shadow-2xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 text-2xl font-bold text-white">
                请先连接钱包
              </h3>
              <p className="text-white/90">连接钱包后将自动验证您的YD币余额</p>
            </div>
          </div>
        </div>

        {/* 验证说明 */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="rounded-full bg-white/20 p-2">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-white">自动验证</h4>
              <p className="text-sm text-white/80">
                连接钱包后自动检查YD币余额
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="rounded-full bg-white/20 p-2">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-white">最低要求</h4>
              <p className="text-sm text-white/80">
                需持有至少 {minRequired} YD 币
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="rounded-full bg-white/20 p-2">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-white">获取奖励</h4>
              <p className="text-sm text-white/80">完成任务获得YD币奖励</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正在验证中
  if (isVerifying) {
    return (
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#8A71FF] to-[#FF9D6B] p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/30 p-3 backdrop-blur-sm">
            <svg
              className="h-6 w-6 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              正在自动验证您的YD币余额
            </h3>
            <p className="text-white/90">请稍候...</p>
          </div>
        </div>
      </div>
    );
  }

  // 验证通过 - 已是优质用户
  if (isVerified) {
    return (
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#4ADE80] via-[#34D399] to-[#10B981] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/30 p-3 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                ✨ 已验证优质用户
              </h3>
              <p className="text-white/90">YD币余额: {ydBalance} YD</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 px-4 py-2 font-semibold text-white backdrop-blur-sm">
              ⭐ 可接取任务
            </div>
          </div>
        </div>
      </div>
    );
  }

  // YD币余额不足
  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] p-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/30 p-3 backdrop-blur-sm">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">YD币余额不足</h3>
          <p className="text-white/90">
            您当前的YD币余额为 {ydBalance} YD，需要至少 {minRequired} YD
            才能接取任务
          </p>
        </div>
      </div>

      {/* 获取YD币提示 */}
      <div className="mt-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <p className="text-sm font-semibold text-white mb-2">
          💡 如何获取YD币：
        </p>
        <ul className="space-y-1 text-sm text-white/90">
          <li>• 参与社区活动获得奖励</li>
          <li>• 完成学习任务赚取YD币</li>
          <li>• 在DEX交易所购买YD币</li>
        </ul>
      </div>
    </div>
  );
}
