"use client";

import Link from "next/link";
import { Star, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

export type FeaturedCourse = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  coverColor: string;
};

const fallbackCourses: FeaturedCourse[] = [
  {
    id: "intro-chain",
    title: "区块链开发入门",
    category: "编程",
    instructor: "李教授",
    rating: 4.9,
    students: 1250,
    price: 299,
    coverColor: "from-[#4B6CFF] to-[#7EE7FF]",
  },
  {
    id: "web3-frontend",
    title: "Web3 前端开发实战",
    category: "前端",
    instructor: "张老师",
    rating: 4.8,
    students: 890,
    price: 399,
    coverColor: "from-[#FF9F7B] to-[#FFD56F]",
  },
  {
    id: "smart-contract-security",
    title: "智能合约安全审计",
    category: "安全",
    instructor: "王专家",
    rating: 4.9,
    students: 567,
    price: 599,
    coverColor: "from-[#7E64FF] to-[#B79BFF]",
  },
];

type FeaturedCoursesProps = {
  courses?: FeaturedCourse[];
  onBuy?: (course: FeaturedCourse) => void;
};

export default function FeaturedCourses({
  courses = fallbackCourses,
  onBuy,
}: FeaturedCoursesProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-24">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#2B2558] md:text-4xl">
              精选课程
            </h2>
            <p className="mt-3 text-base text-[#6A6D94]">
              顶级讲师倾力打造的高质量课程，帮助你快速进入 Web3 世界
            </p>
          </div>
          <Link
            href="/market"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFB347] to-[#FF9F50] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(255,160,109,0.35)] transition hover:translate-y-[-1px]"
          >
            查看全部
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F7F5FF] px-6 pb-6 pt-6 shadow-[0_22px_60px_rgba(168,174,255,0.22)] ring-1 ring-[#ECEBFF] transition-transform duration-200 hover:-translate-y-2"
            >
              <div
                className={`relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${course.coverColor}`}
              >
                <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2B2558]">
                  {course.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 pt-6 text-left">
                <div>
                  <h3 className="text-xl font-semibold text-[#2B2558]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#7B7EA9]">
                    讲师：{course.instructor}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#F5B742]">
                    <Star className="h-4 w-4 fill-[#F5B742] text-[#F5B742]" />
                    <span className="font-semibold">
                      {course.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-[#8F92B5]">
                      ({course.students}人)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#FF9F50]">
                    <Wallet className="h-4 w-4" />
                    <span className="text-base font-semibold">
                      YD {course.price}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  className="mt-auto"
                  onClick={() => onBuy?.(course)}
                >
                  立即购买
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-20%] top-[50%] h-[32rem] w-[32rem] rounded-full bg-[#DCE2FF] opacity-60 blur-[200px]" />
        <div className="absolute right-[-18%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-[#FFE7CF] opacity-70 blur-[200px]" />
      </div>
    </section>
  );
}
