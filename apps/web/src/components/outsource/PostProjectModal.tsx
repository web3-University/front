"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PostProjectModalProps {
  onClose: () => void;
}

export default function PostProjectModal({ onClose }: PostProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    category: "smart-contract",
    difficulty: "intermediate",
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现项目发布逻辑
    console.log("发布项目:", formData);
    alert("项目发布成功!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl mx-4">
        {/* 头部 */}
        <div className="sticky top-0 bg-gradient-to-r from-[#8A71FF] via-[#FF9D6B] to-[#FF7A7B] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">发布新项目</h2>
              <p className="mt-1 text-white/90">
                填写项目详情，让优质开发者为您工作
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* 项目标题 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
              项目标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="例如: 开发DeFi借贷协议智能合约"
              className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
            />
          </div>

          {/* 项目描述 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
              项目描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="详细描述项目需求、技术要求、交付标准等..."
              className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
            />
            <p className="mt-1 text-sm text-[#6A6D94]">
              详细的描述有助于吸引更合适的开发者
            </p>
          </div>

          {/* 预算范围 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
                最低预算 (YD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.budgetMin}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMin: e.target.value })
                }
                placeholder="10000"
                className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
                最高预算 (YD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.budgetMax}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMax: e.target.value })
                }
                placeholder="20000"
                className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
              />
            </div>
          </div>

          {/* 截止日期 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
              项目周期 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              placeholder="例如: 30天"
              className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
            />
          </div>

          {/* 项目类别和难度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
                项目类别 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
              >
                <option value="smart-contract">智能合约开发</option>
                <option value="frontend">前端开发</option>
                <option value="backend">后端开发</option>
                <option value="data-analysis">数据分析</option>
                <option value="design">UI/UX设计</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
                难度等级 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
              >
                <option value="beginner">初级</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
          </div>

          {/* 技能标签 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2B2558]">
              所需技能标签
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="例如: Solidity, React, Web3.js (用逗号分隔)"
              className="w-full rounded-xl border border-[#E5E6F8] px-4 py-3 text-[#2B2558] placeholder:text-[#6A6D94] focus:border-[#8A71FF] focus:outline-none focus:ring-2 focus:ring-[#8A71FF]/20"
            />
            <p className="mt-1 text-sm text-[#6A6D94]">
              添加相关技能标签有助于精准匹配开发者
            </p>
          </div>

          {/* 提示信息 */}
          <div className="rounded-xl bg-[#F2F3FF] p-4">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-[#8A71FF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-[#6A6D94]">
                <p className="font-semibold text-[#2B2558] mb-1">发布提示:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>项目发布后需要支付预算的10%作为托管保证金</li>
                  <li>优质开发者会在24小时内开始申请</li>
                  <li>您可以查看申请者的历史评价和作品集</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              取消
            </Button>
            <Button type="submit" variant="primary" size="lg" fullWidth>
              发布项目
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
