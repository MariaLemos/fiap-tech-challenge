import type { Meta, StoryObj } from "@storybook/react";
import { SensitiveDataBox } from "./SensitiveDataBox";

const meta = {
  title: "Molecules/SensitiveDataBox",
  component: SensitiveDataBox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    title: "Saldo disponível",
    children: (
      <p className="text-2xl font-semibold" aria-label="Saldo de 12.450 reais">
        R$ 12.450,00
      </p>
    ),
    className: "min-w-72 bg-primary text-white",
  },
} satisfies Meta<typeof SensitiveDataBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HiddenByDefault: Story = {};
