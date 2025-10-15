import { CourseCard } from "@web3-university/ui";
import CourseButton from "./CourseButton";

interface CourseItemProps {
  course: any;
  onBuy?: (course: any) => void;
}

const CourseItem: React.FC<CourseItemProps> = (props) => {
  const { course, onBuy } = props;

  return (
    <CourseCard course={course}>
      <CourseButton course={course} />
    </CourseCard>
  );
};

export default CourseItem;
