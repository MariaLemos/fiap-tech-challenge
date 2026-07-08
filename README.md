# Sistema de gerenciamento financeiro

Monorepo Turborepo com uma aplicação financeira em Next.js, organizada para evoluir para uma arquitetura de microfrontends usando **Next Multi-Zones**.

O projeto ainda usa dados mockados e estado local. A separação atual prioriza a estrutura: uma app principal para dashboard e uma app separada para a área de transações.

## Tech Challenge

Este projeto foi desenvolvido como parte do **Tech Challenge da Fase 01** da Pós-graduação da **FIAP**.

O desafio consiste em desenvolver o front-end de uma aplicação financeira com foco em:

- visualizar saldo da conta corrente;
- exibir extrato das últimas transações;
- adicionar novas transações, como depósito, transferência e retirada;
- editar transações existentes;
- excluir transações com confirmação;
- visualizar e gerenciar o histórico de transações;
- usar dados mockados/estado local para simular o backend;
- organizar uma base escalável com TypeScript, Next.js, Turborepo e design system.

Nesta evolução do projeto, a aplicação também foi preparada para uma arquitetura de microfrontends usando **Next Multi-Zones**, mantendo o dashboard em `apps/web` e a área de transações em `apps/transactions`.

## Funcionalidades implementadas

### Home/dashboard

- Página inicial com boas-vindas aos usuários.
- Exibição do saldo da conta corrente.
- Extrato das últimas transações.
- Seção para iniciar uma nova transação.
- Navegação para a área completa de transações em `/transactions`.

### Adicionar nova transação

- Formulário para adicionar transações.
- Campos para tipo, valor e data.
- Validação com React Hook Form.
- Atualização do estado local após o envio.

### Sistema de modal

- `ModalProvider` para gerenciamento de modals.
- `useModal` para abrir componentes em modal.
- `useDialogModal` para modals de confirmação.
- Suporte a ações como editar e excluir transações.

### Gerenciamento de transações

- Listagem de transações com o componente `List`.
- Edição de transações via modal.
- Exclusão de transações com confirmação.
- Cálculo automático do saldo com base nas transações.

## Arquitetura

```txt
apps/
  web/
    app principal em Next.js
    home/dashboard
    shell de navegação
    rewrites para a zone de transactions

  transactions/
    app Next.js separada
    rota /transactions
    componentes relacionados a transações

packages/
  design-system/
    componentes genéricos, tokens, tema, hooks e Storybook

  contracts/
    tipos e contratos compartilhados entre apps

  utils/
    funções utilitárias compartilhadas

  eslint-config/
    configuração compartilhada de ESLint

  typescript-config/
    configuração compartilhada de TypeScript
```

## Monorepo

Este repositório usa **Yarn Workspaces** e **Turborepo**.

O objetivo do monorepo é manter apps e pacotes compartilhados no mesmo repositório, permitindo:

- evoluir microfrontends de forma independente;
- compartilhar design-system, contratos, configs e utilitários;
- padronizar lint, typecheck e build;
- evitar duplicação de componentes e regras comuns;
- rodar tarefas por app/pacote ou no repo inteiro.

### Workspaces

Os workspaces são definidos no `package.json` da raiz:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Isso permite que apps consumam pacotes internos com aliases como:

```ts
import { Header } from "@repo/design-system";
import type { Transaction } from "@repo/contracts";
import { formatCurrency } from "@repo/utils";
```

### Turborepo

O `turbo.json` define as tarefas compartilhadas:

- `build`
- `dev`
- `lint`
- `check-types`
- `storybook`
- `build-storybook`

As tarefas podem ser executadas para tudo:

```sh
yarn build
yarn lint
yarn check-types
```

Ou filtradas por workspace:

```sh
yarn turbo build --filter=web
yarn turbo build --filter=transactions
yarn turbo lint --filter=@repo/design-system
```

### Apps vs. packages

Use `apps/*` para produtos executáveis:

- apps Next.js
- microfrontends
- shells
- surfaces independentes

Use `packages/*` para código compartilhado:

- componentes genéricos;
- contratos;
- helpers;
- configurações;
- tokens;
- hooks reutilizáveis.

