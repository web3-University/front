import { CourseCard } from "@web3-university/ui";
import CourseButton from "./CourseButton";

interface CourseItemProps {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    instructor: string;
    rating: number;
    students: number;
    price: number;
    coverColor: string;
    duration?: number;
    difficulty?: string;
    [key: string]: any;
  };
  onPurchaseSuccess?: (transactionHash: string) => void;
  onPurchaseError?: (error: string) => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
  course,
  onPurchaseSuccess,
  onPurchaseError,
}) => {
  return (
    <CourseCard course={course}>
      <CourseButton
        courseId={course.id}
        coursePrice={course.price}
        courseTitle={course.title}
        onPurchaseSuccess={onPurchaseSuccess}
        onPurchaseError={onPurchaseError}
      />
    </CourseCard>
  );
};

export default CourseItem;
