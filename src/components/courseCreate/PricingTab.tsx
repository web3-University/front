import React, { type ChangeEvent } from "react";
import { useCourseCreateStore } from "@/state/courseCreate/hooks";

const PricingTab = () => {
  const { formData, updatePricing, errors } = useCourseCreateStore();

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const price = parseInt(e.target.value, 10) || 0;
    updatePricing({ price });
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    updatePricing({ estimatedDuration: e.target.value });
  };

  const handleStrategySelect = (strategy: "basic" | "standard" | "premium") => {
    let price = formData.pricingSetting.price;
    if (strategy === "basic" && price < 200) price = 200;
    else if (strategy === "standard" && price < 400) price = 400;
    else if (strategy === "premium" && price < 600) price = 600;
    updatePricing({ pricingStrategy: strategy, price });
  };

  return (
    <div className="space-y-6 text-gray-800">
      <h3 className="text-lg font-semibold">定价设置</h3>

      {/* 价格和时长输入 */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            课程价格 (YD代币) *
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={formData.pricingSetting.price}
              onChange={handlePriceChange}
              className={`flex-1 rounded-l-md border p-2 shadow-sm ${
                errors["pricingSetting.price"]
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />
            <span className="bg-yellow-400 text-black text-xs px-3 py-2 rounded-r-md font-semibold">
              YD
            </span>
          </div>
          {/* 显示价格校验错误 */}
          {errors["pricingSetting.price"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["pricingSetting.price"]}
            </p>
          )}
          {/* 合法价格时显示建议范围 */}
          {!errors["pricingSetting.price"] && (
            <p className="text-sm text-purple-500 mt-1">
              建议价格: 200-2000 YD
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">预估学习时长</label>
          <input
            type="text"
            value={formData.pricingSetting.estimatedDuration}
            onChange={handleDurationChange}
            placeholder="例：20小时"
            className={`w-full rounded-md border p-2 shadow-sm ${
              errors["pricingSetting.estimatedDuration"]
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
        </div>
      </div>

      {/* 定价策略 */}
      <div>
        <label className="block text-sm font-medium mb-2">定价策略</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleStrategySelect("basic")}
            className={`p-4 rounded-lg border ${
              formData.pricingSetting.pricingStrategy === "basic"
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-white"
            } flex flex-col items-center hover:shadow-md transition`}
          >
            <span className="text-green-500 text-xl mb-1">💸</span>
            <span className="font-medium">基础定价</span>
            <span className="text-sm text-gray-500">200 - 400 YD</span>
          </button>

          <button
            onClick={() => handleStrategySelect("standard")}
            className={`p-4 rounded-lg border ${
              formData.pricingSetting.pricingStrategy === "standard"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white"
            } flex flex-col items-center hover:shadow-md transition`}
          >
            <span className="text-blue-500 text-xl mb-1">💰</span>
            <span className="font-medium">标准定价</span>
            <span className="text-sm text-gray-500">400 - 600 YD</span>
          </button>

          <button
            onClick={() => handleStrategySelect("premium")}
            className={`p-4 rounded-lg border ${
              formData.pricingSetting.pricingStrategy === "premium"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 bg-white"
            } flex flex-col items-center hover:shadow-md transition`}
          >
            <span className="text-purple-500 text-xl mb-1">🌟</span>
            <span className="font-medium">高级定价</span>
            <span className="text-sm text-gray-500">600+ YD</span>
          </button>
        </div>
      </div>

      {/* 收益分成规则 */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-50 border border-purple-200 rounded-md p-4">
        <h4 className="text-purple-700 font-semibold mb-2">💡 收益分成规则</h4>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>教师获得课程销售价格的 85%</li>
          <li>平台收取 15% 作为运营费用</li>
          <li>发布课程立即获得 10 YD代币奖励</li>
          <li>课程评分达到 4.5+ 获得额外奖励</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingTab;
