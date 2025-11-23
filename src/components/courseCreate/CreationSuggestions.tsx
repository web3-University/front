import React from "react";
import { useTranslations } from "next-intl";

const CreationSuggestions = () => {
  const tSuggestions = useTranslations("courseCreate.sidebar.suggestions");
  const suggestionKeys = [
    "conciseTitle",
    "detailedDescription",
    "videoQuality",
    "chapterLength",
    "caseStudies",
  ] as const;

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white border border-purple-200 rounded-lg p-4 shadow">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-500 font-semibold text-sm">
          {tSuggestions("title")}
        </span>
      </div>
      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
        {suggestionKeys.map((key) => (
          <li key={key}>{tSuggestions(`items.${key}`)}</li>
        ))}
      </ul>
    </div>
  );
};

export default CreationSuggestions;
