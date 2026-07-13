import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "Molecules/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    value: 68,
    label: "Meta de investimentos",
    className: "w-80",
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Completed: Story = {
  args: { value: 100 },
};

export const AboveTarget: Story = {
  args: { value: 125 },
};
