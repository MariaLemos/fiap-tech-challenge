"use client";

import dayjs, { Dayjs } from "dayjs";
import type { Transaction as SharedTransaction } from "@repo/contracts";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
  useEffect,
  useState,
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
  isReady: boolean;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (
    id: string,
    transaction: Partial<Omit<Transaction, "id">>,
  ) => void;
  deleteTransaction: (id: string) => void;
}

// Actions do reducer
type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
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
    description: transaction.description?.trim() || "",
    category: transaction.category?.trim() || "",
    date: dayjs.isDayjs(transaction.date)
      ? transaction.date
      : dayjs(transaction.date),
    attachment: transaction.attachment ?? null,
  };
}

// Reducer
function userInfoReducer(state: UserInfoState, action: Action): UserInfoState {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload.sort(
          (a, b) => b.date.valueOf() - a.date.valueOf(),
        ),
      };

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

const TRANSACTIONS_STORAGE_KEY = "transactions";

const parseStoredTransactions = (value: string | null): Transaction[] | null => {
  if (!value) {
    return null;
  }

  try {
    const transactions = JSON.parse(value) as Array<
      Omit<Transaction, "date"> & { date: string }
    >;

    return transactions.map((transaction) => ({
      ...transaction,
      date: dayjs(transaction.date),
    }));
  } catch {
    return null;
  }
};

const serializeTransactions = (transactions: Transaction[]) => {
  return JSON.stringify(
    transactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString(),
    })),
  );
};

// Transações de exemplo para desenvolvimento
const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1500.0,
    type: "deposit",
    description: "Salario",
    category: "Trabalho",
    date: dayjs("2026-07-09T12:00:00.000Z"),
    attachment: {
      name: "holerite-julho.pdf",
      size: 238112,
      type: "application/pdf",
    },
  },
  {
    id: "2",
    amount: 250.5,
    type: "withdrawal",
    description: "Mercado",
    category: "Alimentacao",
    date: dayjs("2026-07-10T12:00:00.000Z"),
  },
  {
    id: "3",
    amount: 800.0,
    type: "transfer",
    description: "Reserva mensal",
    category: "Investimentos",
    date: dayjs("2026-07-11T08:57:00.000Z"),
  },
];

// Provider
export function UserInfoProvider({
  children,
  initialTransactions = mockTransactions, // Usa mock por padrão para demonstração
}: UserInfoProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [state, dispatch] = useReducer(userInfoReducer, {
    userName: "Maria Lemos",
    transactions: initialTransactions,
  });

  useEffect(() => {
    const storedTransactions = parseStoredTransactions(
      localStorage.getItem(TRANSACTIONS_STORAGE_KEY),
    );

    if (storedTransactions) {
      dispatch({ type: "SET_TRANSACTIONS", payload: storedTransactions });
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    localStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      serializeTransactions(state.transactions),
    );
  }, [isReady, state.transactions]);

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
    isReady,
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


