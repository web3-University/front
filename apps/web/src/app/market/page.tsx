import CourseList from "@/components/market/CourseList";
import FilterNav from "@/components/market/FilterNav";

// 模拟课程数据

export default function MarketPage() {
  return (
    <div className="min-h-screen text-white">
      {/* 主要内容 */}
      <main className="container mx-auto px-4 pt-32">
        {/* 标题部分 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">课程市场</h1>
          <p className="text-gray-400">
            探索高质量的Web3教育课程，提升你的技能
          </p>
        </div>

        {/* 搜索和筛选部分 */}
        <FilterNav />

        {/* 课程卡片列表*/}
        <CourseList />

        {/* 加载更多按钮 */}
        <div className="mt-8 text-center">
          <button
            type="button"
            className="bg-[#1a2540] hover:bg-[#243050] text-white px-6 py-2 rounded-md"
          >
            加载更多课程
          </button>
        </div>
      </main>
    </div>
  );
}
