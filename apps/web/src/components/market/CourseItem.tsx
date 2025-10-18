import { CourseCard } from "@web3-university/ui";
import CourseButton from "./CourseButton";
import { useEffect } from "react";

interface CourseItemProps<> {
  course: any;
  onPurchase?: (course: any) => void;
  isPurchasing?: boolean;
}
const CourseItem: React.FC<CourseItemProps> = (props) => {
  const { course, onPurchase, isPurchasing } = props;
  useEffect(() => {
    console.log("isPurchasing-itemzhong", isPurchasing, course.id);
  }, [isPurchasing]);
  return (
    <CourseCard course={course}>
      <CourseButton
        onPurchase={() => onPurchase?.(course)}
        isPurchasing={isPurchasing}
      />
    </CourseCard>
  );
};

export default CourseItem;
