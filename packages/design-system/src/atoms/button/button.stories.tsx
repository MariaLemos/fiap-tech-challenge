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
    loading: {
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

export const PrimaryDisabled: Story = {
  args: {
    children: "Botão Primário Disabled",
    variant: "primary",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Confirmar",
    variant: "primary",
    loading: true,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    children: "Botão Secundário Disabled",
    variant: "secondary",
    disabled: true,
  },
};

export const IconDisabled: Story = {
  args: {
    children: "⭐",
    variant: "icon",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Estados Normais</h3>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="icon">⭐</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Estados Disabled</h3>
        <div className="flex gap-4">
          <Button variant="primary" disabled>
            Primary Disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary Disabled
          </Button>
          <Button variant="icon" disabled>
            ⭐
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Tamanhos Customizados</h3>
        <div className="flex gap-4 items-end">
          <Button variant="primary" className="text-sm px-3 py-1">
            Pequeno
          </Button>
          <Button variant="primary">Normal</Button>
          <Button variant="primary" className="text-lg px-6 py-3">
            Grande
          </Button>
        </div>
      </div>
    </div>
  ),
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
