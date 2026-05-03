# Sistema de Gerenciamento Financeiro

Este projeto foi desenvolvido como parte do **Tech Challenge da Fase 01** do curso de Pós-graduação da **FIAP**. O objetivo é criar uma aplicação de gerenciamento financeiro utilizando Next.js e Design System, permitindo aos usuários gerenciar suas transações financeiras através de uma interface moderna e intuitiva.

## Sobre o Tech Challenge

O Tech Challenge é um projeto que engloba os conhecimentos obtidos em todas as disciplinas da fase. Este desafio consiste em desenvolver o front-end de uma aplicação financeira que permite:

- Visualizar saldo da conta corrente
- Exibir extrato das últimas transações
- Adicionar novas transações (depósito, transferência, etc.)
- Editar transações existentes
- Visualizar e gerenciar histórico completo de transações

## Estrutura do Projeto

Este monorepo Turborepo inclui os seguintes pacotes e aplicações:

### Apps e Pacotes

- **`web`**: Aplicação principal [Next.js](https://nextjs.org/) do sistema de gerenciamento financeiro
- **`@repo/design-system`**: Biblioteca de componentes React reutilizáveis com documentação via Storybook
- **`@repo/eslint-config`**: Configurações do ESLint (inclui `eslint-config-next` e `eslint-config-prettier`)
- **`@repo/typescript-config`**: Configurações do TypeScript (`tsconfig.json`) utilizadas em todo o monorepo

Cada pacote/aplicação é 100% [TypeScript](https://www.typescriptlang.org/).

## Funcionalidades Implementadas

### ✅ Home Page

- Página inicial com boas-vindas aos usuários
- Exibição do saldo da conta corrente
- Extrato das últimas transações
- Seção para iniciar nova transação com seleção de tipo e inserção de valor

### ✅ Adicionar Nova Transação

- Modal/página para adicionar transações
- Formulário com campos para tipo (depósito, transferência, etc.), valor e data
- Validação de formulários com React Hook Form

### ✅ Sistema de Modal Completo

- **ModalProvider**: Sistema de gerenciamento de modals com pilha
- **useModal**: Hook para criar modals customizados
- **useDialogModal**: Hook para modals de confirmação pré-definidos
- **Suporte a múltiplos modals** simultâneos
- **Documentação interativa** completa no Storybook com demos funcionais

### ✅ Gerenciamento de Transações

- **Listagem completa** de transações com extrato interativo
- **Edição de transações** existentes através de modals
- **Exclusão de transações** com confirmação de segurança
- **Formulários dinâmicos** com validação completa
- **Cálculo automático** do saldo baseado nas transações

## Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)**: Framework React para produção
- **[React](https://reactjs.org/)**: Biblioteca para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitário
- **[Storybook](https://storybook.js.org/)**: Documentação e desenvolvimento de componentes
- **[React Hook Form](https://react-hook-form.com/)**: Gerenciamento de formulários
- **[Turborepo](https://turborepo.dev/)**: Sistema de build para monorepos
- **[ESLint](https://eslint.org/)**: Linting de código
- **[Prettier](https://prettier.io)**: Formatação de código

## Design System

O projeto inclui um design system completo com documentação interativa no Storybook:

### 📚 Documentação no Storybook

**Acesse em**: `http://localhost:6006` (após executar `turbo storybook`)

- **Componentes reutilizáveis** documentados com exemplos interativos
- **Sistema de cores e tipografia** consistente
- **Tokens de design** padronizados
- **Suporte a temas** (claro/escuro)
- **Componentes responsivos** testáveis em diferentes viewports

### 🎯 Componentes Disponíveis

#### Atoms (Componentes Básicos)

- `Button`: Botões com variantes primary, secondary e icon
- `Input`: Campos de entrada com máscaras e validação
- `Select`: Listas de seleção customizáveis
- `Typography`: Sistema de tipografia (h1-h6, p, span, strong)
- `ThemeToggle`: Alternador de tema claro/escuro

#### Molecules (Componentes Compostos)

- `DialogModal`: Modals de confirmação e ações
- `InputWrapper`: Input com label e validação
- `List`: Lista de itens com ações (editar, deletar)
- `SectionBox`: Container com título e variantes de estilo
- `Navigation`: Componente de navegação
- `UserMenu`: Menu do usuário

#### Organisms (Componentes Complexos)

- `Header`: Cabeçalho da aplicação

#### Hooks (Funcionalidades Reutilizáveis)

- `useModal`: Sistema completo de modals com pilha e gerenciamento
- `useDialogModal`: Modals pré-definidos para confirmações
- `useTheme`: Gerenciamento de temas
- `useIsMobile`: Detecção de dispositivos móveis

### 🎮 Demos Interativos

Cada componente no Storybook inclui:

- **Documentação completa** com exemplos de código
- **Controles interativos** para testar props em tempo real
- **Múltiplas variações** demonstrando todos os estados
- **Testes visuais** em diferentes resoluções

### Ferramentas e Utilitários

- [TypeScript](https://www.typescriptlang.org/) para checagem de tipos estáticos
- [ESLint](https://eslint.org/) para linting de código
- [Prettier](https://prettier.io) para formatação de código
- [Turborepo](https://turborepo.dev/) para build e cache otimizados

## Comandos de Desenvolvimento

### Build

Para fazer build de todas as aplicações e pacotes, execute:

Com o [`turbo` global](https://turborepo.dev/docs/getting-started/installation#global-installation) instalado (recomendado):

```sh
cd meu-projeto-financeiro
turbo build
```

Sem o turbo global, use seu gerenciador de pacotes:

```sh
cd meu-projeto-financeiro
npx turbo build
# ou
yarn turbo build
```

Você pode fazer build de um pacote específico usando [filtros](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```sh
turbo build --filter=web
# ou
npx turbo build --filter=web
```

### Desenvolvimento

Para executar todas as aplicações em modo desenvolvimento:

Com o [`turbo` global](https://turborepo.dev/docs/getting-started/installation#global-installation) instalado (recomendado):

```sh
cd meu-projeto-financeiro
turbo dev
```

Sem o turbo global:

```sh
cd meu-projeto-financeiro
npx turbo dev
# ou
yarn turbo dev
```

Para executar apenas a aplicação web:

```sh
turbo dev --filter=web
# ou
npx turbo dev --filter=web
```

### Storybook (Design System)

Para executar o Storybook com a documentação completa do design system:

```sh
turbo storybook
# ou
npx turbo storybook
```

**Acesso**: `http://localhost:6006`

#### 📖 O que você encontrará no Storybook:

- **Introdução**: Visão geral do Tech Challenge e melhorias implementadas
- **Atoms**: Componentes básicos (Button, Input, Typography, etc.)
- **Molecules**: Componentes compostos (DialogModal, List, InputWrapper, etc.)
- **Organisms**: Componentes complexos (Header)
- **Hooks**: Documentação completa do sistema de Modal e outros hooks
- **Design Tokens**: Sistema de cores que se adapta aos temas

#### 🎯 Destaques da Documentação:

- **Sistema de Modal**: Documentação interativa completa com exemplos funcionais
- **Temas**: Demonstração do alternador de tema com preview em tempo real
- **Componentes**: Todos os componentes com controles interativos para testar props
- **Código**: Exemplos de implementação prontos para copiar e usar

### Outros Comandos

```sh
# Linting
turbo lint

# Verificação de tipos
turbo check-types

# Formatação de código
yarn format
```

## Dados e Backend

Este projeto utiliza **dados mockados** para simular o backend, conforme especificado nos requisitos do Tech Challenge. Os dados das transações são gerenciados através de:

- **Estado local**: Utilizando `useState()` e `useReducer()` para gerenciar transações
- **Dados fictícios**: Transações simuladas para demonstrar as funcionalidades
- **Persistência local**: Os dados são mantidos durante a sessão do usuário

## Estrutura de Componentes

### Aplicação Web (`apps/web`)

- **Home Page**: Página inicial com saldo e extrato
- **Components**: Componentes específicos da aplicação
  - `Balance`: Exibição do saldo da conta
  - `Statement`: Componente de extrato de transações
  - `TransactionForm`: Formulário para nova transação
  - `NewTransaction`: Modal/página para adicionar transação
  - `Welcome`: Componente de boas-vindas

### Design System (`packages/design-system`)

- **Atoms**: Componentes básicos (Button, Input, Select, etc.)
- **Molecules**: Componentes compostos (DialogModal, InputWrapper, List, etc.)
- **Organisms**: Componentes complexos (Header, Navigation, etc.)
- **Tokens**: Sistema de design (cores, tipografia, temas)
- **Hooks**: Hooks reutilizáveis (useTheme, useIsMobile, etc.)

## Como Executar o Projeto

1. **Instalar dependências:**

   ```sh
   yarn install
   ```

2. **Executar em modo desenvolvimento:**

   ```sh
   turbo dev
   ```

   Isso iniciará:
   - **Aplicação web**: `http://localhost:3000`
   - **Storybook**: `http://localhost:6006`

3. **Para executar apenas o Storybook:**
   ```sh
   turbo storybook
   ```

### 🎯 Principais URLs:

- **Aplicação**: `http://localhost:3000` - Sistema de gerenciamento financeiro
- **Storybook**: `http://localhost:6006` - Documentação do design system

## Cache Remoto (Opcional)

O Turborepo pode usar [Cache Remoto](https://turborepo.dev/docs/core-concepts/remote-caching) para compartilhar artefatos de cache entre máquinas. Para habilitar:

```sh
turbo login
turbo link
```

## Referências do Design

- **Figma**: [Projeto Financeiro](https://www.figma.com/design/ns5TC3X5Xr8V7I3LYKg9KA/Projeto-Financeiro?node-id=503-4264&t=gZy56WDAUfXtS23Y-1)
- O layout do Figma é apenas uma referência, com foco na consistência visual, usabilidade e acessibilidade.

## Links Úteis

Documentações e recursos das tecnologias utilizadas:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Turborepo Documentation](https://turborepo.dev/docs)
- [React Hook Form](https://react-hook-form.com/get-started)

### Turborepo

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

## Tech Challenge - FIAP

Este projeto atende aos requisitos do Tech Challenge Fase 01, incluindo:

- ✅ Interface de gerenciamento financeiro
- ✅ Design System com Storybook
- ✅ Componentes reutilizáveis
- ✅ Sistema de Modal documentado e interativo
- ✅ Dados mockados
- ✅ Estrutura escalável com Turborepo
- ✅ Tipagem completa com TypeScript

### 🏆 Melhorias Implementadas:

- **Documentação interativa** no Storybook com demos funcionais
- **Sistema de temas** com alternador claro/escuro
- **Modal system** com gerenciamento de pilha e hooks especializados
- **Componentes responsivos** testáveis em diferentes resoluções

---

**Desenvolvido como parte do Tech Challenge da Pós-graduação FIAP**
