import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./atoms/button/button";

const meta: Meta = {
  title: "Introdução/Tech Challenge",
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => (
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-primary">
            Design System - Tech Challenge FIAP
          </h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Este design system foi desenvolvido como parte do{" "}
              <strong>Tech Challenge da Fase 01</strong>
              do curso de Pós-graduação da FIAP. O sistema fornece uma
              biblioteca de componentes reutilizáveis para a aplicação de
              gerenciamento financeiro.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              Melhorias Implementadas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">🎨 Botões Aprimorados</h3>
                <ul className="text-sm space-y-1 mb-3">
                  <li>• Estados hover com feedback visual</li>
                  <li>• Estados disabled com background cinza</li>
                  <li>• Transições suaves e animações</li>
                  <li>• Foco acessível</li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="primary" className="text-xs">
                    Normal
                  </Button>
                  <Button variant="primary" disabled className="text-xs">
                    Disabled
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">
                  📜 Scrollbar Personalizada
                </h3>
                <ul className="text-sm space-y-1 mb-3">
                  <li>• Design minimalista e limpo</li>
                  <li>• Suporte a tema claro/escuro</li>
                  <li>• Compatível com todos os navegadores</li>
                  <li>• Bordas arredondadas</li>
                </ul>
                <div className="h-20 overflow-y-scroll border rounded p-2 text-xs">
                  <div className="h-40">
                    Conteúdo com scroll personalizado. Role para ver a scrollbar
                    customizada em ação. Esta é apenas uma demonstração do novo
                    design de scrollbar que foi implementado globalmente no
                    projeto.
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">
              Estrutura do Sistema
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Organização Atômica</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Atoms:</strong> Componentes básicos (Button, Input,
                  Select)
                </li>
                <li>
                  <strong>Molecules:</strong> Combinações simples (InputWrapper,
                  List)
                </li>
                <li>
                  <strong>Organisms:</strong> Componentes complexos (Header,
                  Navigation)
                </li>
                <li>
                  <strong>Tokens:</strong> Variáveis de design (cores,
                  tipografia, espaçamentos)
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Tecnologias</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {["React", "TypeScript", "Tailwind CSS", "Storybook", "Vite"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Como usar</h3>
              <p className="text-blue-700 text-sm">
                Navegue pelas seções à esquerda para explorar todos os
                componentes disponíveis. Cada componente inclui documentação,
                exemplos interativos e código para implementação.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {};
