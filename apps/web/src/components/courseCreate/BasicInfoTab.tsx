import React, { type ChangeEvent, useState } from "react";
import { useCourseContext } from "./CourseContext";
import { useUpload } from "../../hooks/useUpload";

// 课程分类数据，每个对象包含value和label
const courseCategories = [
  { value: "blockchain_dev", label: "区块链开发" },
  { value: "frontend_dev", label: "前端开发" },
  { value: "security_audit", label: "安全审计" },
  { value: "defi_protocol", label: "DeFi协议" },
  { value: "nft_development", label: "NFT开发" },
  { value: "dao_governance", label: "DAO治理" },
];

// 难度级别数据，每个对象包含value和label
const difficultyLevels = [
  { value: "beginner", label: "初级" },
  { value: "intermediate", label: "中级" },
  { value: "advanced", label: "高级" },
];

const BasicInfoTab = () => {
  const { formData, setFormData, errors } = useCourseContext();
  const { uploadFile, isUploading, error, progress, reset } = useUpload();
  console.log(error, "___error");
  // 保存本地文件用于预览
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [name]: value },
    }));
  };

  const handleSelectChange = (
    name: "category" | "difficulty",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [name]: value },
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 立即保存本地文件并显示
    setLocalFile(file);

    // 开始上传
    const newUrl = await uploadFile(
      file,
      "image",
      formData.basicInfo.coverImage as string,
    );

    if (newUrl) {
      // 上传成功，更新为服务器 URL
      setFormData((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          coverImage: newUrl,
        },
      }));
    } else {
      // 上传失败，保持本地文件显示
      // localFile 已经设置，不需要额外操作
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        coverImage: null,
      },
    }));
    setLocalFile(null);
    reset();
  };

  const handlePreviewImage = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // 获取显示的图片 URL
  const getImageUrl = () => {
    if (
      formData.basicInfo.coverImage &&
      typeof formData.basicInfo.coverImage === "string"
    ) {
      // 有服务器 URL，使用服务器 URL
      return formData.basicInfo.coverImage;
    } else if (localFile) {
      // 只有本地文件，使用本地 URL
      try {
        return URL.createObjectURL(localFile);
      } catch (error) {
        console.error("创建本地 URL 失败:", error);
        // 如果创建本地 URL 失败，返回默认占位图
        return "https://placehold.co/1280x720/EEE/999?text=Course+Cover";
      }
    }
    return null;
  };

  // 获取文件名
  const getFileName = () => {
    if (localFile) {
      return localFile.name;
    } else if (
      formData.basicInfo.coverImage &&
      typeof formData.basicInfo.coverImage === "string"
    ) {
      // 从 URL 提取文件名
      const urlParts = formData.basicInfo.coverImage.split("/");
      return urlParts[urlParts.length - 1] || "课程封面";
    }
    return "";
  };

  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        tags: [...prev.basicInfo.tags, tagInput.trim()],
      },
    }));

    setTagInput(""); // ✅ 这里清空输入框
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        tags: prev.basicInfo.tags.filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddLearningGoal = () => {
    const goalInput = document.getElementById("goalInput") as HTMLInputElement;
    if (goalInput && goalInput.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          learningGoals: [
            ...prev.basicInfo.learningGoals,
            goalInput.value.trim(),
          ],
        },
      }));
      goalInput.value = "";
    }
  };

  const handleRemoveLearningGoal = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        learningGoals: prev.basicInfo.learningGoals.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const imageUrl = getImageUrl();
  const fileName = getFileName();
  const hasImage = imageUrl && fileName;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow space-y-4 text-black">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          课程标题 *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.basicInfo.title}
          onChange={handleInputChange}
          placeholder="输入吸引人的课程标题..."
          className={`w-full rounded-md border p-2 shadow-sm ${
            errors["basicInfo.title"] ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors["basicInfo.title"] && (
          <p className="text-red-500 text-xs mt-1">
            {errors["basicInfo.title"]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          课程描述 *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.basicInfo.description}
          onChange={handleInputChange}
          placeholder="详细描述课程内容、目标学员、学习收益..."
          className={`w-full rounded-md border p-2 shadow-sm ${
            errors["basicInfo.description"]
              ? "border-red-400"
              : "border-gray-300"
          }`}
        />
        {errors["basicInfo.description"] && (
          <p className="text-red-500 text-xs mt-1">
            {errors["basicInfo.description"]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            课程分类 *
          </label>
          <select
            value={formData.basicInfo.category}
            onChange={(e) => handleSelectChange("category", e.target.value)}
            className={`w-full rounded-md border p-2 ${
              errors["basicInfo.category"]
                ? "border-red-400"
                : "border-gray-300"
            }`}
          >
            <option value="" hidden>
              选择课程分类
            </option>
            {courseCategories.map((c) => (
              <option key={c.label} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
          {errors["basicInfo.category"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["basicInfo.category"]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            难度级别 *
          </label>
          <select
            value={formData.basicInfo.difficulty}
            onChange={(e) => handleSelectChange("difficulty", e.target.value)}
            className={`w-full rounded-md border p-2 ${
              errors["basicInfo.difficulty"]
                ? "border-red-400"
                : "border-gray-300"
            }`}
          >
            {difficultyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {errors["basicInfo.difficulty"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["basicInfo.difficulty"]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          课程封面图 *
        </label>

        {hasImage ? (
          <div className="border border-gray-200 rounded-md p-4">
            {/* 文件信息区域 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1">
                <svg
                  className="w-5 h-5 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-700 truncate">
                  {fileName}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePreviewImage}
                  className="text-xs px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  预览
                </button>
                <button
                  type="button"
                  onClick={handleRemoveCoverImage}
                  disabled={isUploading}
                  className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 ml-3"
                >
                  移除
                </button>
              </div>
            </div>

            {/* 上传进度条 */}
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  上传中... {progress}%
                </p>
              </div>
            )}

            {/* 上传失败提示 */}
            {error && (
              <div className="mt-2 flex items-center space-x-1 text-red-500 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>上传失败（显示本地文件）</span>
              </div>
            )}

            {/* 上传成功提示 */}
            {!isUploading && !error && formData.basicInfo.coverImage && (
              <div className="mt-2 flex items-center space-x-1 text-green-500 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>上传成功</span>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <p className="text-gray-500 mb-1">上传课程封面</p>
            <p className="text-gray-400 text-xs mb-3">
              建议尺寸 1280x720，支持 JPG / PNG
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="coverImage"
            />
            <label
              htmlFor="coverImage"
              className="inline-block px-4 py-2 bg-purple-500 text-white text-sm rounded-md cursor-pointer hover:bg-purple-600"
            >
              选择文件
            </label>
          </div>
        )}

        {errors["basicInfo.coverImage"] && (
          <p className="text-red-500 text-xs mt-1">
            {errors["basicInfo.coverImage"]}
          </p>
        )}
      </div>

      {/* 图片预览模态框 */}
      {showPreview && imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleClosePreview}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
            >
              ×
            </button>
            <img
              src={imageUrl}
              alt="封面预览"
              className="max-w-full max-h-[85vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.error("图片加载失败");
                e.currentTarget.src =
                  "https://placehold.co/1280x720/EEE/999?text=Course+Cover";
              }}
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          课程标签
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.basicInfo.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
            >
              {tag}
              <button onClick={() => handleRemoveTag(index)} className="ml-1">
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 rounded-l-md border border-gray-300 p-2"
            placeholder="添加标签..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-purple-500 text-white px-3 py-2 rounded-r-md"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          学习目标
        </label>
        {formData.basicInfo.learningGoals.map((goal, index) => (
          <div key={index} className="flex items-stretch mb-2">
            <span className="text-purple-500 text-xl mr-2 flex items-center">
              📌
            </span>
            <input
              type="text"
              value={goal}
              onChange={(e) => {
                const newGoals = [...formData.basicInfo.learningGoals];
                newGoals[index] = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, learningGoals: newGoals },
                }));
              }}
              className="flex-1 rounded-l-md border border-gray-300 p-2 border-r-0"
            />
            <button
              type="button"
              onClick={() => handleRemoveLearningGoal(index)}
              className="bg-red-500 text-white w-10 flex items-center justify-center rounded-r-md hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <div className="flex items-stretch ml-[1.8rem]">
          <input
            id="goalInput"
            className="flex-1 rounded-l-md border border-gray-300 p-2 border-r-0"
            placeholder="新的学习目标..."
          />
          <button
            type="button"
            onClick={handleAddLearningGoal}
            className="bg-green-500 text-white w-10 flex items-center justify-center rounded-r-md hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
