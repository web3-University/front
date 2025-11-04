"use client";

import { useState, useEffect } from "react";
import {
  useAuth,
  useSimpleYDToken,
  useWalletInfo,
} from "@web3-university/uni-wallet-lib";
import { formatUnits } from "viem";
import ProjectHero from "./ProjectHero";
import YDTokenVerification from "./YDTokenVerification";
import ProjectFilters from "./ProjectFilters";
import ProjectList from "./ProjectList";
import PostProjectModal from "./PostProjectModal";

// YD币合约地址和最低要求
const MIN_YD_REQUIRED = Number(process.env.NEXT_PUBLIC_MIN_YD_REQUIRED) || 100;

export default function OutsourceView() {
  const { isAuthenticated } = useAuth();
  const { address, isConnected } = useWalletInfo();
  const [showPostModal, setShowPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "all",
    budget: "all",
    sort: "latest",
  });

  // YD代币相关
  const tokenAddress = process.env.NEXT_PUBLIC_YD_TOKEN_ADDRESS as
    | `0x${string}`
    | undefined;
  const { balance: ydBalance } = useSimpleYDToken({ address: tokenAddress });

  // 自动验证状态
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [ydBalanceDisplay, setYDBalanceDisplay] = useState("0");

  // 自动验证YD币余额
  useEffect(() => {
    if (isAuthenticated && isConnected && address) {
      setIsVerifying(true);

      // 模拟验证过程（实际环境中会自动读取链上数据）
      const timer = setTimeout(() => {
        if (ydBalance) {
          const balanceNum = Number(formatUnits(ydBalance, 18));
          const balanceStr = balanceNum.toFixed(2);
          setYDBalanceDisplay(balanceStr);

          // 检查是否满足最低要求
          if (balanceNum >= MIN_YD_REQUIRED) {
            setIsVerified(true);
          } else {
            setIsVerified(false);
          }
        } else {
          // 如果没有读取到余额，使用模拟数据
          const mockBalance = 0;
          setYDBalanceDisplay(mockBalance.toString());
          setIsVerified(mockBalance >= MIN_YD_REQUIRED);
        }

        setIsVerifying(false);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // 未连接钱包时重置状态
      setIsVerified(false);
      setIsVerifying(false);
      setYDBalanceDisplay("0");
    }
  }, [isAuthenticated, isConnected, address, ydBalance]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ProjectHero onPostProject={() => setShowPostModal(true)} />

      {/* Main Content */}
      <main className="mx-auto max-w-[1200px] px-6 py-16">
        {/* YD Token Verification */}
        <YDTokenVerification
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
          isVerified={isVerified}
          ydBalance={ydBalanceDisplay}
          minRequired={MIN_YD_REQUIRED}
        />

        {/* Filters */}
        <ProjectFilters
          filters={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Project List */}
        <ProjectList
          filters={filters}
          searchQuery={searchQuery}
          canApply={isVerified}
        />
      </main>

      {/* Post Project Modal */}
      {showPostModal && (
        <PostProjectModal onClose={() => setShowPostModal(false)} />
      )}
    </div>
  );
}
