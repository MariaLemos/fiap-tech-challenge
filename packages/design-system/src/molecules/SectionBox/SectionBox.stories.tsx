import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../atoms";
import { SectionBox } from "./SectionBox";

const meta = {
  title: "Molecules/SectionBox",
  component: SectionBox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    title: "Resumo financeiro",
    children: "Conteúdo reutilizável da seção.",
    className: "min-w-80",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["colored", "bg"],
    },
  },
} satisfies Meta<typeof SectionBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colored: Story = {
  args: { variant: "colored" },
};

export const WithBackground: Story = {
  args: { variant: "bg" },
};

export const WithHeaderAction: Story = {
  args: {
    headerAction: <Button variant="secondary">Ver detalhes</Button>,
  },
};
