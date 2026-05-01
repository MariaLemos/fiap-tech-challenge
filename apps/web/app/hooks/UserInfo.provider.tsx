"use client";

import dayjs, { Dayjs } from "dayjs";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
} from "react";

// Tipos
export interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "transfer" | "withdrawal";
  date: Dayjs;
}

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

// Reducer
function userInfoReducer(state: UserInfoState, action: Action): UserInfoState {
  switch (action.type) {
    case "ADD_TRANSACTION":
      const newTransaction: Transaction = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      return {
        ...state,
        transactions: [...state.transactions, newTransaction],
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.transaction }
            : transaction,
        ),
      };

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

// Provider
export function UserInfoProvider({
  children,

  initialTransactions = [],
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
