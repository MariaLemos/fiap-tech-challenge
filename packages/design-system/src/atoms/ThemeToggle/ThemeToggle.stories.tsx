import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider, useTheme } from "../../hooks/useTheme";

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

// Wrapper para mostrar informações sobre o tema atual
const ThemeToggleWrapper = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <ThemeProvider>
      <div className="text-center">
        <ThemeToggle className={className} />
        <p className="mt-4 text-sm text-muted">
          Tema atual: <span className="font-semibold">{theme}</span>
        </p>
        <p className="text-xs text-muted mt-1">
          Clique no ícone para alternar entre temas
        </p>
      </div>
    </ThemeProvider>
  );
};

export const Default: Story = {
  render: (args) => <ThemeToggleWrapper {...args} />,
  args: {},
};

export const WithCustomClass: Story = {
  render: (args) => <ThemeToggleWrapper {...args} />,
  args: {
    className: "border border-primary p-2",
  },
};

// Demonstração com múltiplos toggles
export const MultipleToggles: Story = {
  render: () => (
    <ThemeProvider>
      <div className="flex gap-4 items-center">
        <div className="text-center">
          <ThemeToggle />
          <p className="text-xs text-muted mt-2">Padrão</p>
        </div>
        <div className="text-center">
          <ThemeToggle className="border border-accent p-2 rounded-lg" />
          <p className="text-xs text-muted mt-2">Com borda</p>
        </div>
        <div className="text-center">
          <ThemeToggle className="shadow-lg" />
          <p className="text-xs text-muted mt-2">Com sombra</p>
        </div>
      </div>
    </ThemeProvider>
  ),
};

// Demonstração em contexto de UI
export const InContext: Story = {
  render: () => (
    <ThemeProvider>
      <div className="bg-surface p-6 rounded-lg border max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Configurações</h3>
          <ThemeToggle />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span>Notificações</span>
            <div className="w-12 h-6 bg-primary rounded-full"></div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>Modo escuro</span>
            <ThemeToggle className="scale-75" />
          </div>
          <div className="flex justify-between items-center py-2">
            <span>Privacidade</span>
            <div className="w-12 h-6 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  ),
};
