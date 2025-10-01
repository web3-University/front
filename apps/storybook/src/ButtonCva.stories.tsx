import type { Meta, StoryObj } from "@storybook/react";
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
} satisfies Meta<typeof ButtonCva>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
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
