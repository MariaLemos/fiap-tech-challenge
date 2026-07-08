import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { ChangeEvent, useState } from "react";

const meta: Meta<typeof Select> = {
  title: "Atoms/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: { type: "object" },
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper para demonstrar o select com estado
const SelectWrapper = ({
  options,
  className,
}: {
  options?: { label: string; value: string }[];
  className?: string;
}) => {
  const [value, setValue] = useState("");

  const mockField = {
    value,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => setValue(e.target.value),
    onBlur: () => {},
    name: "demo-select",
    ref: () => {},
  };

  return (
    <div className="w-64">
      <Select options={options} className={className} field={mockField} />
      {value && (
        <p className="text-sm text-muted mt-2">Valor selecionado: {value}</p>
      )}
    </div>
  );
};

const fruitsOptions = [
  { label: "Selecione uma fruta...", value: "" },
  { label: "Maçã", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Laranja", value: "orange" },
  { label: "Uva", value: "grape" },
  { label: "Morango", value: "strawberry" },
];

const countryOptions = [
  { label: "Selecione um país...", value: "" },
  { label: "Brasil", value: "br" },
  { label: "Argentina", value: "ar" },
  { label: "Estados Unidos", value: "us" },
  { label: "Canadá", value: "ca" },
  { label: "França", value: "fr" },
];

const categoryOptions = [
  { label: "Selecione uma categoria...", value: "" },
  { label: "Receita", value: "income" },
  { label: "Despesa", value: "expense" },
  { label: "Investimento", value: "investment" },
  { label: "Transferência", value: "transfer" },
];

export const Fruits: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: fruitsOptions,
  },
};

export const Countries: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
  },
};

export const Categories: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: categoryOptions,
  },
};

export const WithCustomClass: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: fruitsOptions,
    className: "border-primary shadow-lg",
  },
};

export const Empty: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: [{ label: "Nenhuma opção disponível", value: "" }],
  },
};

// Demonstração de múltiplos selects
export const MultipleSelects: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <div>
        <label className="block text-sm font-medium mb-1">Frutas:</label>
        <SelectWrapper options={fruitsOptions} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Países:</label>
        <SelectWrapper options={countryOptions} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Categorias:</label>
        <SelectWrapper options={categoryOptions} />
      </div>
    </div>
  ),
};
