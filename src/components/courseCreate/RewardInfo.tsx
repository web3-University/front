import React from "react";
import { useTranslations } from "next-intl";

const RewardInfo = () => {
  const tReward = useTranslations("courseCreate.sidebar.reward");
  const rewardKeys = [
    "publish",
    "firstPurchase",
    "fiveStar",
    "estimated",
  ] as const;

  return (
    <div className="bg-white border border-yellow-200 rounded-lg p-4 shadow">
      <div className="flex items-center mb-4">
        <span className="text-yellow-500 text-xl mr-2">🎁</span>
        <h3 className="text-yellow-600 text-base font-semibold">
          {tReward("title")}
        </h3>
      </div>
      <div className="space-y-2">
        {rewardKeys.map((key) => (
          <div key={key} className="flex justify-between">
            <p className="text-gray-700 text-sm">
              {tReward(`items.${key}.label`)}
            </p>
            <p className="text-yellow-600 text-sm font-semibold">
              {tReward(`items.${key}.value`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardInfo;
