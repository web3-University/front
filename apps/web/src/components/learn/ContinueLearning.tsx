"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  {
    id: 1,
    title: "DeFi 协议开发实战",
    subtitle: "流动性挖矿机制",
    progress: 65,
    image: "/course-defi.jpg",
  },
  {
    id: 2,
    title: "Web3 前端开发",
    subtitle: "连接MetaMask钱包",
    progress: 42,
    image: "/course-web3.jpg",
  },
];

export default function ContinueLearning() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60">
      <div className="mb-4 flex items-center gap-2">
        <Play className="h-5 w-5 text-[#8A71FF]" />
        <h2 className="text-xl font-bold text-[#2B2558]">继续学习</h2>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group flex gap-4 rounded-xl bg-white/60 p-4 transition-all hover:bg-white/80 hover:shadow-md"
          >
            {/* 课程缩略图 */}
            <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#E6D8FF] to-[#F0E8FF]">
              <div className="flex h-full items-center justify-center text-4xl">
                📚
              </div>
            </div>

            {/* 课程信息 */}
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-[#2B2558] group-hover:text-[#8A71FF] transition-colors">
                {course.title}
              </h3>
              <p className="mb-3 text-sm text-[#6A6D94]">{course.subtitle}</p>

              {/* 进度条 */}
              <div className="relative h-2 overflow-hidden rounded-full bg-[#E8E6F5]">
                <div
                  className="h-full bg-gradient-to-r from-[#8A71FF] to-[#9D82FF] transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {/* 播放按钮 */}
            <div className="flex items-center">
              <Button
                variant="primary"
                size="sm"
                className="!rounded-full !px-4"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
