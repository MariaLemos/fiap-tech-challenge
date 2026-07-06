import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { ChangeEvent, useState } from "react";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "password", "email", "number"],
    },
    mask: {
      control: { type: "select" },
      options: [undefined, "money"],
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper para demonstrar o input com estado
const InputWrapper = ({
  type = "text",
  mask,
  className,
  placeholder,
}: {
  type?: "text" | "password" | "email" | "number" | "date";
  mask?: string;
  className?: string;
  placeholder?: string;
}) => {
  const [value, setValue] = useState("");

  const mockField = {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    onBlur: () => {},
    name: "demo-input",
    ref: () => {},
  };

  return (
    <div className="w-64">
      <Input type={type} mask={mask} className={className} field={mockField} />
      {placeholder && <p className="text-sm text-muted mt-1">{placeholder}</p>}
    </div>
  );
};

export const Text: Story = {
  render: (args) => <InputWrapper {...args} placeholder="Digite algum texto" />,
  args: {
    type: "text",
  },
};

export const Password: Story = {
  render: (args) => <InputWrapper {...args} placeholder="Digite sua senha" />,
  args: {
    type: "password",
  },
};

export const Email: Story = {
  render: (args) => <InputWrapper {...args} placeholder="Digite seu email" />,
  args: {
    type: "email",
  },
};

export const Number: Story = {
  render: (args) => <InputWrapper {...args} placeholder="Digite um número" />,
  args: {
    type: "number",
  },
};

export const MoneyMask: Story = {
  render: (args) => (
    <InputWrapper {...args} placeholder="Digite um valor monetário" />
  ),
  args: {
    type: "text",
    mask: "money",
  },
};

export const WithCustomClass: Story = {
  render: (args) => (
    <InputWrapper {...args} placeholder="Input com classe customizada" />
  ),
  args: {
    type: "text",
    className: "border-primary shadow-lg",
  },
};

// Demonstração de vários inputs
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <div>
        <label className="block text-sm font-medium mb-1">Texto:</label>
        <InputWrapper type="text" placeholder="Campo de texto" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email:</label>
        <InputWrapper type="email" placeholder="Campo de email" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Senha:</label>
        <InputWrapper type="password" placeholder="Campo de senha" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Número:</label>
        <InputWrapper type="number" placeholder="Campo numérico" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Valor monetário:
        </label>
        <InputWrapper type="text" mask="money" placeholder="Campo monetário" />
      </div>
    </div>
  ),
};
