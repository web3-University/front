import React from "react";

const RewardInfo = () => {
  return (
    <div className="bg-white border border-yellow-200 rounded-lg p-4 shadow">
      <div className="flex items-center mb-4">
        <span className="text-yellow-500 text-xl mr-2">🎁</span>
        <h3 className="text-yellow-600 text-base font-semibold">奖励机制</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-gray-700 text-sm">发布奖励:</p>
          <p className="text-yellow-600 text-sm font-semibold">+10 YD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700 text-sm">首次购买:</p>
          <p className="text-yellow-600 text-sm font-semibold">+5 YD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700 text-sm">5星评价:</p>
          <p className="text-yellow-600 text-sm font-semibold">+3 YD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700 text-sm">预估收益:</p>
          <p className="text-yellow-600 text-sm font-semibold">+254 YD</p>
        </div>
      </div>
    </div>
  );
};

export default RewardInfo;
