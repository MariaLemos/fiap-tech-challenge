import type { Meta, StoryObj } from "@storybook/react";
import dayjs from "dayjs";
import { List, type ListItemType } from "./List";

const transactions: ListItemType[] = [
  {
    id: "transaction-1",
    type: "deposit",
    description: "Salário",
    category: "Receitas",
    amount: 8500,
    date: dayjs("2026-07-10T09:30:00"),
  },
  {
    id: "transaction-2",
    type: "transfer",
    description: "Aluguel",
    category: "Moradia",
    amount: -2400,
    date: dayjs("2026-07-05T14:00:00"),
  },
  {
    id: "transaction-3",
    type: "contribution",
    description: "Tesouro Direto",
    category: "Investimentos",
    amount: 1000,
    date: dayjs("2026-06-20T11:15:00"),
  },
];

const meta = {
  title: "Molecules/List",
  component: List,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithItems: Story = {
  args: {
    data: transactions,
    className: "w-[36rem] max-w-full",
    onEditItem: () => undefined,
    onDeleteItem: () => undefined,
  },
};

export const Empty: Story = {
  args: { data: [] },
};
