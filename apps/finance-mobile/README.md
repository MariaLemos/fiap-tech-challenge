# Nexo Finanças

Aplicativo de gerenciamento financeiro em React Native criado para o Tech Challenge - Fase 03 da Pós-Tech FIAP.

O app funciona em dois modos:

- **Firebase:** autenticação real, transações no Cloud Firestore e recibos no Firebase Storage.
- **Demonstração:** dados locais prontos para apresentação, sem exigir credenciais externas.

## Funcionalidades

- Login e cadastro com e-mail e senha.
- Dashboard com saldo, entradas, saídas, taxa de economia, gráfico de fluxo de caixa e análise por categoria.
- Animações com `Animated` nas transições das seções do dashboard.
- Listagem de transações com paginação/scroll infinito e atualização por gesto.
- Busca por descrição ou categoria.
- Filtros por tipo, categoria e intervalo de datas.
- Cadastro, edição e exclusão de transações com validação de campos.
- Upload de imagens e PDFs de até 10 MB para o Firebase Storage.
- Estado global de autenticação e transações com Context API.
- Regras de segurança que isolam dados e anexos por usuário.
- Layout adaptado para Android, iOS e web.

## Tecnologias

- Expo SDK 57 e React Native 0.86
- TypeScript
- Expo Router
- Context API
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- AsyncStorage
- Expo Document Picker

## Pré-requisitos

- Node.js `^20.11.1` ou `>=22.0.0`
- Yarn 1.22.22 (versão definida pelo monorepo)
- Expo Go compatível com o SDK usado ou um emulador Android/iOS
- Projeto no Firebase, para testar as integrações reais
- Firebase CLI autenticado, para publicar regras e índices

## Instalação

Execute todos os comandos desta seção a partir da raiz do monorepo:

```bash
yarn install
```

Inicie o servidor de desenvolvimento do Expo:

```bash
yarn workspace finance-mobile start
```

Escaneie o QR Code com o Expo Go. Também é possível iniciar diretamente:

```bash
yarn workspace finance-mobile android
yarn workspace finance-mobile ios
yarn workspace finance-mobile web
```

> O comando de iOS exige macOS para simulador/build local. Em outros sistemas, use um iPhone com Expo Go ou EAS Build.

## Modo demonstração

Na tela inicial, toque em **Entrar no modo demonstração**. Esse modo permite apresentar imediatamente:

- dashboard e gráficos preenchidos;
- filtros e scroll infinito;
- inclusão, edição e exclusão de transações;
- seleção de anexos.

As alterações da demonstração duram durante a sessão atual do app. A autenticação demo fica persistida até o usuário sair.

## Configuração do Firebase

### 1. Criar e habilitar serviços

No [Firebase Console](https://console.firebase.google.com/):

1. Crie um projeto.
2. Adicione um aplicativo **Web** ao projeto e copie o objeto de configuração.
3. Em **Authentication > Sign-in method**, habilite **E-mail/senha**.
4. Crie um banco **Cloud Firestore**.
5. Ative o **Cloud Storage**.

O Firebase Web SDK é usado porque é compatível com Expo Go e atende Auth, Firestore e Storage sem gerar projetos nativos.

### 2. Variáveis de ambiente

Na raiz do monorepo, copie `.env.example` para `.env` dentro de `apps/finance-mobile`.

No Windows PowerShell:

```powershell
Copy-Item apps\finance-mobile\.env.example apps\finance-mobile\.env
```

No macOS ou Linux:

```bash
cp apps/finance-mobile/.env.example apps/finance-mobile/.env
```

Depois, preencha o arquivo criado:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Após alterar o `.env`, reinicie o Expo limpando o cache:

```bash
yarn workspace finance-mobile start --clear
```

### 3. Regras e índices

Os arquivos abaixo já estão incluídos:

- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `firebase.json`

Com o Firebase CLI autenticado, publique-os a partir da pasta do app:

```bash
cd apps/finance-mobile
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### Estrutura dos dados

Cada usuário possui sua própria subcoleção:

```text
users/{uid}/transactions/{transactionId}
```

Os anexos ficam em:

```text
receipts/{uid}/{transactionId}/{arquivo}
```

As regras permitem leitura e escrita somente quando `request.auth.uid` corresponde ao `uid` do caminho.

## Validações

- descrição com pelo menos 3 caracteres;
- valor numérico maior que zero;
- categoria obrigatória;
- data válida no formato `AAAA-MM-DD`;
- recibo em imagem ou PDF;
- tamanho máximo de 10 MB para anexos.

## Verificação do projeto

Na raiz do monorepo:

```bash
yarn workspace finance-mobile typecheck
yarn workspace finance-mobile test
yarn workspace finance-mobile export:web
```

## Arquitetura

```text
src/
├── app/                 # Rotas de autenticação, abas e formulários
├── components/          # Componentes visuais e gráficos
├── context/             # Estado global de sessão e transações
├── data/                # Massa de dados da demonstração
├── services/            # Firebase, Firestore e Storage
├── theme/               # Tokens visuais
├── types/               # Tipos de domínio
└── utils/               # Formatação, cálculos e validações
```

## Roteiro sugerido para o vídeo (até 5 minutos)

1. Mostrar login/cadastro e entrar no modo demonstração.
2. Apresentar cards, animações e gráficos do dashboard.
3. Abrir transações, pesquisar, aplicar filtros e demonstrar o scroll infinito.
4. Adicionar uma transação com recibo.
5. Editar a transação recém-criada.
6. Mostrar o perfil e explicar Auth, Firestore, Storage e regras por usuário.
