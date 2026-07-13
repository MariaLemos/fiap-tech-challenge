import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./atoms/button/button";

const Introduction = () => (
  <main className="mx-auto max-w-4xl p-8">
    <h1 className="mb-6 text-4xl font-bold text-primary">
      Design System — Tech Challenge FIAP
    </h1>

    <p className="mb-6 text-lg">
      Este design system integra o Tech Challenge da Fase 2 e reúne os
      componentes reutilizáveis das aplicações financeiras do monorepo.
    </p>

    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold">Cobertura no Storybook</h2>
      <p className="mb-4">
        Os 17 componentes públicos possuem stories dedicadas: 5 atoms, 11
        molecules e 1 organism. Os tokens de cores também têm uma documentação
        visual própria.
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Atoms:</strong> Button, Input, Select, ThemeToggle e
          Typography.
        </li>
        <li>
          <strong>Molecules:</strong> UserMenu, SectionBox, SensitiveDataBox,
          List, Navigation, LanguageSelector, InputWrapper, DialogModal,
          SimpleBarChart, PieChart e ProgressBar.
        </li>
        <li>
          <strong>Organism:</strong> Header.
        </li>
        <li>
          <strong>Tokens:</strong> paleta de cores dos temas claro e escuro.
        </li>
      </ul>
    </section>

    <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <article className="rounded-lg border p-4">
        <h2 className="mb-2 text-xl font-semibold">Temas e responsividade</h2>
        <p className="mb-4 text-sm">
          Todas as stories usam o ThemeProvider e podem ser avaliadas nos
          viewports mobile, tablet e desktop configurados no preview.
        </p>
        <div className="flex gap-2">
          <Button variant="primary">Primário</Button>
          <Button variant="secondary">Secundário</Button>
        </div>
      </article>

      <article className="rounded-lg border p-4">
        <h2 className="mb-2 text-xl font-semibold">Documentação interativa</h2>
        <p className="text-sm">
          Use a navegação lateral para consultar props, variantes e exemplos de
          uso isolados. Componentes com contexto recebem providers globais de
          tema e internacionalização.
        </p>
      </article>
    </section>

    <section className="rounded-lg border border-primary/30 bg-primary/10 p-4">
      <h2 className="mb-2 text-xl font-semibold text-primary">Tecnologias</h2>
      <p>React, TypeScript, Tailwind CSS, Storybook e Vite.</p>
    </section>
  </main>
);

const meta = {
  title: "Introdução/Fase 2",
  component: Introduction,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Introduction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
