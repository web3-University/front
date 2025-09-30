import type { Meta, StoryObj } from "@storybook/react";
import { ButtonCva } from "@web3-university/ui";

const meta = {
  title: "UI/ButtonCva",
  component: ButtonCva,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonCva>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
