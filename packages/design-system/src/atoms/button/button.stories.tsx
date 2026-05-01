import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary", "icon"],
    },
    children: {
      control: { type: "text" },
    },
    className: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Botão Primário",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Botão Secundário",
    variant: "secondary",
  },
};

export const Icon: Story = {
  args: {
    children: "⭐",
    variant: "icon",
  },
};

export const Disabled: Story = {
  args: {
    children: "Botão Desabilitado",
    variant: "primary",
    disabled: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    children: "Botão Customizado",
    variant: "primary",
    className: "shadow-lg hover:shadow-xl",
  },
};
