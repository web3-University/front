"use client";

import React, { useState, useRef, useEffect } from "react";

interface SubmitDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: string;
    target: string;
    description: string;
  }) => void;
}

// 自定义下拉组件
function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  color = "red",
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
  color?: "red" | "purple";
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

  const colorClasses =
    color === "red"
      ? "focus:ring-red-500 hover:border-red-400"
      : "focus:ring-purple-500 hover:border-purple-400";

  const selectedClasses =
    color === "red"
      ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
      : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700";

  const hoverClasses =
    color === "red"
      ? "hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50"
      : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50";

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:outline-none bg-white text-left flex items-center justify-between transition-colors ${colorClasses}`}
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
              className={`w-full px-4 py-3 text-left transition-all ${
                value === option
                  ? `${selectedClasses} font-medium`
                  : `text-gray-700 ${hoverClasses}`
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

export default function SubmitDisputeModal({
  isOpen,
  onClose,
  onSubmit,
}: SubmitDisputeModalProps) {
  const [type, setType] = useState("内容质量");
  const [target, setTarget] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;
  // 每次打开模态框时清空输入框
  useEffect(() => {
    if (isOpen) {
      setType("内容质量");
      setTarget("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!target.trim() || !description.trim()) return;
    onSubmit({ type, target, description });
    onClose();
  };

  const disputeTypes = ["内容质量", "教师态度", "课程欺诈", "其他"];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-50 to-white rounded-3xl w-full max-w-lg shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">提交争议</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none hover:rotate-90 transition-all duration-300"
          >
            ×
          </button>
        </div>

        {/* Deposit Info */}
        <p className="text-gray-600 text-sm mb-6">
          提交争议需要质押{" "}
          <span className="font-semibold text-red-500">500 YD</span> 代币,
          如果争议被驳回,质押将被扣除。
        </p>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              争议类型
            </label>
            <CustomSelect
              value={type}
              onChange={setType}
              options={disputeTypes}
              color="red"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              被投诉对象
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="教师用户名或课程ID"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              争议描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="请详细描述争议情况,提供相关证据…"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all font-medium shadow-lg shadow-red-500/30"
          >
            提交争议(质押500 YD)
          </button>
        </div>
      </div>
    </div>
  );
}
