import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design Tokens/Colors",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ColorSwatch = ({
  name,
  className,
  description,
}: {
  name: string;
  className: string;
  description?: string;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border">
    <div className={`w-12 h-12 rounded-lg border ${className}`}></div>
    <div>
      <div className="font-medium text-sm">{name}</div>
      <div className="text-xs text-muted font-mono">{className}</div>
      {description && (
        <div className="text-xs text-muted mt-1">{description}</div>
      )}
    </div>
  </div>
);

export const ColorPalette: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Sistema de Cores</h2>
        <p className="text-muted mb-6">
          Tokens de cores do design system que se adaptam automaticamente aos
          temas claro e escuro.
        </p>
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-4">Cores Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ColorSwatch
            name="Primary"
            className="bg-primary"
            description="Cor principal do tema, usada para botões e destaques"
          />
          <ColorSwatch
            name="Background"
            className="bg-background border-2"
            description="Cor de fundo principal da aplicação"
          />
          <ColorSwatch
            name="Surface"
            className="bg-surface"
            description="Cor de fundo para componentes como cards e modais"
          />
          <ColorSwatch
            name="Foreground"
            className="bg-foreground"
            description="Cor de fundo para inputs e elementos interativos"
          />
          <ColorSwatch
            name="Muted"
            className="bg-muted"
            description="Cor para textos secundários e elementos sutis"
          />
          <ColorSwatch
            name="Border"
            className="bg-border"
            description="Cor padrão para bordas e divisores"
          />
          <ColorSwatch
            name="Accent"
            className="bg-accent"
            description="Cor de destaque para elementos especiais"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Exemplo de Uso</h3>
        <div className="bg-surface p-6 rounded-lg border space-y-4">
          <h4 className="text-primary text-lg font-medium">Card de Exemplo</h4>
          <p className="text-font">
            Este é um exemplo de como as cores funcionam em conjunto. O fundo
            usa{" "}
            <code className="bg-muted px-1 rounded text-xs">bg-surface</code>, o
            título usa{" "}
            <code className="bg-muted px-1 rounded text-xs">text-primary</code>,
            e este texto usa{" "}
            <code className="bg-muted px-1 rounded text-xs">text-font</code>.
          </p>
          <div className="border-t border-border pt-4">
            <button className="bg-primary text-white px-4 py-2 rounded-lg mr-2">
              Botão Principal
            </button>
            <button className="bg-foreground text-primary border border-primary px-4 py-2 rounded-lg">
              Botão Secundário
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Classes CSS Disponíveis</h3>
        <div className="bg-surface p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
            <div>
              <h4 className="font-bold mb-2">Background:</h4>
              <ul className="space-y-1 text-muted">
                <li>bg-primary</li>
                <li>bg-background</li>
                <li>bg-surface</li>
                <li>bg-foreground</li>
                <li>bg-muted</li>
                <li>bg-border</li>
                <li>bg-accent</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Text:</h4>
              <ul className="space-y-1 text-muted">
                <li>text-primary</li>
                <li>text-font</li>
                <li>text-muted</li>
              </ul>
              <h4 className="font-bold mb-2 mt-4">Border:</h4>
              <ul className="space-y-1 text-muted">
                <li>border-primary</li>
                <li>border-border</li>
                <li>border-accent</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};
