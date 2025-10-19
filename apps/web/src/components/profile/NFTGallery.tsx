"use client";

import { useWalletInfo } from "@web3-university/uni-wallet-lib";
import { Award, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";

type NFTRarity = "common" | "rare" | "epic" | "legendary";

interface NFT {
  id: number;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: NFTRarity;
  contractAddress: string;
  obtainedDate: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

const rarityConfig: Record<
  NFTRarity,
  { label: string; color: string; borderColor: string; bgGradient: string }
> = {
  common: {
    label: "COMMON",
    color: "text-[#9E9E9E]",
    borderColor: "ring-[#9E9E9E]/30",
    bgGradient: "from-[#9E9E9E]/10 to-[#757575]/5",
  },
  rare: {
    label: "RARE",
    color: "text-[#5B9EFF]",
    borderColor: "ring-[#5B9EFF]/30",
    bgGradient: "from-[#5B9EFF]/10 to-[#4A8EFF]/5",
  },
  epic: {
    label: "EPIC",
    color: "text-[#9C27B0]",
    borderColor: "ring-[#9C27B0]/30",
    bgGradient: "from-[#9C27B0]/10 to-[#7B1FA2]/5",
  },
  legendary: {
    label: "LEGENDARY",
    color: "text-[#FF9800]",
    borderColor: "ring-[#FF9800]/30",
    bgGradient: "from-[#FF9800]/10 to-[#F57C00]/5",
  },
};

export default function NFTGallery() {
  const { address, isConnected } = useWalletInfo();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  useEffect(() => {
    if (address) {
      loadNFTs();
    }
  }, [address]);

  const loadNFTs = async () => {
    setIsLoading(true);
    try {
      const data = await http<NFT[]>(
        `/api/certificates/user?walletAddress=${address}`,
      );
      setNfts(data);
    } catch (error) {
      console.error("加载NFT失败:", error);
      // 使用模拟数据作为示例
      setNfts([
        {
          id: 1,
          tokenId: "1",
          name: "Web3 Pioneer",
          description: "完成第一门课程的成就NFT",
          imageUrl: "🏆",
          rarity: "rare",
          contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          obtainedDate: "2024-01-15",
          attributes: [
            { trait_type: "Type", value: "Achievement" },
            { trait_type: "Course", value: "DeFi Basics" },
          ],
        },
        {
          id: 2,
          tokenId: "2",
          name: "Smart Contract Master",
          description: "完成10门智能合约课程",
          imageUrl: "💎",
          rarity: "epic",
          contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          obtainedDate: "2024-02-20",
          attributes: [
            { trait_type: "Type", value: "Achievement" },
            { trait_type: "Courses Completed", value: "10" },
          ],
        },
        {
          id: 3,
          tokenId: "3",
          name: "Early Supporter",
          description: "平台早期支持者专属NFT",
          imageUrl: "🌟",
          rarity: "legendary",
          contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          obtainedDate: "2024-01-01",
          attributes: [
            { trait_type: "Type", value: "Special" },
            { trait_type: "Edition", value: "Genesis" },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openBlockExplorer = (contractAddress: string, tokenId: string) => {
    // 使用 Sepolia 测试网的区块链浏览器
    const url = `https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`;
    window.open(url, "_blank");
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Sparkles className="mb-4 h-16 w-16 text-[#6A6D94]" />
        <p className="text-lg text-[#6A6D94]">请先连接钱包查看NFT</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-[#8A71FF]" />
        <p className="text-lg text-[#6A6D94]">加载中...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Award className="mb-4 h-16 w-16 text-[#6A6D94]" />
        <p className="text-lg text-[#6A6D94]">暂无NFT收藏</p>
        <p className="mt-2 text-sm text-[#6A6D94]">完成课程学习获得成就NFT</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计信息卡片 */}
      <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm shadow-sm ring-1 ring-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#2B2558] mb-1">
              我的NFT收藏
            </h2>
            <p className="text-sm text-[#6A6D94]">共收藏 {nfts.length} 个NFT</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFB347] to-[#FF8A6B] px-4 py-2 text-sm font-medium text-white shadow-md">
            <Sparkles className="h-4 w-4" />
            <span>珍藏品</span>
          </div>
        </div>
      </div>

      {/* NFT 网格 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            onClick={() => setSelectedNFT(nft)}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-white/60 p-6 backdrop-blur-sm shadow-sm ring-1 ring-white/60 transition-all hover:shadow-lg hover:-translate-y-1`}
          >
            {/* 光效背景 */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#8A71FF]/20 to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

            <div className="relative">
              {/* NFT 图片/图标 */}
              <div className="mb-4 flex justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A71FF]/10 to-[#9D82FF]/5 text-6xl shadow-sm">
                  {nft.imageUrl.startsWith("http") ? (
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    nft.imageUrl
                  )}
                </div>
              </div>

              {/* NFT 名称 */}
              <h4 className="mb-2 text-center text-lg font-bold text-[#2B2558]">
                {nft.name}
              </h4>

              {/* NFT 描述 */}
              <p className="mb-3 text-center text-sm text-[#6A6D94]">
                {nft.description}
              </p>

              {/* 稀有度标签 */}
              <div className="mb-3 flex justify-center">
                <span
                  className={`rounded-full border ${rarityConfig[nft.rarity].color} border-current px-3 py-1 text-xs font-bold tracking-wider`}
                >
                  {rarityConfig[nft.rarity].label}
                </span>
              </div>

              {/* Token ID 和获得日期 */}
              <div className="space-y-1 text-center text-xs text-[#6A6D94]">
                <p>Token ID: #{nft.tokenId}</p>
                <p>获得日期: {nft.obtainedDate}</p>
              </div>

              {/* 查看详情按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openBlockExplorer(nft.contractAddress, nft.tokenId);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5F0FF] px-4 py-2 text-sm font-medium text-[#8A71FF] transition-all hover:bg-[#8A71FF] hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                查看链上信息
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NFT 详情模态框 */}
      {selectedNFT && (
        <div
          onClick={() => setSelectedNFT(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full overflow-hidden rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-bold text-[#2B2558]">
                  {selectedNFT.name}
                </h3>
                <span
                  className={`mt-2 inline-block rounded-full border ${rarityConfig[selectedNFT.rarity].color} border-current px-3 py-1 text-xs font-bold tracking-wider`}
                >
                  {rarityConfig[selectedNFT.rarity].label}
                </span>
              </div>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-[#6A6D94] hover:text-[#2B2558] transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-gradient-to-br from-[#8A71FF]/10 to-[#9D82FF]/5 text-8xl shadow-sm">
                {selectedNFT.imageUrl.startsWith("http") ? (
                  <img
                    src={selectedNFT.imageUrl}
                    alt={selectedNFT.name}
                    className="h-full w-full rounded-3xl object-cover"
                  />
                ) : (
                  selectedNFT.imageUrl
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-bold text-[#2B2558]">描述</h4>
                <p className="text-[#6A6D94]">{selectedNFT.description}</p>
              </div>

              {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                <div>
                  <h4 className="mb-2 font-bold text-[#2B2558]">属性</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedNFT.attributes.map((attr, index) => (
                      <div key={index} className="rounded-xl bg-[#F5F0FF] p-3">
                        <p className="text-xs text-[#6A6D94]">
                          {attr.trait_type}
                        </p>
                        <p className="font-bold text-[#2B2558]">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="mb-2 font-bold text-[#2B2558]">详细信息</h4>
                <div className="space-y-2 rounded-xl bg-[#F5F0FF] p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6A6D94]">Token ID</span>
                    <span className="font-mono text-[#2B2558]">
                      #{selectedNFT.tokenId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A6D94]">合约地址</span>
                    <span className="font-mono text-[#2B2558]">
                      {selectedNFT.contractAddress.slice(0, 6)}...
                      {selectedNFT.contractAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A6D94]">获得日期</span>
                    <span className="text-[#2B2558]">
                      {selectedNFT.obtainedDate}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  openBlockExplorer(
                    selectedNFT.contractAddress,
                    selectedNFT.tokenId,
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8A71FF] to-[#9D7FFF] px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
              >
                <ExternalLink className="h-5 w-5" />
                在区块链浏览器中查看
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
