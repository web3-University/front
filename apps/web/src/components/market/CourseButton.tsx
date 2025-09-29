"use client";

import { ButtonCva } from "@web3-university/ui";

const CourseButton = ({ course }: { course: any }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-yellow-400 font-bold text-xl">
          {course.price}
        </span>
        <span className="text-gray-400 line-through text-sm ml-2">
          {course.originalPrice}
        </span>
      </div>
      <button
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
      >
        <ButtonCva></ButtonCva>
      </button>
    </div>
  );
};

export default CourseButton;
