# Storybook do Design System

Este é o Storybook do design system do **FIAP Tech Challenge — Fase 2**. Ele documenta e permite avaliar isoladamente os componentes React compartilhados pelas aplicações do monorepo.

## Como executar

Na raiz do repositório:

```bash
yarn workspace @repo/design-system storybook
```

Ou dentro de `packages/design-system`:

```bash
yarn storybook
```

O servidor de desenvolvimento fica disponível em <http://localhost:6006>.

Para gerar o site estático na pasta `storybook-static`:

```bash
yarn workspace @repo/design-system build-storybook
```

## Cobertura

Os **17 componentes públicos** do pacote têm stories dedicadas. A documentação também inclui a paleta de cores usada pelos temas.

### Atoms — 5 componentes

- **Button**: variantes primary, secondary e icon, incluindo estados disabled e loading.
- **Input**: campos de texto, senha, e-mail, número e valor monetário.
- **Select**: seleção com opções configuráveis.
- **ThemeToggle**: alternância entre os temas claro e escuro.
- **Typography**: hierarquias tipográficas de `h1` a `h6`, parágrafo e textos inline.

### Molecules — 11 componentes

- **UserMenu**: identificação do usuário e opção de logout.
- **SectionBox**: container de conteúdo com título, ação e variantes visuais.
- **SensitiveDataBox**: exibição controlada de informações sensíveis.
- **List**: lista agrupada por mês, com estados preenchido e vazio.
- **Navigation**: navegação entre as áreas do monorepo.
- **LanguageSelector**: seleção do idioma da interface.
- **InputWrapper**: integração de campos com React Hook Form, label e validação.
- **DialogModal**: conteúdo de confirmação com ações de cancelar e confirmar.
- **SimpleBarChart**: comparação de receitas e despesas.
- **PieChart**: distribuição de valores por categoria.
- **ProgressBar**: acompanhamento percentual de uma meta.

### Organism — 1 componente

- **Header**: cabeçalho responsivo com menu do usuário e navegação mobile.

### Design tokens

- **Colors**: paleta adaptável aos temas claro e escuro.

## Temas, idiomas e viewports

O preview global carrega os estilos do pacote e envolve todas as stories com:

- `ThemeProvider`, para alternância entre temas claro e escuro;
- `I18nProvider` em `pt-BR`, para componentes que usam traduções;
- viewports customizados de mobile (`375x667`), tablet (`768x1024`) e desktop (`1024x768`).

As cores podem ser usadas com variáveis CSS:

```css
.card {
  background-color: var(--color-surface);
  color: var(--color-font);
  border: 1px solid var(--color-border);
}
```

Ou com as classes configuradas no Tailwind:

```tsx
<div className="border border-border bg-surface text-font">Conteúdo</div>
```

## Addons e configuração

Os addons instalados e declarados em `.storybook/main.ts` são:

- `@storybook/addon-links`: links entre stories e páginas;
- `@storybook/addon-docs`: documentação automática e páginas Docs.

Controls e os viewports customizados são configurados no preview do Storybook; não há addon de testes de interação configurado neste pacote.

Arquivos principais:

- `.storybook/main.ts`: descoberta de stories, addons, framework React/Vite e integração TypeScript;
- `.storybook/preview.tsx`: estilos globais, providers, controls e viewports.

## Como adicionar uma story

Crie um arquivo `*.stories.tsx` ao lado do componente:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MeuComponente } from "./MeuComponente";

const meta = {
  title: "Molecules/MeuComponente",
  component: MeuComponente,
  tags: ["autodocs"],
} satisfies Meta<typeof MeuComponente>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props do componente
  },
};
```

Documente estados relevantes, variantes e um exemplo próximo do uso real. Caso o componente dependa de um contexto que ainda não esteja no preview global, forneça um decorator específico para a story.

## Referências

- [Storybook](https://storybook.js.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
