import { Star, Wallet } from "lucide-react";
import CourseButton from "./CourseButton";

interface CourseItemProps {
  course: any;
  onBuy?: (course: any) => void;
}

const CourseItem: React.FC<CourseItemProps> = (props) => {
  const { course, onBuy } = props;

  return (
    <article
      key={course.id}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F7F5FF] px-6 pb-6 pt-6 shadow-[0_22px_60px_rgba(168,174,255,0.22)] ring-1 ring-[#ECEBFF] transition-transform duration-200 hover:-translate-y-2"
    >
      <div
        className={`relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${course.coverColor}`}
      >
        <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2B2558]">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 pt-6 text-left">
        <div>
          <h3 className="text-xl font-semibold text-[#2B2558]">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-[#7B7EA9]">
            讲师：{course.instructor}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[#F5B742]">
            <Star className="h-4 w-4 fill-[#F5B742] text-[#F5B742]" />
            <span className="font-semibold">{course.rating.toFixed(1)}</span>
            <span className="text-xs text-[#8F92B5]">
              ({course.students}人)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#FF9F50]">
            <Wallet className="h-4 w-4" />
            <span className="text-base font-semibold">YD {course.price}</span>
          </div>
        </div>

        <CourseButton course={course} />
      </div>
    </article>
  );
};

export default CourseItem;
