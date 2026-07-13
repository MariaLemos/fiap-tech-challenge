import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { InputWrapper } from "./InputWrapper";

type FormValues = {
  email: string;
  category: string;
};

const FormExample = ({ type }: { type: "text" | "select" }) => {
  const methods = useForm<FormValues>({
    defaultValues: { email: "maria@example.com", category: "investment" },
  });

  return (
    <FormProvider {...methods}>
      <form className="w-80" onSubmit={methods.handleSubmit(() => undefined)}>
        {type === "select" ? (
          <InputWrapper
            name="category"
            label="Categoria"
            type="select"
            options={[
              { label: "Receita", value: "income" },
              { label: "Despesa", value: "expense" },
              { label: "Investimento", value: "investment" },
            ]}
          />
        ) : (
          <InputWrapper
            name="email"
            label="E-mail"
            type="email"
            required
            rules={{ required: "Informe o e-mail" }}
          />
        )}
      </form>
    </FormProvider>
  );
};

const meta: Meta = {
  title: "Molecules/InputWrapper",
  component: InputWrapper,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const TextInput: Story = {
  args: { name: "email", label: "E-mail", type: "email" },
  render: () => <FormExample type="text" />,
};

export const SelectInput: Story = {
  args: { name: "category", label: "Categoria", type: "select" },
  render: () => <FormExample type="select" />,
};
