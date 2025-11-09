"use client";

import { useWalletInfo } from "@web3-university/uni-wallet-lib";
import { Award, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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

// API 返回的证书数据结构
interface CertificateResponse {
  certificateId: number;
  tokenId: string;
  contractAddress: string;
  userId: number;
  walletAddress: string;
  courseId: number;
  completionDate: string;
  metadata: string;
  nftUrl: string;
  transactionHash: string;
  blockNumber: number;
  createdAt: string;
  updatedAt: string;
  course: {
    courseId: number;
    title: string;
    description: string;
    cover: string;
    difficulty: string;
    price: string;
    duration: number;
    rating: number;
    categories: string[];
    tags: string[];
    learningObjectives: string[];
    prerequisites: string[];
  };
}

// 根据难度等级确定稀有度
function getDifficultyRarity(difficulty: string): NFTRarity {
  const difficultyNum = Number.parseInt(difficulty);
  if (difficultyNum >= 4) return "legendary";
  if (difficultyNum === 3) return "epic";
  if (difficultyNum === 2) return "rare";
  return "common";
}

const rarityConfig: Record<
  NFTRarity,
  { color: string; borderColor: string; bgGradient: string }
> = {
  common: {
    color: "text-[#9E9E9E]",
    borderColor: "ring-[#9E9E9E]/30",
    bgGradient: "from-[#9E9E9E]/10 to-[#757575]/5",
  },
  rare: {
    color: "text-[#5B9EFF]",
    borderColor: "ring-[#5B9EFF]/30",
    bgGradient: "from-[#5B9EFF]/10 to-[#4A8EFF]/5",
  },
  epic: {
    color: "text-[#9C27B0]",
    borderColor: "ring-[#9C27B0]/30",
    bgGradient: "from-[#9C27B0]/10 to-[#7B1FA2]/5",
  },
  legendary: {
    color: "text-[#FF9800]",
    borderColor: "ring-[#FF9800]/30",
    bgGradient: "from-[#FF9800]/10 to-[#F57C00]/5",
  },
};

export default function NFTGallery() {
  const { address, isConnected } = useWalletInfo();
  const t = useTranslations("profile.nft");
  const locale = useLocale();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const dateFormatter = useCallback(
    (value: string) => {
      const formatterLocale = locale === "en" ? "en-US" : "zh-CN";
      try {
        return new Date(value).toLocaleDateString(formatterLocale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return value;
      }
    },
    [locale],
  );

  const transformCertificateToNFT = useCallback(
    (cert: CertificateResponse): NFT => ({
      id: cert.certificateId,
      tokenId: cert.tokenId,
      name: `${cert.course.title} ${t("certificateSuffix")}`,
      description: cert.course.description || t("defaultDescription"),
      imageUrl: cert.nftUrl || cert.course.cover || "🏆",
      rarity: getDifficultyRarity(cert.course.difficulty),
      contractAddress: cert.contractAddress,
      obtainedDate: dateFormatter(cert.completionDate),
      attributes: [
        { trait_type: t("attributes.courseName"), value: cert.course.title },
        {
          trait_type: t("attributes.difficulty"),
          value: t("attributes.difficultyValue", {
            level: cert.course.difficulty,
          }),
        },
        {
          trait_type: t("attributes.duration"),
          value: t("attributes.durationValue", {
            hours: cert.course.duration,
          }),
        },
        {
          trait_type: t("attributes.category"),
          value: cert.course.categories[0] || t("attributes.categoryFallback"),
        },
        {
          trait_type: t("attributes.rating"),
          value: t("attributes.ratingValue", {
            rating: cert.course.rating,
          }),
        },
      ],
    }),
    [dateFormatter, t],
  );

  const loadNFTs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await http<
        { data: CertificateResponse[] } | CertificateResponse[]
      >(`/certificates/user?walletAddress=${address}`);

      // 处理可能包含 data 字段的响应
      let data: CertificateResponse[];
      if (response && typeof response === "object" && "data" in response) {
        data = response.data;
      } else {
        data = response as CertificateResponse[];
      }

      console.log("NFT 接口返回数据:", data);

      // 确保返回的数据是数组，如果不是则设置为空数组
      if (Array.isArray(data)) {
        // 将 API 数据转换为展示数据
        const transformedNFTs = data.map(transformCertificateToNFT);
        console.log("转换后的 NFT 数据:", transformedNFTs);
        setNfts(transformedNFTs);
      } else {
        console.warn("NFT接口返回的数据格式不正确:", data);
        setNfts([]);
      }
    } catch (error) {
      console.error("加载NFT失败:", error);
      // 接口失败时设置为空数组，避免 .map() 报错
      setNfts([]);
    } finally {
      setIsLoading(false);
    }
  }, [address, transformCertificateToNFT]);

  useEffect(() => {
    if (address) {
      loadNFTs();
    }
  }, [address, loadNFTs]);

  const openBlockExplorer = (contractAddress: string, tokenId: string) => {
    // 使用 Sepolia 测试网的区块链浏览器
    const url = `https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`;
    window.open(url, "_blank");
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Sparkles className="mb-4 h-16 w-16 text-[#6A6D94]" />
        <p className="text-lg text-[#6A6D94]">{t("states.connectWallet")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-[#8A71FF]" />
        <p className="text-lg text-[#6A6D94]">{t("states.loading")}</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Award className="mb-4 h-16 w-16 text-[#6A6D94]" />
        <p className="text-lg text-[#6A6D94]">{t("states.empty.title")}</p>
        <p className="mt-2 text-sm text-[#6A6D94]">
          {t("states.empty.subtitle")}
        </p>
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
              {t("stats.title")}
            </h2>
            <p className="text-sm text-[#6A6D94]">
              {t("stats.subtitle", { count: nfts.length })}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFB347] to-[#FF8A6B] px-4 py-2 text-sm font-medium text-white shadow-md">
            <Sparkles className="h-4 w-4" />
            <span>{t("badge")}</span>
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
                  className={`rounded-full border ${
                    rarityConfig[nft.rarity].color
                  } border-current px-3 py-1 text-xs font-bold tracking-wider`}
                >
                  {t(`rarity.${nft.rarity}`)}
                </span>
              </div>

              {/* Token ID 和获得日期 */}
              <div className="space-y-1 text-center text-xs text-[#6A6D94]">
                <p>{t("fields.tokenId", { id: nft.tokenId })}</p>
                <p>{t("fields.obtainedDate", { date: nft.obtainedDate })}</p>
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
                {t("actions.viewOnChain")}
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
                  className={`mt-2 inline-block rounded-full border ${
                    rarityConfig[selectedNFT.rarity].color
                  } border-current px-3 py-1 text-xs font-bold tracking-wider`}
                >
                  {t(`rarity.${selectedNFT.rarity}`)}
                </span>
              </div>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-[#6A6D94] hover:text-[#2B2558] transition-colors"
                aria-label={t("modal.close")}
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
                <h4 className="mb-2 font-bold text-[#2B2558]">
                  {t("modal.descriptionTitle")}
                </h4>
                <p className="text-[#6A6D94]">{selectedNFT.description}</p>
              </div>

              {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                <div>
                  <h4 className="mb-2 font-bold text-[#2B2558]">
                    {t("modal.attributesTitle")}
                  </h4>
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
                <h4 className="mb-2 font-bold text-[#2B2558]">
                  {t("modal.detailsTitle")}
                </h4>
                <div className="space-y-2 rounded-xl bg-[#F5F0FF] p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6A6D94]">
                      {t("modal.fields.tokenId")}
                    </span>
                    <span className="font-mono text-[#2B2558]">
                      #{selectedNFT.tokenId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A6D94]">
                      {t("modal.fields.contract")}
                    </span>
                    <span className="font-mono text-[#2B2558]">
                      {selectedNFT.contractAddress.slice(0, 6)}...
                      {selectedNFT.contractAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A6D94]">
                      {t("modal.fields.obtainedDate")}
                    </span>
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
                {t("modal.actions.viewOnChain")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