Regra prática: uma app não deve importar código diretamente de outra app. Se algo precisa ser compartilhado entre `web` e `transactions`, mova para `packages/*` ou exponha por API/contrato.

## Multi-Zones

A app `web` roda como shell principal em `http://localhost:3000`.

A app `transactions` roda separadamente em `http://localhost:3001`.

O acesso público a transações continua sendo:

```txt
http://localhost:3000/transactions
```

Isso funciona porque `apps/web/next.config.js` faz rewrites para a zone `transactions`:

```txt
/transactions -> http://localhost:3001/transactions
/transactions/:path+ -> http://localhost:3001/transactions/:path+
/transactions-static/:path+ -> http://localhost:3001/transactions-static/:path+
```

Na app `transactions`, o `assetPrefix` aponta para `/transactions-static`, como recomendado para Next Multi-Zones.

## Apps

### `apps/web`

App principal e shell da experiência.

Responsabilidades atuais:

- Renderizar a Home/dashboard.
- Exibir saldo, formulário de nova transação e extrato na tela inicial.
- Carregar `Header`, `Navigation`, tema e modals pelo design system.
- Encaminhar `/transactions` para a zone `transactions`.

Observação: por enquanto, alguns componentes de transação ainda existem em `web` para preservar o dashboard atual funcionando.

### `apps/transactions`

Zone separada para a área de transações.

Responsabilidades atuais:

- Renderizar a rota `/transactions`.
- Concentrar componentes relacionados a transações para evolução futura.
- Usar o mesmo `design-system`, tema, modals e estilos globais da app `web`.

Componentes relacionados:

- `TransactionForm`
- `NewTransaction`
- `Statement`
- `Balance`
- `Welcome`
- `UserInfoProvider`

## Packages

### `packages/design-system`

Biblioteca compartilhada de UI.

Inclui:

- Atoms: `Button`, `Input`, `Select`, `Typography`, `ThemeToggle`
- Molecules: `DialogModal`, `InputWrapper`, `List`, `SectionBox`, `Navigation`, `UserMenu`
- Organisms: `Header`
- Hooks: `useModal`, `useDialogModal`, `useTheme`, `useIsMobile`
- Estilos globais e tokens de tema
- Storybook

As apps devem importar `@repo/design-system/global.css` em seus estilos globais e configurar o Tailwind para escanear `packages/design-system/src`.

### Componentes disponíveis

#### Atoms

- `Button`: botões com variantes `primary`, `secondary` e `icon`.
- `Input`: campos de entrada com suporte a máscaras.
- `Select`: listas de seleção.
- `Typography`: sistema de tipografia (`h1` a `h6`, `p`, `span`, `strong`).
- `ThemeToggle`: alternador de tema claro/escuro.

#### Molecules

- `DialogModal`: modal de confirmação e ações.
- `InputWrapper`: input com label, integração com React Hook Form e mensagens de validação.
- `List`: lista de transações com ações de edição e exclusão.
- `SectionBox`: container com título e variantes visuais.
- `Navigation`: navegação principal entre áreas.
- `UserMenu`: menu do usuário.
- `SensitiveDataBox`: exibição de dados sensíveis com ação de mostrar/ocultar.

#### Organisms

- `Header`: cabeçalho da aplicação.

#### Hooks

- `useModal`: gerenciamento de modals.
- `useDialogModal`: modals pré-definidos para confirmação.
- `useTheme`: gerenciamento de tema.
- `useIsMobile`: detecção de viewport móvel.

## Storybook

O `packages/design-system` possui Storybook para documentar e testar os componentes compartilhados fora das apps.

Rodar o Storybook:

```sh
yarn workspace @repo/design-system storybook
```

Acessar:

```txt
http://localhost:6006
```

O Storybook é o lugar recomendado para evoluir componentes genéricos antes de usá-los em `apps/web` ou `apps/transactions`.

Conteúdos esperados no Storybook:

- Introdução ao projeto e ao Tech Challenge
- Atoms: `Button`, `Input`, `Select`, `Typography`, `ThemeToggle`
- Molecules: `DialogModal`, `InputWrapper`, `List`, `SectionBox`, `Navigation`
- Organisms: `Header`
- Hooks e providers: tema, modals e hooks compartilhados
- Tokens de design: cores, temas e estados visuais

