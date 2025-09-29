import React, { ChangeEvent, useState } from "react";
import { useCourseContext } from "../components/CourseContext";

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
      basicInfo: {
        ...prev.basicInfo,
        [name]: value,
      },
    }));
  };

  const handleSelectChange = (
    name: "category" | "difficulty",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        coverImage: input.files![0],
      },
    }));
    setIsCoverImageUploaded(true);
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        coverImage: null,
      },
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
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-6">课程基本信息</h3>
      {/* 课程标题 */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-300 text-sm mb-1">
          课程标题 *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.basicInfo.title}
          onChange={handleInputChange}
          className={`w-full bg-gray-700 text-white rounded-md p-2 ${
            errors["basicInfo.title"] ? "border-red-500" : "border-gray-600"
          } border`}
          placeholder="输入吸引人的课程标题..."
        />
        {errors["basicInfo.title"] && (
          <p className="text-red-500 text-xs mt-1">
            {errors["basicInfo.title"]}
          </p>
        )}
      </div>

      {/* 课程描述 */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-300 text-sm mb-1"
        >
          课程描述 *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.basicInfo.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full bg-gray-700 text-white rounded-md p-2 ${
            errors["basicInfo.description"]
              ? "border-red-500"
              : "border-gray-600"
          } border`}
          placeholder="详细描述课程内容、目标学员、学习收益..."
        />
        {errors["basicInfo.description"] && (
          <p className="text-red-500 text-xs mt-1">
            {errors["basicInfo.description"]}
          </p>
        )}
      </div>

      {/* 课程分类和难度级别 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="category"
            className="block text-gray-300 text-sm mb-1"
          >
            课程分类 *
          </label>
          <select
            id="category"
            value={formData.basicInfo.category}
            onChange={(e) => handleSelectChange("category", e.target.value)}
            className={`w-full bg-gray-700 text-white rounded-md p-2 ${
              errors["basicInfo.category"]
                ? "border-red-500"
                : "border-gray-600"
            } border`}
          >
            <option value="" hidden>
              选择课程分类
            </option>
            {courseCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
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
          <label
            htmlFor="difficulty"
            className="block text-gray-300 text-sm mb-1"
          >
            难度级别 *
          </label>
          <select
            id="difficulty"
            value={formData.basicInfo.difficulty}
            onChange={(e) => handleSelectChange("difficulty", e.target.value)}
            className={`w-full bg-gray-700 text-white rounded-md p-2 ${
              errors["basicInfo.difficulty"]
                ? "border-red-500"
                : "border-gray-600"
            }  border-gray-600 border`}
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

      {/* 课程封面图 */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-1">课程封面图 *</label>
        {isCoverImageUploaded ? (
          <div className="relative bg-gray-700 rounded-md p-4">
            {formData.basicInfo.coverImage && (
              <img
                src={URL.createObjectURL(formData.basicInfo.coverImage)}
                alt="课程封面预览"
                className="w-full h-auto max-h-48 object-contain"
              />
            )}
            <button
              onClick={handleRemoveCoverImage}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              移除
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-600 rounded-md p-8 text-center">
            <p className="text-gray-400 mb-1">上传课程封面</p>
            <p className="text-gray-500 text-xs mb-3">
              支持 JPG, PNG 格式，建议尺寸 1280x720
            </p>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              className="hidden"
              id="coverImage"
            />
            <label
              htmlFor="coverImage"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md cursor-pointer"
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

      {/* 课程标签 */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-1">课程标签</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.basicInfo.tags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-1 text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            id="tagInput"
            className="flex-1 bg-gray-700 text-white rounded-l-md p-2 border border-gray-600"
            placeholder="添加标签..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-blue-600 text-white px-3 py-2 rounded-r-md"
          >
            +
          </button>
        </div>
      </div>

      {/* 学习目标 */}
      <div>
        <label className="block text-gray-300 text-sm mb-1">学习目标</label>
        {formData.basicInfo.learningGoals.map((goal, index) => (
          <div key={index} className="flex items-center mb-2">
            <span className="bg-green-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full mr-2">
              ⓘ
            </span>
            <input
              type="text"
              value={goal}
              onChange={(e) => {
                const newGoals = [...formData.basicInfo.learningGoals];
                newGoals[index] = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    learningGoals: newGoals,
                  },
                }));
              }}
              className="flex-1 bg-gray-700 text-white rounded-l-md p-2 border border-gray-600"
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
            type="text"
            id="goalInput"
            className="flex-1 bg-gray-700 text-white rounded-l-md p-2 border border-gray-600"
            placeholder="新的学习目标..."
          />
          <button
            type="button"
            onClick={handleAddLearningGoal}
            className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-r-md"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
