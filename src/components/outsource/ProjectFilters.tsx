"use client";

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
  const categories = [
    { value: "all", label: "全部类别" },
    { value: "智能合约开发", label: "智能合约开发" },
    { value: "前端开发", label: "前端开发" },
    { value: "后端开发", label: "后端开发" },
    { value: "数据分析", label: "数据分析" },
    { value: "UI/UX设计", label: "UI/UX设计" },
  ];

  const difficulties = [
    { value: "all", label: "全部难度" },
    { value: "初级", label: "初级" },
    { value: "中级", label: "中级" },
    { value: "高级", label: "高级" },
  ];

  const budgetRanges = [
    { value: "all", label: "全部预算" },
    { value: "0-20k", label: "0 - 20,000 YD" },
    { value: "20k-50k", label: "20,000 - 50,000 YD" },
    { value: "50k+", label: "50,000+ YD" },
  ];

  const sortOptions = [
    { value: "latest", label: "最新发布" },
    { value: "budget-high", label: "预算最高" },
    { value: "budget-low", label: "预算最低" },
    { value: "deadline", label: "截止最近" },
    { value: "applicants", label: "最多申请" },
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
            placeholder="搜索项目名称、技能或关键词..."
            className="w-full rounded-xl border border-[#E5E6F8] bg-[#F9FAFB] py-3 pl-12 pr-4 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
          />
        </div>
      </div>

      {/* 筛选选项 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* 类别筛选 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2B2558]">
            项目类别
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
            难度等级
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
            预算范围
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
            排序方式
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
        <span className="text-sm font-medium text-[#6A6D94]">快速筛选:</span>
        <button
          onClick={() =>
            onFilterChange({ ...filters, budget: "50k+", sort: "budget-high" })
          }
          className="rounded-full bg-[#F2F3FF] px-4 py-1.5 text-sm font-medium text-[#8A71FF] transition-colors hover:bg-[#8A71FF] hover:text-white"
        >
          高薪项目
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, sort: "deadline" })}
          className="rounded-full bg-[#F2F3FF] px-4 py-1.5 text-sm font-medium text-[#8A71FF] transition-colors hover:bg-[#8A71FF] hover:text-white"
        >
          紧急招募
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, difficulty: "初级" })}
          className="rounded-full bg-[#F2F3FF] px-4 py-1.5 text-sm font-medium text-[#8A71FF] transition-colors hover:bg-[#8A71FF] hover:text-white"
        >
          新手友好
        </button>
      </div>
    </div>
  );
}
