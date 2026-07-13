import type { Meta, StoryObj } from "@storybook/react";
import { DialogModal } from "./DialogModal";

const meta = {
  title: "Molecules/DialogModal",
  component: DialogModal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    text: "Deseja excluir esta transação?",
    onCancel: () => undefined,
    onConfirm: () => undefined,
  },
} satisfies Meta<typeof DialogModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabels: Story = {
  args: {
    cancelLabel: "Manter",
    confirmLabel: "Excluir",
  },
};
