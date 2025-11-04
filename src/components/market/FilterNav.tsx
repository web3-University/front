"use client";

import { useCallback, useEffect, useState } from "react";
import type { CourseFilters } from "@/lib/api/course";

interface FilterNavProps {
  onFilterChange?: (filters: CourseFilters) => void;
  totalCount?: number;
}

const FilterNav = ({ onFilterChange, totalCount = 0 }: FilterNavProps) => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("全部分类");
  const [sortBy, setSortBy] = useState("最受欢迎");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sliderValue, setSliderValue] = useState(60);

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
    if (category !== "全部分类") {
      filters.categories = [category];
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
              >
                <title>搜索图标</title>
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
              placeholder="搜索课程名称..."
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
              onChange={(e) => setCategory(e.target.value)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B8EB5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
              }}
            >
              <option>全部分类</option>
              <option>区块链</option>
              <option>Web3</option>
              <option>DeFi</option>
              <option>NFT</option>
            </select>
          </div>

          {/* 排序方式 - 占1/4 */}
          <div>
            <select
              className="w-full px-4 py-2 bg-[#F8F8FF] rounded-full text-sm font-medium text-[#2B2558] shadow-sm ring-1 ring-[#E7E5FB] focus:outline-none focus:ring-2 focus:ring-[#ECEBFF] appearance-none pr-8"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B8EB5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
              }}
            >
              <option>最受欢迎</option>
              <option>最新上线</option>
              <option>价格从低到高</option>
              <option>价格从高到低</option>
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
              >
                <title>筛选图标</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                ></path>
              </svg>
              高级筛选
            </button>
          </div>
        </div>

        {/* 价格滑块 */}
        <div className="mb-4 px-2">
          <div className="flex justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.08em] text-[#8B8EB5]">
              价格范围 (USDT币)
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
              <span className="text-xs text-[#8B8EB5]">0</span>
              <span className="text-xs text-[#8B8EB5]">1000+</span>
            </div>
          </div>
        </div>

        <div className="text-sm font-medium text-[#6A6D94]">
          共找到{" "}
          <span className="text-[#4B6CFF] font-semibold">{totalCount}</span>{" "}
          门课程
        </div>
      </div>
    </div>
  );
};

export default FilterNav;
