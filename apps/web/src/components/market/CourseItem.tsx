import { CourseCard } from "@web3-university/ui";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseButton from "./CourseButton";

interface CourseItemProps<> {
  course: any;
  onPurchase?: (course: any) => void;
  isPurchasing?: boolean;
}
const CourseItem: React.FC<CourseItemProps> = (props) => {
  const { course, onPurchase, isPurchasing } = props;
  const router = useRouter();

  useEffect(() => {
    console.log("isPurchasing-itemzhong", isPurchasing, course.id);
  }, [isPurchasing]);

  const handleCourseDetail = (course: any) => {
    router.push(`/course/${course.id}`);
  };

  return (
    <CourseCard course={course} onDetail={handleCourseDetail}>
      <CourseButton
        onPurchase={() => onPurchase?.(course)}
        isPurchasing={isPurchasing}
      />
    </CourseCard>
  );
};

export default CourseItem;
