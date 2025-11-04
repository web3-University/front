import { CourseCard } from "@web3-university/ui";
import { useRouter } from "@/navigation";
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
    isPurchased?: boolean; // 新增：是否已购买
    cover?: string; // 新增：课程封面
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
  const router = useRouter();
  const handleCourseDetail = (course: any) => {
    router.push(`/course/${course.id}`);
  };
  return (
    <CourseCard course={course} onDetail={handleCourseDetail}>
      {course.isPurchased ? (
        <div className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
          ✅ 已购买
        </div>
      ) : (
        <CourseButton
          courseId={course.id}
          coursePrice={course.price}
          courseTitle={course.title}
          onPurchaseSuccess={onPurchaseSuccess}
          onPurchaseError={onPurchaseError}
        />
      )}
    </CourseCard>
  );
};

export default CourseItem;
