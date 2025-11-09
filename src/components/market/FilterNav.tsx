"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { CourseFilters } from "@/lib/api/course";

interface FilterNavProps {
  onFilterChange?: (filters: CourseFilters) => void;
  totalCount?: number;
}

const CATEGORY_VALUE_MAP = {
  all: null,
  blockchain: "区块链",
  web3: "Web3",
  defi: "DeFi",
  nft: "NFT",
} as const;

type CategoryKey = keyof typeof CATEGORY_VALUE_MAP;
type SortKey = "popular" | "newest" | "priceAsc" | "priceDesc";

const FilterNav = ({ onFilterChange, totalCount = 0 }: FilterNavProps) => {
  const t = useTranslations("market.filters");

  // 状态管理
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [sortBy, setSortBy] = useState<SortKey>("popular");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sliderValue, setSliderValue] = useState(60);

  const categoryOptions = useMemo(
    () => [
      { key: "all" as CategoryKey, label: t("categories.all") },
      { key: "blockchain" as CategoryKey, label: t("categories.blockchain") },
      { key: "web3" as CategoryKey, label: t("categories.web3") },
      { key: "defi" as CategoryKey, label: t("categories.defi") },
      { key: "nft" as CategoryKey, label: t("categories.nft") },
    ],
    [t],
  );

  const sortOptions = useMemo(
    () => [
      { key: "popular" as SortKey, label: t("sorting.popular") },
      { key: "newest" as SortKey, label: t("sorting.newest") },
      { key: "priceAsc" as SortKey, label: t("sorting.priceAsc") },
      { key: "priceDesc" as SortKey, label: t("sorting.priceDesc") },
    ],
    [t],
  );

  /**
   * 处理价格滑块变化
   * @param e
   */
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    // 计算价格范围 (0-1000+)
    const maxPrice = 1000;
    const calculatedPrice = Math.round((value / 100) * maxPrice);
    setPriceRange([0, calculatedPrice]);
  };

  /**
   * 构建筛选条件
   */
  const buildFilters = useCallback((): CourseFilters => {
    const filters: CourseFilters = {
      page: 1,
      limit: 10,
    };

    // 搜索关键词
    if (searchTerm.trim()) {
      filters.keyword = searchTerm.trim();
    }

    // 分类筛选
    const selectedCategory = CATEGORY_VALUE_MAP[category];
    if (selectedCategory) {
      filters.categories = [selectedCategory];
    }

    // 价格范围
    if (priceRange[1] < 1000) {
      filters.priceRange = [priceRange[0].toString(), priceRange[1].toString()];
    }

    // 排序方式（这里可以根据后端API扩展）
    // 目前后端可能不支持排序，可以在后续添加

    return filters;
  }, [searchTerm, category, priceRange]);

  /**
   * 当筛选条件变化时，触发回调（添加防抖优化）
   */
  useEffect(() => {
    if (!onFilterChange) return;

    // 使用防抖，避免频繁请求后端
    const debounceTimer = setTimeout(() => {
      const filters = buildFilters();
      onFilterChange(filters);
    }, 500); // 500ms 防抖延迟

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, category, priceRange, buildFilters, onFilterChange]);

  return (
    <div className="flex justify-center w-full mb-8">
      <div className="w-full max-w-[1280px] rounded-2xl bg-white/80 px-6 py-4 backdrop-blur-xl shadow-[0_24px_60px_rgba(154,161,255,0.18)] ring-1 ring-white/60 text-[#2B2558]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* 搜索框 - 占1/4 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-[#8B8EB5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                title={t("icons.search")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2 bg-[#F8F8FF] rounded-full text-sm font-medium text-[#2B2558] shadow-sm ring-1 ring-[#E7E5FB] focus:outline-none focus:ring-2 focus:ring-[#ECEBFF]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 分类选择 - 占1/4 */}
          <div>
            <select
              className="w-full px-4 py-2 bg-[#F8F8FF] rounded-full text-sm font-medium text-[#2B2558] shadow-sm ring-1 ring-[#E7E5FB] focus:outline-none focus:ring-2 focus:ring-[#ECEBFF] appearance-none pr-8"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B8EB5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
              }}
            >
              {categoryOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 排序方式 - 占1/4 */}
          <div>
            <select
              className="w-full px-4 py-2 bg-[#F8F8FF] rounded-full text-sm font-medium text-[#2B2558] shadow-sm ring-1 ring-[#E7E5FB] focus:outline-none focus:ring-2 focus:ring-[#ECEBFF] appearance-none pr-8"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B8EB5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 高级筛选按钮 - 占1/4 */}
          <div>
            <button
              type="button"
              className="w-full px-4 py-2 bg-gradient-to-br from-[#FFB347] to-[#FF6B9A] rounded-full text-sm font-medium text-white shadow-lg flex items-center justify-center transition hover:-translate-y-[1px]"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                title={t("icons.filter")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                ></path>
              </svg>
              {t("advancedFilter")}
            </button>
          </div>
        </div>

        {/* 价格滑块 */}
        <div className="mb-4 px-2">
          <div className="flex justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.08em] text-[#8B8EB5]">
              {t("priceRange.label", { currency: "USDT" })}
            </span>
            <span className="text-xs font-medium text-[#5F6094] rounded-full bg-[#F4F4FF] px-3 py-1">
              {priceRange[1] >= 1000 ? "1000+" : priceRange[1]}
            </span>
          </div>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FFB347 0%, #FF6B9A ${sliderValue}%, #ECEBFF ${sliderValue}%, #ECEBFF 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-[#8B8EB5]">
                {t("priceRange.minLabel", { value: 0 })}
              </span>
              <span className="text-xs text-[#8B8EB5]">
                {t("priceRange.maxLabel", { value: "1000+" })}
              </span>
            </div>
          </div>
        </div>

        <div className="text-sm font-medium text-[#6A6D94]">
          {t.rich("totalCount", {
            value: totalCount,
            highlight: (chunks) => (
              <span className="text-[#4B6CFF] font-semibold">{chunks}</span>
            ),
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterNav;
