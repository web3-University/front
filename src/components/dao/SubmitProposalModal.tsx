"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

interface SubmitProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: string;
    description: string;
  }) => void;
  isSubmitting?: boolean;
  requiredDeposit?: string;
  userBalance?: string;
}

// 自定义下拉组件
function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
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
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-left flex items-center justify-between hover:border-purple-400 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span>
          {options.find((option) => option.value === value)?.label ?? ""}
        </span>
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

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all ${
                value === option.value
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium"
                  : "text-gray-700"
              } ${index !== options.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              {value === option.value && (
                <span className="inline-block mr-2">✓</span>
              )}
              {option.label}
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
  isSubmitting = false,
  requiredDeposit = "1000",
  userBalance = "0",
}: SubmitProposalModalProps) {
  const t = useTranslations("dao.submitProposal");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("平台治理");
  const [description, setDescription] = useState("");

  // 每次打开模态框时清空输入框
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setType("平台治理");
      setDescription("");
    }
  }, [isOpen]);

  const proposalTypes = useMemo(
    () => [
      { value: "平台治理", label: t("form.types.platform") },
      { value: "生态发展", label: t("form.types.ecosystem") },
      { value: "社区建设", label: t("form.types.community") },
      { value: "其他", label: t("form.types.other") },
    ],
    [t],
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    // 验证表单
    if (!title.trim()) {
      alert(t("form.errors.titleRequired"));
      return;
    }
    if (title.trim().length < 5) {
      alert(t("form.errors.titleTooShort"));
      return;
    }
    if (!description.trim()) {
      alert(t("form.errors.descriptionRequired"));
      return;
    }
    if (description.trim().length < 10) {
      alert(t("form.errors.descriptionTooShort"));
      return;
    }
    if (description.trim().length > 500) {
      alert(t("form.errors.descriptionTooLong"));
      return;
    }

    // 检查余额
    const balance = parseFloat(userBalance);
    const deposit = parseFloat(requiredDeposit);
    if (balance < deposit) {
      alert(
        t("form.errors.balance", {
          required: requiredDeposit,
          balance: userBalance,
        }),
      );
      return;
    }

    onSubmit({ title, type, description });
  };

  // 检查余额是否充足
  const hasEnoughBalance =
    parseFloat(userBalance) >= parseFloat(requiredDeposit);

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
          <h2 className="text-2xl font-bold text-gray-900">{t("header")}</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none hover:rotate-90 transition-all duration-300 disabled:opacity-50"
            aria-label={t("closeLabel")}
          >
            ×
          </button>
        </div>

        {/* Deposit Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                {t("deposit.notice", { amount: requiredDeposit })}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {t("deposit.balanceLabel")}{" "}
                <span
                  className={
                    hasEnoughBalance ? "text-green-600" : "text-red-600"
                  }
                >
                  {t("deposit.balanceValue", { balance: userBalance })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t("form.titleLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("form.titlePlaceholder")}
              maxLength={50}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("form.charCount", { count: title.length, max: 50 })}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t("form.typeLabel")} <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={type}
              onChange={setType}
              options={proposalTypes}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t("form.descriptionLabel")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder={t("form.descriptionPlaceholder")}
              maxLength={500}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("form.charCount", { count: description.length, max: 500 })}
            </p>
          </div>
        </div>

        {/* Warning if insufficient balance */}
        {!hasEnoughBalance && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-red-700">{t("form.balanceWarning")}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("form.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !hasEnoughBalance}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all font-medium shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600 flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span>
              {isSubmitting
                ? t("form.submitting")
                : t("form.submitCta", { amount: requiredDeposit })}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