O Storybook também deve ser usado para:

- documentar variações visuais dos componentes;
- testar props com controles interativos;
- demonstrar estados de erro, vazio e carregamento;
- validar responsividade dos componentes reutilizáveis;
- manter exemplos de implementação para consulta.

Quando criar um componente que será reutilizado por mais de uma app, ele deve preferencialmente nascer ou ser documentado no `packages/design-system` e ganhar uma story correspondente.

### `packages/contracts`

Pacote para tipos e contratos compartilhados.

Atualmente inclui:

- `Transaction`
- `TransactionInput`
- `TransactionType`
- `TransactionStatus`
- `TransactionFilters`
- labels de tipos/status
- categorias de transação

### `packages/utils`

Pacote para funções puras compartilhadas.

Atualmente inclui:

- `formatCurrency`
- `formatDate`
- `calculateBalance`
- `groupTransactionsByCategory`

## Comandos

Instalar dependências:

```sh
yarn install
```

Rodar as duas zones em desenvolvimento:

```sh
yarn dev:zones
```

Rodar apenas a app principal:

```sh
yarn dev:web
```

Rodar apenas a zone de transações:

```sh
yarn dev:transactions
```

Build completo:

```sh
yarn build
```

Lint:

```sh
yarn lint
```

Typecheck:

```sh
yarn check-types
```

Formatação:

```sh
yarn format
```

## URLs

Com `yarn dev:zones`:

```txt
http://localhost:3000
http://localhost:3000/transactions
http://localhost:3001/transactions
```

Storybook do design system:

```sh
yarn workspace @repo/design-system storybook
```

```txt
http://localhost:6006
```

## Estado atual

- `web` preserva o dashboard existente.
- `transactions` já existe como app separada e renderiza a área de transações.
- O design system é compartilhado entre as apps.
- `contracts` e `utils` existem para suportar a evolução da separação entre microfrontends.
- Ainda não há backend; os dados seguem em estado local/mock.

## Dados e backend

Este projeto utiliza **dados mockados** para simular o backend, conforme os requisitos do Tech Challenge.

Atualmente, os dados de transações são gerenciados com:

- estado local em React;
- `useReducer` para operações de transação;
- dados fictícios iniciais para demonstração;
- cálculo de saldo derivado das transações.

Não há persistência real em banco de dados. Ao recarregar a aplicação, o estado volta ao mock inicial.

## Referências do design

- **Figma**: [Projeto Financeiro](https://www.figma.com/design/ns5TC3X5Xr8V7I3LYKg9KA/Projeto-Financeiro?node-id=503-4264&t=gZy56WDAUfXtS23Y-1)
- O layout do Figma é uma referência para consistência visual, usabilidade e acessibilidade.

## Cache remoto

O Turborepo pode usar cache remoto para compartilhar artefatos de build entre máquinas e acelerar pipelines.

Para habilitar:

```sh
turbo login
turbo link
```

Mais detalhes: [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)

## Tech Challenge - FIAP

Este projeto atende aos requisitos do Tech Challenge Fase 01, incluindo:

- interface de gerenciamento financeiro;
- dashboard com saldo e extrato;
- cadastro de transações;
- edição de transações;
- exclusão com confirmação;
- dados mockados;
- design system com Storybook;
- componentes reutilizáveis;
- sistema de tema;
- sistema de modal;
- estrutura escalável com Turborepo;
- tipagem com TypeScript.

Melhorias já presentes no projeto:

- documentação interativa no Storybook;
- suporte a tema claro/escuro;
- modal system com hooks especializados;
- estrutura preparada para Next Multi-Zones;
- pacotes compartilhados para contratos e utilitários.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Turborepo
- Storybook
- React Hook Form
- ESLint
- Prettier

## Links úteis

Documentações oficiais das principais tecnologias usadas no projeto:

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Multi-Zones](https://nextjs.org/docs/app/guides/multi-zones)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [React Hook Form Documentation](https://react-hook-form.com/get-started)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/)

Referências úteis do Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

---

**Desenvolvido como parte do Tech Challenge da Pós-graduação FIAP**
