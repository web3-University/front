"use client";

import React, { useState, useRef, useEffect } from "react";

interface SubmitProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: string;
    description: string;
  }) => void;
}

// 自定义下拉组件
function CustomSelect({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-left flex items-center justify-between hover:border-purple-400 transition-colors"
      >
        <span>{value}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {options.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all ${
                value === option
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium"
                  : "text-gray-700"
              } ${index !== options.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              {value === option && <span className="inline-block mr-2">✓</span>}
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubmitProposalModal({
  isOpen,
  onClose,
  onSubmit,
}: SubmitProposalModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("平台治理");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title, type, description });
    onClose();
  };

  const proposalTypes = ["平台治理", "生态发展", "社区建设", "其他"];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-50 to-white rounded-3xl w-full max-w-lg shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">提交新提案</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none hover:rotate-90 transition-all duration-300"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          提交提案需要质押{" "}
          <span className="font-semibold text-purple-600">1000 YD</span> 代币,
          如果提案被拒绝,质押将被扣除。
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              提案标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入提案标题"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              提案类型
            </label>
            <CustomSelect
              value={type}
              onChange={setType}
              options={proposalTypes}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              详细描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="请详细描述你的提案内容、目标和预期效果…"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white resize-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all font-medium shadow-lg shadow-purple-500/30"
          >
            提交提案(质押1000 YD)
          </button>
        </div>
      </div>
    </div>
  );
}
