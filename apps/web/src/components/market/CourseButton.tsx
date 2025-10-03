"use client";

import { Button } from "../ui/button";

const CourseButton = ({ course }: { course: any }) => {
  return (
    <Button variant="primary" fullWidth className="mt-auto" onClick={() => {}}>
      立即购买
    </Button>
  );
};

export default CourseButton;
