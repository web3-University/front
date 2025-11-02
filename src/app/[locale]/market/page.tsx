import CourseList from "@/components/market/CourseList";

export default function MarketPage() {
	return (
		<div className="min-h-screen text-white">
			{/* 主要内容 */}
			<main className="container mx-auto max-w-[1200px] px-4 pt-32">
				{/* 标题部分 */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">课程市场</h1>
					<p className="text-gray-400">
						探索高质量的Web3教育课程，提升你的技能
					</p>
				</div>

				{/* 课程卡片列表（包含筛选功能）*/}
				<CourseList />
			</main>
		</div>
	);
}
