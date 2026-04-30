# UserInfo Provider

## Descrição

Provider React que gerencia o estado do usuário, incluindo nome de usuário, transações financeiras e cálculo automático do saldo.

## Funcionalidades

### Estado Gerenciado
- **userName**: Nome do usuário (string, não modificável)
- **transactions**: Lista de transações (editável, adicionável, deletável)
- **balance**: Saldo calculado automaticamente baseado nas transações

### Operações de Transação
- ✅ **Adicionar** nova transação
- ✅ **Editar** transação existente
- ✅ **Deletar** transação
- ✅ **Limpar** todas as transações
- ✅ **Recálculo automático** do saldo

## Como Usar

### 1. Configurar o Provider

```tsx
import { UserInfoProvider } from './hooks/UserInfo.provider';

// Transações iniciais (opcional)
const initialTransactions = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000,
    type: 'income',
    date: '2024-04-01',
    category: 'Trabalho'
  }
];

// Envolver sua aplicação
<UserInfoProvider 
  userName="João Silva" 
  initialTransactions={initialTransactions}
>
  {/* Seus componentes aqui */}
</UserInfoProvider>
```

### 2. Usar o Hook

```tsx
import { useUserInfo } from './hooks/UserInfo.provider';

function MyComponent() {
  const { 
    userName, 
    transactions, 
    balance, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useUserInfo();

  // Adicionar nova transação
  const handleAdd = () => {
    addTransaction({
      description: 'Compra no mercado',
      amount: 250,
      type: 'expense',
      date: '2024-04-29',
      category: 'Alimentação'
    });
  };

  // Editar transação existente
  const handleEdit = (id: string) => {
    updateTransaction(id, {
      description: 'Novo nome',
      amount: 300
    });
  };

  // Deletar transação
  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  return (
    <div>
      <h1>Olá, {userName}!</h1>
      <p>Saldo: R$ {balance.toFixed(2)}</p>
      {/* Sua UI aqui */}
    </div>
  );
}
```

## Estrutura da Transação

```tsx
interface Transaction {
  id: string;           // ID único (gerado automaticamente)
  description: string;  // Descrição da transação
  amount: number;       // Valor (sempre positivo)
  type: 'income' | 'expense';  // Tipo: receita ou gasto
  date: string;         // Data no formato ISO (YYYY-MM-DD)
  category?: string;    // Categoria (opcional)
}
```

## Cálculo do Saldo

O saldo é calculado automaticamente:
- **Receitas** (type: 'income'): somadas ao saldo
- **Gastos** (type: 'expense'): subtraídas do saldo

```tsx
balance = ∑(receitas) - ∑(gastos)
```

## Exemplo Completo

Veja o componente `UserDashboard` para um exemplo completo de como implementar:
- Formulário para adicionar transações
- Lista de transações com edição inline
- Exibição do saldo formatado
- Botões para deletar transações

## Vantagens

- ⚡ **Performance**: Usa `useReducer` e `useMemo` para otimizações
- 🔒 **Type Safety**: Totalmente tipado com TypeScript
- 🎯 **Simplicidade**: API intuitiva e fácil de usar
- 🔄 **Reativo**: Saldo recalculado automaticamente
- 💾 **Estado Centralizado**: Gerenciamento de estado consistente