import React from "react";

const CreationSuggestions = () => {
  return (
    <div className="p-4 rounded-xl border border-purple-500/50 bg-gradient-to-b from-[#142a48] to-[#1a2149] shadow-lg mt-6 mb-6">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        {/* <Lightbulb className="text-green-400 w-5 h-5" /> */}
        <span className="font-semibold text-green-400">💡 创建建议</span>
      </div>

      {/* 内容 */}
      <ul className="text-sm text-gray-200 space-y-2 leading-relaxed">
        <li>· 标题要简洁有力，突出核心价值</li>
        <li>· 描述要详尽，包含学习目标和适用人群</li>
        <li>· 视频画质建议1080p以上</li>
        <li>· 每个章节时长控制在10-30分钟</li>
        <li>· 添加实践案例增加课程价值</li>
      </ul>
    </div>
  );
};

export default CreationSuggestions;
