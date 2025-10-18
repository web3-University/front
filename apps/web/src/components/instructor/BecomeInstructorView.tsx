"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  CheckCircle2,
  Coins,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const benefits: Array<{
  icon: LucideIcon;
  title: string;
  tag: string;
  tagClassName: string;
  description: string;
}> = [
  {
    icon: Coins,
    title: "85% 收益分成",
    tag: "高收益",
    tagClassName: "bg-emerald-100 text-emerald-600",
    description:
      "每售出一门课程，您将获得 85% 的收益，平台仅收取 15% 的运营费用。",
  },
  {
    icon: Award,
    title: "代币奖励机制",
    tag: "持续奖励",
    tagClassName: "bg-amber-100 text-amber-600",
    description: "发布课程即刻获得 10 YD 代币，课程被购买、好评都可额外奖励。",
  },
  {
    icon: Globe2,
    title: "全球学员触达",
    tag: "广阔市场",
    tagClassName: "bg-sky-100 text-sky-600",
    description:
      "平台覆盖全球 50,000+ 学员，您的知识可以影响到世界各地的学习者。",
  },
  {
    icon: ShieldCheck,
    title: "区块链保障",
    tag: "安全可靠",
    tagClassName: "bg-indigo-100 text-indigo-600",
    description:
      "所有交易记录在区块链上，透明公开，收益结算自动化，无需担心欠款。",
  },
];

const requirements = [
  "具备相关专业知识或技能",
  "能够制作教学内容",
  "承诺课程内容的原创性",
];

export default function BecomeInstructorView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "",
    bio: "",
  });
  const [agreed, setAgreed] = useState(false);

  const isFormComplete = useMemo(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.domain.trim().length > 0 &&
      agreed
    );
  }, [formData, agreed]);

  const updateField =
    (key: keyof typeof formData) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-[#edf1ff] via-[#f7faff] to-[#fff6f9] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#c9d6ff]/60 blur-3xl" />
        <div className="absolute right-0 top-48 h-96 w-96 rounded-full bg-[#ffd7e9]/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c9f1ff]/50 blur-3xl" />
      </div>

      <section className="relative z-10 pt-32 pb-24">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6">
          <header className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-indigo-100/80">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              成为讲师
            </div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              加入 WEB3 大学，开启您的教学旅程
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              极简注册，立即开课。支持匿名教学，保障隐私，让知识分享更自由。
              区块链确权与收益分配，让您的教学价值得到充分认同。
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div className="space-y-8">
              <div className="rounded-3xl border border-indigo-100/80 bg-white/80 p-8 shadow-[0_30px_80px_-35px_rgba(78,114,225,0.35)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold">基本设置</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      完善您的讲师信息，让学员快速了解您和您的课程。
                    </p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-indigo-400" />
                </div>

                <form
                  className="mt-8 grid gap-6"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!isFormComplete) {
                      return;
                    }
                    console.log("instructor registration", {
                      ...formData,
                      agreed,
                    });
                  }}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">
                        姓名 / 昵称 *
                      </span>
                      <input
                        type="text"
                        placeholder="请输入您的姓名或昵称"
                        className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                        value={formData.name}
                        onChange={updateField("name")}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">
                        联系邮箱 *
                      </span>
                      <input
                        type="email"
                        placeholder="用于接收平台通知和收益结算"
                        className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                        value={formData.email}
                        onChange={updateField("email")}
                      />
                      <span className="mt-2 block text-xs text-slate-500">
                        邮箱仅用于平台通知，不会公开显示。
                      </span>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      专业领域 *
                    </span>
                    <select
                      className="mt-2 w-full appearance-none rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                      value={formData.domain}
                      onChange={updateField("domain")}
                    >
                      <option value="">选择您的主要专业领域</option>
                      <option value="blockchain">区块链 · Web3</option>
                      <option value="defi">去中心化金融</option>
                      <option value="nft">NFT 艺术</option>
                      <option value="security">智能合约安全</option>
                      <option value="other">其他领域</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      教学简介
                    </span>
                    <textarea
                      rows={4}
                      placeholder="简要介绍您将要教授的内容和教学风格（可选）..."
                      className="mt-2 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                      value={formData.bio}
                      onChange={updateField("bio")}
                    />
                  </label>

                  <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-indigo-50 bg-indigo-50">
                      <Image
                        src="/window.svg"
                        alt="讲师注册图示"
                        fill
                        className="object-contain p-4"
                        priority
                      />
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>上传课程资料、设置价格，即可完成课程上线。</p>
                      <p className="text-xs text-slate-500">
                        平台提供内容审核与上链服务，确保知识版权归属清晰。
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-white p-4 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition checked:border-indigo-400/80 checked:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                    />
                    <span>
                      我已阅读并同意{" "}
                      <Link
                        href="#"
                        className="text-indigo-500 underline decoration-indigo-300 decoration-dashed underline-offset-4 hover:text-indigo-400"
                      >
                        《讲师服务协议》
                      </Link>{" "}
                      和{" "}
                      <Link
                        href="#"
                        className="text-indigo-500 underline decoration-indigo-300 decoration-dashed underline-offset-4 hover:text-indigo-400"
                      >
                        《平台使用条款》
                      </Link>
                    </span>
                  </label>

                  <div className="flex flex-col gap-4 rounded-2xl bg-indigo-50/70 p-4 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">
                    <p>
                      提交后，平台将为您创建讲师中心，支持课程发布与收益管理。
                    </p>
                    <button
                      type="submit"
                      disabled={!isFormComplete}
                      className="inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500/90 disabled:cursor-not-allowed disabled:border-indigo-200 disabled:bg-white disabled:text-slate-400 disabled:shadow-none"
                    >
                      提交注册信息
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-indigo-100/80 bg-gradient-to-br from-[#edf0ff] via-[#e8f4ff] to-[#ffeafd] p-8 shadow-[0_25px_80px_-45px_rgba(78,114,225,0.55)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-lg font-semibold">讲师专享福利</h3>
                </div>
                <div className="mt-6 space-y-5">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="flex gap-4 rounded-2xl border border-white/70 bg-white/80 p-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">
                            {benefit.title}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${benefit.tagClassName}`}
                          >
                            {benefit.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-indigo-100/80 bg-white/80 p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-semibold">简单要求</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-600">
                  支持匿名教学，无需复杂审核，立即开始！
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
