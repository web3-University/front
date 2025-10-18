import React, { type ChangeEvent } from "react";
import { type CourseContentItem, useCourseContext } from "./CourseContext";

const ContentTab = () => {
  const { formData, updateChapter, addChapter, removeChapter, errors } =
    useCourseContext();

  // 处理章节类型切换（视频/文字）
  const handleTypeChange = (id: string, type: "video" | "text") => {
    updateChapter(id, { type });
  };

  // 处理章节输入变更（标题、描述、时长等）
  const handleChapterChange = (
    id: string,
    field: keyof Omit<CourseContentItem, "id" | "type">,
    value: string | boolean | File | null,
  ) => {
    updateChapter(id, { [field]: value } as Partial<CourseContentItem>);
  };

  // 处理视频上传
  const handleVideoUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleChapterChange(id, "videoFile", e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-gray-800 text-lg font-semibold">课程内容</h3>
      <button
        onClick={addChapter}
        className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-md shadow hover:opacity-90 transition"
      >
        + 添加章节
      </button>

      {formData.courseContent.map((chapter) => (
        <div
          key={chapter.id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow space-y-4"
        >
          <div className="flex justify-between items-center">
            {/* 章节标题、类型切换 */}
            <input
              type="text"
              value={chapter.title}
              onChange={(e) =>
                handleChapterChange(chapter.id, "title", e.target.value)
              }
              placeholder="章节标题"
              className="flex-1 rounded-md border border-gray-300 p-2 text-gray-800"
            />
            <div className="flex items-center gap-2 ml-4">
              {/* 章节类型下拉选择 */}
              <select
                value={chapter.type}
                onChange={(e) =>
                  handleTypeChange(
                    chapter.id,
                    e.target.value as "video" | "text",
                  )
                }
                className="rounded-md border border-gray-300 p-2 text-gray-800"
              >
                <option value="video">视频</option>
                <option value="text">文字</option>
              </select>
              <button
                onClick={() => removeChapter(chapter.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                ×
              </button>
            </div>
          </div>
          {/* 章节描述 */}
          <textarea
            value={chapter.description}
            onChange={(e) =>
              handleChapterChange(chapter.id, "description", e.target.value)
            }
            placeholder="章节描述..."
            className={`w-full rounded-md border p-2 text-gray-800 ${
              errors[`courseContent.${chapter.id}.description`]
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
          {errors[`courseContent.${chapter.id}.description`] && (
            <p className="text-red-500 text-xs">
              {errors[`courseContent.${chapter.id}.description`]}
            </p>
          )}

          {/* 视频/文字内容区域 */}
          {chapter.type === "video" ? (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center bg-gray-50">
              <p className="text-gray-600 mb-2">上传视频文件</p>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(chapter.id, e)}
                className="hidden"
                id={`video-${chapter.id}`}
              />
              <label
                htmlFor={`video-${chapter.id}`}
                className="inline-block px-4 py-2 bg-purple-500 text-white text-sm rounded-md cursor-pointer"
              >
                选择视频
              </label>
              {chapter.videoFile && (
                <p className="text-sm text-gray-500 mt-2">
                  已选择：{chapter.videoFile.name}
                </p>
              )}
              {errors[`courseContent.${chapter.id}.videoFile`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`courseContent.${chapter.id}.videoFile`]}
                </p>
              )}
            </div>
          ) : (
            <textarea
              value={chapter.textContent || ""}
              onChange={(e) =>
                handleChapterChange(chapter.id, "textContent", e.target.value)
              }
              placeholder="输入课程文字内容..."
              className={`w-full rounded-md border p-2 text-gray-800 ${
                errors[`courseContent.${chapter.id}.textContent`]
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
              rows={4}
            />
          )}

          {/* 时长与免费预览 */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={chapter.duration || ""}
              onChange={(e) =>
                handleChapterChange(chapter.id, "duration", e.target.value)
              }
              placeholder="时长 (分钟)"
              className="w-28 rounded-md border border-gray-300 p-2 text-gray-800"
            />
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={chapter.isFreePreview}
                onChange={(e) =>
                  handleChapterChange(
                    chapter.id,
                    "isFreePreview",
                    e.target.checked,
                  )
                }
                className="accent-purple-500"
              />
              免费预览
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentTab;
