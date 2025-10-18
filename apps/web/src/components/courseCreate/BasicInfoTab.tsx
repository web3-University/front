import React, { type ChangeEvent, useState } from "react";
import { useCourseContext } from "./CourseContext";

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
  const [isCoverImageUploaded, setIsCoverImageUploaded] = useState(
    !!formData.basicInfo.coverImage,
  );

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, coverImage: input.files![0] },
    }));
    setIsCoverImageUploaded(true);
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, coverImage: null },
    }));
    setIsCoverImageUploaded(false);
  };

  const handleAddTag = () => {
    const tagInput = document.getElementById("tagInput") as HTMLInputElement;
    if (tagInput && tagInput.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          tags: [...prev.basicInfo.tags, tagInput.value.trim()],
        },
      }));
      tagInput.value = "";
    }
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
              <option key={c.value} value={c.value}>
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
        {isCoverImageUploaded ? (
          <div className="relative bg-white border border-gray-200 rounded-md p-4">
            {formData.basicInfo.coverImage && (
              <img
                src={
                  formData.basicInfo.coverImage instanceof File ||
                  formData.basicInfo.coverImage instanceof Blob
                    ? URL.createObjectURL(formData.basicInfo.coverImage)
                    : formData.basicInfo.coverImage // 假设是字符串 URL
                }
                alt="课程封面预览"
                className="w-full h-auto max-h-48 object-contain rounded"
                onError={(e) => {
                  console.error("图片加载失败", e);
                  e.currentTarget.src = "/placeholder-image.png"; // 可选：设置占位图
                }}
              />
            )}
            <button
              onClick={handleRemoveCoverImage}
              className="absolute top-2 right-2 text-xs px-2 py-1 bg-red-500 text-white rounded"
            >
              移除
            </button>
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
              className="inline-block px-4 py-2 bg-purple-500 text-white text-sm rounded-md cursor-pointer"
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
              {tag}{" "}
              <button onClick={() => handleRemoveTag(index)} className="ml-1">
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            id="tagInput"
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
          <div key={index} className="flex items-center mb-2">
            <span className="text-purple-500 text-xl mr-2">📌</span>
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
              className="flex-1 rounded-l-md border border-gray-300 p-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveLearningGoal(index)}
              className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-r-md"
            >
              ×
            </button>
          </div>
        ))}
        <div className="flex items-center">
          <input
            id="goalInput"
            className="flex-1 rounded-l-md border border-gray-300 p-2"
            placeholder="新的学习目标..."
          />
          <button
            type="button"
            onClick={handleAddLearningGoal}
            className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-r-md"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
