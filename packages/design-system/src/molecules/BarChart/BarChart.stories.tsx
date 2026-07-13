import type { Meta, StoryObj } from "@storybook/react";
import { SimpleBarChart } from "./BarChart";

const meta = {
  title: "Molecules/SimpleBarChart",
  component: SimpleBarChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    data: { expenses: 4200, receipts: 7800 },
    labels: { expenses: "Despesas", receipts: "Receitas" },
  },
} satisfies Meta<typeof SimpleBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthlySummary: Story = {};
