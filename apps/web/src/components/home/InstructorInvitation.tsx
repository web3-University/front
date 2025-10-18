"use client";

import { Coins, Globe2, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type HighlightItem = {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  iconBg: string;
  eyebrow?: string;
};

const highlights: HighlightItem[] = [
  {
    icon: ShieldCheck,
    title: "85% 高收益",
    description: "课程销售收益的85%直接到账，收益透明可查",
    iconBg: "from-[#34D399] to-[#10B981]",
  },
  {
    icon: Coins,
    title: "代币激励",
    description: "发布课程、获得好评、学生完课都有额外奖励",
    iconBg: "from-[#8B5CF6] to-[#6366F1]",
  },
  {
    icon: Globe2,
    title: "触达 50,000+ 学员",
    description: "触达50,000+全球学员，扩大您的影响力",
    iconBg: "from-[#FF7A50] to-[#F97316]",
  },
];

const stats = [
  { label: "活跃讲师", value: "127" },
  { label: "讲师总收益", value: "Ƀ 1.2M", highlight: true },
  { label: "平均评分", value: "4.8" },
  { label: "学员总数", value: "15,000+" },
];

export default function InstructorInvitation() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 py-24 text-center text-white">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-md ring-1 ring-white/20">
          <UserCheck className="h-4 w-4" />
          成为讲师，开始收益之旅
        </div>

        <h2 className="text-3xl font-bold md:text-4xl">分享知识，获得价值</h2>
        <p className="mx-auto mt-3 max-w-3xl text-base text-white/80">
          加入 Web3 大学讲师团队，通过区块链技术确保公平透明的收益分配。
          每发布一门课程即可获得 10 YD 代币，课程销售收益的 85% 归您所有。
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {highlights.map(
            ({ icon: Icon, eyebrow, title, description, iconBg }) => (
              <article
                key={title}
                className="group flex h-full flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-[#2D1F78] to-[#4E1F84] px-8 py-10 text-center text-white shadow-[0_22px_65px_rgba(24,7,56,0.45)] ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-2"
              >
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${iconBg} text-white shadow-[0_22px_45px_rgba(16,12,60,0.4)]`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                  {eyebrow}
                </div>
                <div className="text-2xl font-semibold">{title}</div>
                <p className="text-sm leading-relaxed text-white/75">
                  {description}
                </p>
              </article>
            ),
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/teacher">
            <Button variant="primary" size="lg">
              立即成为讲师
            </Button>
          </Link>
          <Link href="/course-create">
            <Button variant="secondary" size="lg">
              了解开课流程
            </Button>
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/10 px-6 py-8 text-center shadow-[0_18px_45px_rgba(24,7,56,0.3)] ring-1 ring-white/12 transition-transform duration-200 hover:-translate-y-1"
            >
              <span
                className={`text-3xl font-extrabold ${
                  item.highlight ? "text-[#FFD166]" : "text-white"
                }`}
              >
                {item.value}
              </span>
              <span className="mt-2 block text-base text-white/75">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4222AA] via-[#5523A8] to-[#7D2EDC] opacity-90" />
        <div className="absolute left-[-12%] top-[12%] h-[28rem] w-[28rem] rounded-full bg-[#7C5CFF]/45 blur-[200px]" />
        <div className="absolute right-[-6%] top-[45%] h-[26rem] w-[26rem] rounded-full bg-[#FF7ABF]/40 blur-[200px]" />
      </div>
    </section>
  );
}
