import React from "react";

const CreationSuggestions = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white border border-purple-200 rounded-lg p-4 shadow">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-500 font-semibold text-sm">
          💡 创建建议
        </span>
      </div>
      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
        <li>标题要简洁有力，突出核心价值</li>
        <li>描述要详尽，包含学习目标和适用人群</li>
        <li>视频画质建议 1080p 以上</li>
        <li>每章节时长控制在 10-30 分钟</li>
        <li>添加实践案例增加课程价值</li>
      </ul>
    </div>
  );
};

export default CreationSuggestions;
