# Módulo de transações

O estado de transações está organizado em camadas em
`app/modules/transactions`:

- `domain`: tipos e regras puras, como sanitização, ordenação e saldo;
- `application`: casos de uso, reducer e a porta `TransactionRepository`;
- `infrastructure`: adaptador compatível com o `localStorage` e dados de demonstração;
- `presentation`: contexto React, hidratação e persistência do estado.

O arquivo `UserInfo.provider.tsx` permanece como uma fachada de compatibilidade.
Ele mantém a API usada pelos componentes atuais, incluindo `userName`, enquanto
delega o estado financeiro ao `TransactionsProvider`.

## Uso

```tsx
import { UserInfoProvider, useUserInfo } from "./hooks/UserInfo.provider";

function App() {
  return (
    <UserInfoProvider>
      <Dashboard />
    </UserInfoProvider>
  );
}

function Dashboard() {
  const {
    transactions,
    balance,
    isReady,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useUserInfo();

  // Renderização omitida.
}
```

`initialTransactions` continua disponível no provider para cenários de teste e
composição. A chave e o formato persistido permanecem compatíveis com a versão
anterior: `transactions`, com datas em ISO no armazenamento e valores `Dayjs`
na aplicação.

Novos códigos que precisem apenas do tipo `Transaction` devem importá-lo de
`app/modules/transactions/domain/Transaction`, evitando depender da camada de
apresentação.
