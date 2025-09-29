import React from "react";

const RewardInfo = () => {
  return (
    <div className="rounded-lg p-4 border border-yellow-600/30">
      <div className="flex items-center mb-4">
        <span className="text-yellow-400 text-xl mr-2">🎁</span>
        <h3 className="text-yellow-400 text-base font-medium">奖励机制</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-purple-200 text-sm">发布奖励:</p>
          <p className="text-yellow-400 text-sm font-medium">+10 YD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-purple-200 text-sm">首次购买:</p>
          <p className="text-yellow-400 text-sm font-medium">+5 YD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-purple-200 text-sm">5星评价:</p>
          <p className="text-yellow-400 text-sm font-medium">+3 YD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-purple-200 text-sm">预估收益:</p>
          <p className="text-yellow-400 text-sm font-medium">+254 YD</p>
        </div>
      </div>
    </div>
  );
};

export default RewardInfo;
