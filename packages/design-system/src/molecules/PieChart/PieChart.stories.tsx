import type { Meta, StoryObj } from "@storybook/react";
import { PieChartComponent } from "./PieChart";

const meta = {
  title: "Molecules/PieChart",
  component: PieChartComponent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    data: [
      { name: "Renda fixa", value: 12500 },
      { name: "Fundos", value: 7300 },
      { name: "Ações", value: 5200 },
    ],
    isAnimationActive: false,
  },
} satisfies Meta<typeof PieChartComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PortfolioAllocation: Story = {};
