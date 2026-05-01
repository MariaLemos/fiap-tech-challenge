import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Atoms/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong"],
    },
    children: {
      control: { type: "text" },
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    children: "Este é um H1",
    variant: "h1",
  },
};

export const Heading2: Story = {
  args: {
    children: "Este é um H2",
    variant: "h2",
  },
};

export const Heading3: Story = {
  args: {
    children: "Este é um H3",
    variant: "h3",
  },
};

export const Heading4: Story = {
  args: {
    children: "Este é um H4",
    variant: "h4",
  },
};

export const Heading5: Story = {
  args: {
    children: "Este é um H5",
    variant: "h5",
  },
};

export const Heading6: Story = {
  args: {
    children: "Este é um H6",
    variant: "h6",
  },
};

export const Paragraph: Story = {
  args: {
    children:
      "Este é um parágrafo normal com texto corrido que pode se estender por várias linhas.",
    variant: "p",
  },
};

export const Strong: Story = {
  args: {
    children: "Texto em negrito",
    variant: "strong",
  },
};

export const Span: Story = {
  args: {
    children: "Texto inline span",
    variant: "span",
  },
};

export const WithCustomClass: Story = {
  args: {
    children: "Texto customizado",
    variant: "p",
    className: "text-primary italic",
  },
};

// Story demonstrando todos os variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
      <Typography variant="p">
        Este é um parágrafo normal que demonstra como o texto é renderizado.
      </Typography>
      <Typography variant="strong">Texto em negrito</Typography>
      <Typography variant="span">Texto span inline</Typography>
    </div>
  ),
};
