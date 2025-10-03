import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { ButtonCva } from "@web3-university/ui";

const meta = {
  title: "UI/ButtonCva",
  component: ButtonCva,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ButtonCva>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test click functionality
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();

    // Test hover state
    await userEvent.hover(button);
    await expect(button).toHaveStyle({ backgroundColor: "#1d4ed8" });

    await userEvent.unhover(button);
    await expect(button).toHaveStyle({ backgroundColor: "#2563eb" });
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "secondary",
    size: "sm",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "secondary",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Button",
    variant: "danger",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium Button",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test disabled state
    await expect(button).toBeDisabled();
    await expect(button).toHaveStyle({
      opacity: "0.5",
      cursor: "not-allowed",
    });

    // onClick should not be called when disabled
    // (user-event can't click disabled buttons with pointer-events: none)
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <ButtonCva variant="primary">Primary</ButtonCva>
        <ButtonCva variant="secondary">Secondary</ButtonCva>
        <ButtonCva variant="outline">Outline</ButtonCva>
        <ButtonCva variant="ghost">Ghost</ButtonCva>
        <ButtonCva variant="danger">Danger</ButtonCva>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <ButtonCva size="sm">Small</ButtonCva>
        <ButtonCva size="md">Medium</ButtonCva>
        <ButtonCva size="lg">Large</ButtonCva>
      </div>
    </div>
  ),
};
