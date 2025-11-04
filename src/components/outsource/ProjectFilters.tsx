"use client";

import { useTranslation } from "@/i18n/hooks";

interface ProjectFiltersProps {
  filters: {
    category: string;
    difficulty: string;
    budget: string;
    sort: string;
  };
  onFilterChange: (filters: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProjectFilters({
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: ProjectFiltersProps) {
  const t = useTranslation("projectFilters");

  const categories = [
    { value: "all", label: t("categories.all") },
    { value: "智能合约开发", label: t("categories.smartContract") },
    { value: "前端开发", label: t("categories.frontend") },
    { value: "后端开发", label: t("categories.backend") },
    { value: "数据分析", label: t("categories.data") },
    { value: "UI/UX设计", label: t("categories.design") },
  ];

  const difficulties = [
    { value: "all", label: t("difficulty.all") },
    { value: "初级", label: t("difficulty.beginner") },
    { value: "中级", label: t("difficulty.intermediate") },
    { value: "高级", label: t("difficulty.advanced") },
  ];

  const budgetRanges = [
    { value: "all", label: t("budget.all") },
    { value: "0-20k", label: t("budget.low") },
    { value: "20k-50k", label: t("budget.mid") },
    { value: "50k+", label: t("budget.high") },
  ];

  const sortOptions = [
    { value: "latest", label: t("sort.latest") },
    { value: "budget-high", label: t("sort.budgetHigh") },
    { value: "budget-low", label: t("sort.budgetLow") },
    { value: "deadline", label: t("sort.deadline") },
    { value: "applicants", label: t("sort.applicants") },
  ];

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6A6D94]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full rounded-xl border border-[#E5E6F8] bg-[#F9FAFB] py-3 pl-12 pr-4 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
          />
        </div>
      </div>

      {/* 筛选选项 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* 类别筛选 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2B2558]">
            {t("labels.category")}
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              onFilterChange({ ...filters, category: e.target.value })
            }
            className="w-full rounded-xl border border-[#E5E6F8] bg-white py-2.5 px-4 text-sm text-[#2B2558] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* 难度筛选 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2B2558]">
            {t("labels.difficulty")}
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) =>
              onFilterChange({ ...filters, difficulty: e.target.value })
            }
            className="w-full rounded-xl border border-[#E5E6F8] bg-white py-2.5 px-4 text-sm text-[#2B2558] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
          >
            {difficulties.map((diff) => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>
        </div>

        {/* 预算筛选 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2B2558]">
            {t("labels.budget")}
          </label>
          <select
            value={filters.budget}
            onChange={(e) =>
              onFilterChange({ ...filters, budget: e.target.value })
            }
            className="w-full rounded-xl border border-[#E5E6F8] bg-white py-2.5 px-4 text-sm text-[#2B2558] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
          >
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* 排序 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2B2558]">
            {t("labels.sort")}
          </label>
          <select
            value={filters.sort}
            onChange={(e) =>
              onFilterChange({ ...filters, sort: e.target.value })
            }
            className="w-full rounded-xl border border-[#E5E6F8] bg-white py-2.5 px-4 text-sm text-[#2B2558] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 快速筛选标签 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-[#6A6D94]">
          {t("quickFilters.label")}
        </span>
        <button
          onClick={() =>
            onFilterChange({ ...filters, budget: "50k+", sort: "budget-high" })
          }
          className="rounded-full bg-[#F2F3FF] px-4 py-1.5 text-sm font-medium text-[#8A71FF] transition-colors hover:bg-[#8A71FF] hover:text-white"
        >
          {t("quickFilters.highBudget")}
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, sort: "deadline" })}
          className="rounded-full bg-[#F2F3FF] px-4 py-1.5 text-sm font-medium text-[#8A71FF] transition-colors hover:bg-[#8A71FF] hover:text-white"
        >
          {t("quickFilters.urgent")}
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, difficulty: "初级" })}
          className="rounded-full bg-[#F2F3FF] px-4 py-1.5 text-sm font-medium text-[#8A71FF] transition-colors hover:bg-[#8A71FF] hover:text-white"
        >
          {t("quickFilters.beginner")}
        </button>
      </div>
    </div>
  );
}
