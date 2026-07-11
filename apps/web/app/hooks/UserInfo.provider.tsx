"use client";

import dayjs, { Dayjs } from "dayjs";
import type { Transaction as SharedTransaction } from "@repo/contracts";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
} from "react";

export type Transaction = SharedTransaction<Dayjs>;

interface UserInfoState {
  userName: string;
  transactions: Transaction[];
}

interface UserInfoContextType {
  userName: string;
  transactions: Transaction[];
  balance: number;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (
    id: string,
    transaction: Partial<Omit<Transaction, "id">>,
  ) => void;
  deleteTransaction: (id: string) => void;
}

// Actions do reducer
type Action =
  | { type: "ADD_TRANSACTION"; payload: Omit<Transaction, "id"> }
  | {
      type: "UPDATE_TRANSACTION";
      payload: {
        id: string;
        transaction: Partial<Omit<Transaction, "id">>;
      };
    }
  | { type: "DELETE_TRANSACTION"; payload: string };

// Função utilitária para gerar ID único
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Função para sanitizar dados de transação
function sanitizeTransaction(
  transaction: Omit<Transaction, "id">,
): Omit<Transaction, "id"> {
  return {
    amount: Math.abs(Number(transaction.amount)) || 0,
    type: transaction.type,
    date: dayjs.isDayjs(transaction.date)
      ? transaction.date
      : dayjs(transaction.date),
  };
}

// Reducer
function userInfoReducer(state: UserInfoState, action: Action): UserInfoState {
  switch (action.type) {
    case "ADD_TRANSACTION": {
      const sanitizedTransaction = sanitizeTransaction(action.payload);
      const newTransaction: Transaction = {
        ...sanitizedTransaction,
        id: generateId(),
      };

      return {
        ...state,
        transactions: [...state.transactions, newTransaction].sort(
          (a, b) => b.date.valueOf() - a.date.valueOf(), // Ordena por data mais recente primeiro
        ),
      };
    }

    case "UPDATE_TRANSACTION": {
      const sanitizedUpdate = action.payload.transaction.amount
        ? {
            ...action.payload.transaction,
            amount: Math.abs(Number(action.payload.transaction.amount)),
          }
        : action.payload.transaction;

      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? { ...transaction, ...sanitizedUpdate }
            : transaction,
        ),
      };
    }

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        ),
      };
    default:
      return state;
  }
}

// Context
const UserInfoContext = createContext<UserInfoContextType | undefined>(
  undefined,
);

// Provider props
interface UserInfoProviderProps {
  children: ReactNode;

  initialTransactions?: Transaction[];
}

// Transações de exemplo para desenvolvimento
const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1500.0,
    type: "deposit",
    category: "Salario",
    description: "Pagamento mensal",
    date: dayjs().subtract(2, "days"),
    status: "completed",
    attachment: null,
  },
  {
    id: "2",
    amount: 250.5,
    type: "withdrawal",
    category: "Alimentacao",
    description: "Supermercado",
    date: dayjs().subtract(1, "day"),
    status: "completed",
    attachment: null,
  },
  {
    id: "3",
    amount: 800.0,
    type: "transfer",
    category: "Servicos",
    description: "Transferencia para conta conjunta",
    date: dayjs().subtract(3, "hours"),
    status: "pending",
    attachment: null,
  },
];

// Provider
export function UserInfoProvider({
  children,
  initialTransactions = mockTransactions, // Usa mock por padrão para demonstração
}: UserInfoProviderProps) {
  const [state, dispatch] = useReducer(userInfoReducer, {
    userName: "Maria Lemos",
    transactions: initialTransactions,
  });

  // Calcula o saldo baseado nas transações
  const balance = useMemo(() => {
    return state.transactions.reduce((total, transaction) => {
      return transaction.type === "deposit"
        ? total + Number(transaction.amount)
        : total - Number(transaction.amount);
    }, 0);
  }, [state.transactions]);

  // Funções do contexto
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
  };

  const updateTransaction = (
    id: string,
    transaction: Partial<Omit<Transaction, "id">>,
  ) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: { id, transaction } });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const contextValue: UserInfoContextType = {
    userName: state.userName,
    transactions: state.transactions,
    balance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <UserInfoContext.Provider value={contextValue}>
      {children}
    </UserInfoContext.Provider>
  );
}

// Hook para usar o contexto
export function useUserInfo(): UserInfoContextType {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
}
