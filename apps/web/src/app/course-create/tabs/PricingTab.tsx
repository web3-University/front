import React, { ChangeEvent } from "react";
import { useCourseContext } from "../components/CourseContext";

const PricingTab = () => {
  const { formData, updatePricing, errors } = useCourseContext();

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
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-4">定价设置</h3>

      {/* 价格和时长输入 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            课程价格 (YD代币) *
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={formData.pricingSetting.price}
              onChange={handlePriceChange}
              className={`bg-gray-700 text-white rounded-l-md p-2 flex-1 ${
                errors["pricingSetting.price"]
                  ? "border border-red-500"
                  : "border border-gray-600"
              }`}
            />
            <span className="bg-yellow-500 text-white text-xs px-2 py-2 rounded-r-md">
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
            <p className="text-blue-400 text-sm mt-1">
              建议价格: 200-2000 YD代币
            </p>
          )}
          {/* <p className="text-blue-400 text-sm mt-1">建议价格: 200-800 YD代币</p> */}
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            预估学习时长
          </label>
          <input
            type="text"
            value={formData.pricingSetting.estimatedDuration}
            onChange={handleDurationChange}
            placeholder="例: 20小时"
            className="bg-gray-700 text-white rounded-md p-2 w-full"
          />
        </div>
      </div>

      {/* 定价策略 */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm mb-3">定价策略</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleStrategySelect("basic")}
            className={`p-4 rounded-md ${
              formData.pricingSetting.pricingStrategy === "basic"
                ? "border-green-500"
                : "border-gray-600"
            } border flex flex-col items-center`}
          >
            <span className="text-green-400 text-2xl mb-2">$</span>
            <h4 className="text-white font-medium mb-1">基础定价</h4>
            <p className="text-blue-400 text-sm">200-400 YD</p>
          </button>
          <button
            onClick={() => handleStrategySelect("standard")}
            className={`p-4 rounded-md ${
              formData.pricingSetting.pricingStrategy === "standard"
                ? "border-blue-500"
                : "border-gray-600"
            } border flex flex-col items-center`}
          >
            <span className="text-blue-400 text-2xl mb-2">$</span>
            <h4 className="text-white font-medium mb-1">标准定价</h4>
            <p className="text-blue-400 text-sm">400-600 YD</p>
          </button>
          <button
            onClick={() => handleStrategySelect("premium")}
            className={`p-4 rounded-md ${
              formData.pricingSetting.pricingStrategy === "premium"
                ? "border-purple-500"
                : "border-gray-600"
            } border flex flex-col items-center`}
          >
            <span className="text-purple-400 text-2xl mb-2">$</span>
            <h4 className="text-white font-medium mb-1">高级定价</h4>
            <p className="text-blue-400 text-sm">600+ YD</p>
          </button>
        </div>
      </div>

      {/* 收益分成规则 */}
      <div className="bg-gradient-to-r from-gray-800 to-purple-900 rounded-md p-4">
        <h4 className="text-yellow-400 font-medium mb-2">💰 收益分成规则</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• 教师获得课程销售价格的 85%</li>
          <li>• 平台收取 15% 作为运营费用</li>
          <li>• 发布课程立即获得 10 YD代币奖励</li>
          <li>• 课程评分达到 4.5+ 获得额外奖励</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingTab;
