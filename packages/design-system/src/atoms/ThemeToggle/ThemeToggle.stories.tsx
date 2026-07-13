import type { Meta, StoryObj } from "@storybook/react";
import { useTheme } from "../../hooks/useTheme";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "Atoms/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ThemeTogglePreview = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <div className="text-center">
      <ThemeToggle className={className} />
      <p className="mt-4 text-sm text-muted">
        Tema atual: <span className="font-semibold">{theme}</span>
      </p>
      <p className="mt-1 text-xs text-muted">
        Clique no ícone para alternar entre temas
      </p>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ThemeTogglePreview {...args} />,
  args: {},
};

export const WithCustomClass: Story = {
  render: (args) => <ThemeTogglePreview {...args} />,
  args: {
    className: "rounded-lg border border-primary p-2",
  },
};

export const MultipleToggles: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <ThemeToggle />
        <p className="mt-2 text-xs text-muted">Padrão</p>
      </div>
      <div className="text-center">
        <ThemeToggle className="rounded-lg border border-accent p-2" />
        <p className="mt-2 text-xs text-muted">Com borda</p>
      </div>
      <div className="text-center">
        <ThemeToggle className="shadow-lg" />
        <p className="mt-2 text-xs text-muted">Com sombra</p>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="max-w-md rounded-lg border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Configurações</h3>
        <ThemeToggle />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span>Notificações</span>
          <div className="h-6 w-12 rounded-full bg-primary" />
        </div>
        <div className="flex items-center justify-between py-2">
          <span>Modo escuro</span>
          <ThemeToggle className="scale-75" />
        </div>
        <div className="flex items-center justify-between py-2">
          <span>Privacidade</span>
          <div className="h-6 w-12 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  ),
};
