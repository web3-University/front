import CourseButton from "./CourseButton";

const CourseItem = ({ course }: { course: any }) => {
  return (
    <div
      key={course.id}
      className="bg-[#111c33] rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
    >
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gray-800">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            {course.tag === "DeFi" && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                {course.tag}
              </div>
            )}
            {course.tag === "NFT" && (
              <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                {course.tag}
              </div>
            )}
            {course.tag === "热门" && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {course.tag}
              </div>
            )}
            {course.tag === "精选" && (
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                {course.tag}
              </div>
            )}
            {course.tag === "安全" && (
              <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded">
                {course.tag}
              </div>
            )}
            {course.tag === "治理" && (
              <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                {course.tag}
              </div>
            )}

            {/* 播放按钮或课程图标 */}
            {course.id % 2 === 0 ? (
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center"></div>
            ) : (
              <div className="text-3xl font-bold text-white">
                {course.title.substring(0, 1)}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <title>收藏</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{course.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{course.description}</p>
        <div className="flex items-center text-sm mb-3">
          <span className="text-gray-400">讲师：</span>
          <span className="ml-1">{course.instructor}</span>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-1"></div>
          <span className="font-medium mr-1">{course.rating}</span>
          <span className="text-gray-400 mr-2">({course.reviews})</span>
          <span className="text-gray-400">{course.duration}</span>
        </div>

        <CourseButton course={course} />
      </div>
    </div>
  );
};

export default CourseItem;
