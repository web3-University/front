"use client";

import { useState } from "react";

const FilterNav = () => {
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

  return (
    <div className="bg-[#111c33] rounded-lg p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* 搜索框 - 占1/4 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
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
            className="w-full pl-10 pr-4 py-2 bg-[#1a2540] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 分类选择 - 占1/4 */}
        <div>
          <select
            className="w-full px-4 py-2 bg-[#1a2540] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            className="w-full px-4 py-2 bg-[#1a2540] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-1"
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
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">价格范围 (USDT币)</span>
          <span className="text-sm text-gray-400">
            {priceRange[1] >= 1000 ? "1000+" : priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #1d4ed8 ${sliderValue}%, #374151 ${sliderValue}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-gray-500">1000+</span>
        </div>
      </div>

      <div className="text-sm text-gray-400">共找到课程</div>
    </div>
  );
};

export default FilterNav;
