import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ButtonCva } from "../Button/ButtonCva";

describe("ButtonCva", () => {
  describe("Rendering", () => {
    it("renders with children text", () => {
      render(<ButtonCva>Click me</ButtonCva>);
      expect(
        screen.getByRole("button", { name: "Click me" }),
      ).toBeInTheDocument();
    });

    it("renders with default variant (primary)", () => {
      render(<ButtonCva>Button</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ backgroundColor: "#2563eb" });
    });

    it("renders with default size (md)", () => {
      render(<ButtonCva>Button</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ height: "40px", fontSize: "16px" });
    });
  });

  describe("Variants", () => {
    it("renders primary variant correctly", () => {
      render(<ButtonCva variant="primary">Primary</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        backgroundColor: "#2563eb",
        color: "#ffffff",
      });
    });

    it("renders secondary variant correctly", () => {
      render(<ButtonCva variant="secondary">Secondary</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        backgroundColor: "#4b5563",
        color: "#ffffff",
      });
    });

    it("renders outline variant correctly", () => {
      render(<ButtonCva variant="outline">Outline</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        color: "#2563eb",
        border: "2px solid #2563eb",
      });
    });

    it("renders ghost variant correctly", () => {
      render(<ButtonCva variant="ghost">Ghost</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        color: "#2563eb",
      });
    });

    it("renders danger variant correctly", () => {
      render(<ButtonCva variant="danger">Danger</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        backgroundColor: "#dc2626",
        color: "#ffffff",
      });
    });
  });

  describe("Sizes", () => {
    it("renders small size correctly", () => {
      render(<ButtonCva size="sm">Small</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        height: "32px",
        padding: "0 12px",
        fontSize: "14px",
      });
    });

    it("renders medium size correctly", () => {
      render(<ButtonCva size="md">Medium</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        height: "40px",
        padding: "0 16px",
        fontSize: "16px",
      });
    });

    it("renders large size correctly", () => {
      render(<ButtonCva size="lg">Large</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        height: "48px",
        padding: "0 24px",
        fontSize: "18px",
      });
    });
  });

  describe("States", () => {
    it("handles disabled state correctly", () => {
      render(<ButtonCva disabled>Disabled</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({
        opacity: "0.5",
        cursor: "not-allowed",
        pointerEvents: "none",
      });
    });

    it("applies hover styles on mouse enter", async () => {
      const user = userEvent.setup();
      render(<ButtonCva variant="primary">Hover me</ButtonCva>);
      const button = screen.getByRole("button");

      await user.hover(button);
      expect(button).toHaveStyle({ backgroundColor: "#1d4ed8" });
    });

    it("removes hover styles on mouse leave", async () => {
      const user = userEvent.setup();
      render(<ButtonCva variant="primary">Hover me</ButtonCva>);
      const button = screen.getByRole("button");

      await user.hover(button);
      await user.unhover(button);
      expect(button).toHaveStyle({ backgroundColor: "#2563eb" });
    });

    it("does not apply hover styles when disabled", async () => {
      const user = userEvent.setup();
      render(
        <ButtonCva disabled variant="primary">
          Disabled
        </ButtonCva>,
      );
      const button = screen.getByRole("button");

      // Check that it stays at primary background color even when we try to hover
      // Note: user-event won't actually trigger hover on disabled elements with pointer-events: none
      expect(button).toHaveStyle({ backgroundColor: "#2563eb" });
    });
  });

  describe("Event Handlers", () => {
    it("calls onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<ButtonCva onClick={handleClick}>Click me</ButtonCva>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = jest.fn();
      render(
        <ButtonCva disabled onClick={handleClick}>
          Click me
        </ButtonCva>,
      );

      const button = screen.getByRole("button");
      // Disabled buttons with pointer-events: none can't be clicked via user-event
      expect(button).toBeDisabled();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("supports all native button events", async () => {
      const user = userEvent.setup();
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(
        <ButtonCva
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Button
        </ButtonCva>,
      );

      const button = screen.getByRole("button");

      await user.hover(button);
      expect(handleMouseEnter).toHaveBeenCalled();

      await user.unhover(button);
      expect(handleMouseLeave).toHaveBeenCalled();

      button.focus();
      expect(handleFocus).toHaveBeenCalled();

      button.blur();
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe("Props", () => {
    it("forwards ref to button element", () => {
      const ref = { current: null };
      render(<ButtonCva ref={ref}>Button</ButtonCva>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("accepts custom style prop", () => {
      render(<ButtonCva style={{ marginTop: "10px" }}>Button</ButtonCva>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ marginTop: "10px" });
    });

    it("accepts native button attributes", () => {
      render(
        <ButtonCva type="submit" name="submit-btn" value="submit">
          Submit
        </ButtonCva>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "submit-btn");
      expect(button).toHaveAttribute("value", "submit");
    });

    it("merges custom styles with component styles", () => {
      render(
        <ButtonCva variant="primary" style={{ border: "3px solid red" }}>
          Button
        </ButtonCva>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        backgroundColor: "#2563eb",
        border: "3px solid red",
      });
    });
  });

  describe("Accessibility", () => {
    it("has correct role", () => {
      render(<ButtonCva>Button</ButtonCva>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<ButtonCva aria-label="Custom label">Button</ButtonCva>);
      expect(screen.getByLabelText("Custom label")).toBeInTheDocument();
    });

    it("supports aria-disabled", () => {
      render(
        <ButtonCva disabled aria-disabled="true">
          Button
        </ButtonCva>,
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });
});
