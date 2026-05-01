# Design System Storybook

Este é o Storybook do Design System do projeto Y, uma ferramenta para documentar e testar componentes de forma isolada.

## 🚀 Como executar

### Desenvolvimento

```bash
# No diretório packages/design-system
yarn storybook
```

O Storybook será executado em http://localhost:6006

### Build de produção

```bash
# Gerar build estático do Storybook
yarn build-storybook
```

## 📚 Estrutura

### Atoms (Átomos)

Componentes básicos e indivisíveis:

- **Button**: Botões com variantes primary, secondary e icon
- **Typography**: Textos com diferentes hierarquias (h1-h6, p, span, strong)
- **Input**: Campos de entrada com suporte a máscaras
- **Select**: Listas de seleção com opções customizáveis
- **ThemeToggle**: Alternador de tema claro/escuro

### Molecules (Moléculas)

Componentes compostos por atoms:

- **InputWrapper**: Input com label e validação
- **List**: Lista de itens com ações
- **SectionBox**: Container com título e variantes de estilo
- **Navigation**: Componente de navegação
- **UserMenu**: Menu do usuário

### Organisms (Organismos)

Componentes complexos:

- **Header**: Cabeçalho da aplicação

### Design Tokens

- **Colors**: Sistema de cores que se adapta aos temas

## 🎨 Sistema de Temas

O design system possui suporte completo a temas claro e escuro:

### Cores disponíveis:

- `primary`: Cor principal do tema
- `background`: Fundo principal
- `surface`: Fundo de cards/componentes
- `foreground`: Fundo de inputs
- `muted`: Textos secundários
- `border`: Bordas e divisores
- `accent`: Destaques especiais
- `font`: Cor principal do texto

### Uso:

```css
.meu-componente {
  background-color: var(--color-surface);
  color: var(--color-font);
  border: 1px solid var(--color-border);
}
```

Ou com Tailwind:

```jsx
<div className="bg-surface text-font border border-border">Meu conteúdo</div>
```

## 🛠️ Como adicionar novas stories

1. Crie um arquivo `.stories.tsx` ao lado do seu componente:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MeuComponente } from "./MeuComponente";

const meta: Meta<typeof MeuComponente> = {
  title: "Atoms/MeuComponente", // ou Molecules/ ou Organisms/
  component: MeuComponente,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props do componente
  },
};
```

2. O Storybook detectará automaticamente o novo arquivo

## 📝 Convenções

- **Atoms**: Componentes básicos e reutilizáveis
- **Molecules**: Combinações de atoms
- **Organisms**: Componentes complexos da interface
- Use `tags: ['autodocs']` para documentação automática
- Crie múltiplas variações para demonstrar todos os estados
- Inclua exemplos de uso real quando relevante

## 🔧 Configuração

### Addons incluídos:

- **Essentials**: Controles, docs, ações, viewport, etc.
- **Links**: Navegação entre stories
- **Interactions**: Testes de interação
- **Docs**: Documentação automática
- **Controls**: Controles interativos para props
- **Viewport**: Testes em diferentes tamanhos de tela

### Personalização:

- `.storybook/main.ts`: Configuração principal
- `.storybook/preview.ts`: Configuração de preview e decorators

## 🚀 Deploy

O Storybook pode ser deployado como site estático:

1. Gere o build: `yarn build-storybook`
2. Deploy a pasta `storybook-static` em qualquer servidor estático

## 📖 Documentação adicional

- [Storybook Docs](https://storybook.js.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
