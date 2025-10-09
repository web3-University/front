import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CourseCard, type CourseCardProps } from "../CourseCard/CourseCard";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Star: ({ className, ...props }: any) => (
    <svg data-testid="star-icon" className={className} {...props} />
  ),
  Wallet: ({ className, ...props }: any) => (
    <svg data-testid="wallet-icon" className={className} {...props} />
  ),
}));

describe("CourseCard", () => {
  const mockCourse: CourseCardProps["course"] = {
    id: "course-1",
    title: "React 基础教程",
    category: "前端开发",
    instructor: "张老师",
    rating: 4.8,
    students: 1250,
    price: 299,
    coverColor: "from-blue-400 to-blue-600",
  };

  const defaultProps: CourseCardProps = {
    course: mockCourse,
  };

  describe("Rendering", () => {
    it("renders course information correctly", () => {
      render(<CourseCard {...defaultProps} />);

      expect(screen.getByText("React 基础教程")).toBeTruthy();
      expect(screen.getByText("前端开发")).toBeTruthy();
      expect(screen.getByText("讲师：张老师")).toBeTruthy();
      expect(screen.getByText("4.8")).toBeTruthy();
      expect(screen.getByText("(1250人)")).toBeTruthy();
      expect(screen.getByText("YD 299")).toBeTruthy();
    });

    it("renders with correct HTML structure", () => {
      render(<CourseCard {...defaultProps} />);

      const article = screen.getByRole("article");
      expect(article).toBeTruthy();
      expect(article.className).toContain("group");
      expect(article.className).toContain("relative");
      expect(article.className).toContain("flex");
      expect(article.className).toContain("h-full");
    });
  });

  describe("Visual elements", () => {
    it("renders star and wallet icons", () => {
      const { container } = render(<CourseCard {...defaultProps} />);

      // 检查是否有 SVG 元素（lucide-react 图标会渲染为 SVG）
      const svgElements = container.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);
    });

    it("applies custom cover color", () => {
      render(<CourseCard {...defaultProps} />);

      const coverDiv = screen.getByText("前端开发").parentElement;
      expect(coverDiv?.className).toContain("from-blue-400");
      expect(coverDiv?.className).toContain("to-blue-600");
    });
  });

  describe("Props handling", () => {
    it("handles missing course prop gracefully", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<CourseCard course={null as any} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        "CourseCard: course prop is required",
      );
      expect(screen.queryByRole("article")).toBeFalsy();

      consoleSpy.mockRestore();
    });

    it("handles missing course properties with fallbacks", () => {
      const incompleteCourse = {
        id: "course-2",
        title: "",
        category: "",
        instructor: "",
        rating: 0,
        students: 0,
        price: 0,
        coverColor: "",
      };

      render(<CourseCard course={incompleteCourse} />);

      expect(screen.getByText("未命名课程")).toBeTruthy();
      expect(screen.getByText("未分类")).toBeTruthy();
      expect(screen.getByText("讲师：未知")).toBeTruthy();
      expect(screen.getByText("0.0")).toBeTruthy();
      expect(screen.getByText("(0人)")).toBeTruthy();
      expect(screen.getByText("YD 0")).toBeTruthy();
    });

    it("applies default cover color when not provided", () => {
      const courseWithoutColor = { ...mockCourse, coverColor: "" };
      render(<CourseCard course={courseWithoutColor} />);

      const coverDiv = screen.getByText("前端开发").parentElement;
      expect(coverDiv?.className).toContain("from-gray-400");
      expect(coverDiv?.className).toContain("to-gray-600");
    });

    it("renders children in actions slot", () => {
      render(
        <CourseCard {...defaultProps}>
          <button>购买课程</button>
        </CourseCard>,
      );

      const actionButton = screen.getByText("购买课程");
      expect(actionButton).toBeTruthy();
      expect(actionButton.parentElement?.getAttribute("data-slot")).toBe(
        "actions",
      );
    });

    it("does not render actions slot when no children provided", () => {
      render(<CourseCard {...defaultProps} />);

      expect(screen.queryByTestId("actions")).toBeFalsy();
    });
  });

  describe("Click behavior", () => {
    it("calls onDetail when card is clicked and clickable is true", async () => {
      const user = userEvent.setup();
      const mockOnDetail = jest.fn();

      render(<CourseCard {...defaultProps} onDetail={mockOnDetail} />);

      const article = screen.getByRole("article");
      await user.click(article);

      expect(mockOnDetail).toHaveBeenCalledWith(mockCourse);
      expect(mockOnDetail).toHaveBeenCalledTimes(1);
    });

    it("does not call onDetail when clickable is false", async () => {
      const user = userEvent.setup();
      const mockOnDetail = jest.fn();

      render(
        <CourseCard
          {...defaultProps}
          onDetail={mockOnDetail}
          clickable={false}
        />,
      );

      const article = screen.getByRole("article");
      await user.click(article);

      expect(mockOnDetail).not.toHaveBeenCalled();
    });

    it("does not call onDetail when onDetail is not provided", async () => {
      const user = userEvent.setup();

      render(<CourseCard {...defaultProps} />);

      const article = screen.getByRole("article");
      // Should not throw error
      await user.click(article);
      expect(true).toBe(true); // Test passes if no error is thrown
    });

    it("does not call onDetail when clicking on actions area", async () => {
      const user = userEvent.setup();
      const mockOnDetail = jest.fn();

      render(
        <CourseCard {...defaultProps} onDetail={mockOnDetail}>
          <button>购买课程</button>
        </CourseCard>,
      );

      const actionButton = screen.getByText("购买课程");
      await user.click(actionButton);

      expect(mockOnDetail).not.toHaveBeenCalled();
    });

    it("applies cursor-pointer class when clickable is true", () => {
      render(<CourseCard {...defaultProps} clickable={true} />);

      const article = screen.getByRole("article");
      expect(article.className).toContain("cursor-pointer");
    });

    it("does not apply cursor-pointer class when clickable is false", () => {
      render(<CourseCard {...defaultProps} clickable={false} />);

      const article = screen.getByRole("article");
      expect(article.className).not.toContain("cursor-pointer");
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      render(<CourseCard {...defaultProps} />);

      const article = screen.getByRole("article");
      expect(article).toBeTruthy();

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading.textContent).toBe("React 基础教程");
    });

    it("renders with course id in component", () => {
      render(<CourseCard {...defaultProps} />);

      const article = screen.getByRole("article");
      // key 属性在 DOM 中不可访问，但我们可以验证组件正确渲染
      expect(article).toBeTruthy();
    });
  });

  describe("Visual styling", () => {
    it("applies correct CSS classes for layout", () => {
      render(<CourseCard {...defaultProps} />);

      const article = screen.getByRole("article");
      expect(article.className).toContain("group");
      expect(article.className).toContain("relative");
      expect(article.className).toContain("flex");
      expect(article.className).toContain("h-full");
      expect(article.className).toContain("flex-col");
      expect(article.className).toContain("overflow-hidden");
      expect(article.className).toContain("rounded-3xl");
    });

    it("applies hover transform classes", () => {
      render(<CourseCard {...defaultProps} />);

      const article = screen.getByRole("article");
      expect(article.className).toContain("hover:-translate-y-2");
    });

    it("applies gradient background classes", () => {
      render(<CourseCard {...defaultProps} />);

      const article = screen.getByRole("article");
      expect(article.className).toContain("bg-gradient-to-b");
      expect(article.className).toContain("from-white");
      expect(article.className).toContain("to-[#F7F5FF]");
    });
  });

  describe("Rating display", () => {
    it("formats rating to one decimal place", () => {
      const courseWithPreciseRating = { ...mockCourse, rating: 4.567 };
      render(<CourseCard course={courseWithPreciseRating} />);

      expect(screen.getByText("4.6")).toBeTruthy();
    });

    it("handles zero rating", () => {
      const courseWithZeroRating = { ...mockCourse, rating: 0 };
      render(<CourseCard course={courseWithZeroRating} />);

      expect(screen.getByText("0.0")).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("handles very long course title", () => {
      const courseWithLongTitle = {
        ...mockCourse,
        title:
          "这是一个非常非常非常长的课程标题，用来测试组件如何处理长文本内容的显示效果",
      };

      render(<CourseCard course={courseWithLongTitle} />);

      expect(screen.getByText(courseWithLongTitle.title)).toBeTruthy();
    });

    it("handles large student numbers", () => {
      const courseWithManyStudents = { ...mockCourse, students: 999999 };
      render(<CourseCard course={courseWithManyStudents} />);

      expect(screen.getByText("(999999人)")).toBeTruthy();
    });

    it("handles high price values", () => {
      const expensiveCourse = { ...mockCourse, price: 9999 };
      render(<CourseCard course={expensiveCourse} />);

      expect(screen.getByText("YD 9999")).toBeTruthy();
    });
  });
});
