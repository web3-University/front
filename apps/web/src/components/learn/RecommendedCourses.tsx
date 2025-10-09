"use client";

import { Zap, ChevronRight, Star, Users } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Solidity智能合约进阶",
    rating: 4.9,
    students: 1240,
    price: 49,
    currency: "YD",
  },
  {
    id: 2,
    title: "Layer2解决方案实战",
    rating: 4.8,
    students: 890,
    price: 69,
    currency: "YD",
  },
  {
    id: 3,
    title: "DApp全栈开发",
    rating: 4.9,
    students: 2130,
    price: 89,
    currency: "YD",
  },
];

export default function RecommendedCourses() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#8A71FF]" />
          <h2 className="text-xl font-bold text-[#2B2558]">推荐课程</h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-[#8A71FF] transition-colors hover:text-[#7A61EF]"
        >
          查看更多
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group overflow-hidden rounded-xl bg-white/60 transition-all hover:bg-white/80 hover:shadow-lg"
          >
            {/* 课程封面 */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#E6D8FF] to-[#F0E8FF]">
              <div className="flex h-full items-center justify-center text-6xl">
                📖
              </div>
              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            {/* 课程信息 */}
            <div className="p-4">
              <h3 className="mb-3 font-semibold text-[#2B2558] group-hover:text-[#8A71FF] transition-colors">
                {course.title}
              </h3>

              <div className="mb-3 flex items-center gap-4 text-sm text-[#6A6D94]">
                {/* 评分 */}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  <span className="font-medium">{course.rating}</span>
                </div>

                {/* 学员数 */}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students} 学员</span>
                </div>
              </div>

              {/* 价格 */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#4CAF50]">
                  {course.price} {course.currency}
                </div>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-[#8A71FF] to-[#9D82FF] px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  立即学习
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
