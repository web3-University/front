"use client";

import MyCoursesTab from "@/components/learn/MyCoursesTab";

export default function LearnPage() {
	return (
		<div className="min-h-screen pt-32 pb-16">
			<div className="mx-auto max-w-[1280px] px-6">
				{/* 页面标题和副标题 */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-[#2B2558] mb-3">学习中心</h1>
					<p className="text-lg text-[#6A6D94]">掌握Web3技能，获得代币奖励</p>
				</div>

				{/* 我的课程内容 */}
				<MyCoursesTab />
			</div>
		</div>
	);
}
