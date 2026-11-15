"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TransactionRepository } from "../application/ports/TransactionRepository";
import {
  createTransaction,
  type TransactionIdGenerator,
} from "../application/transactionUseCases";
import { transactionsReducer } from "../application/transactionsReducer";
import type {
  NewTransaction,
  Transaction,
  TransactionUpdate,
} from "../domain/Transaction";
import { calculateTransactionBalance } from "../domain/transactionRules";

export interface TransactionsContextValue {
  transactions: Transaction[];
  balance: number;
  isReady: boolean;
  addTransaction: (transaction: NewTransaction) => void;
  updateTransaction: (id: string, transaction: TransactionUpdate) => void;
  deleteTransaction: (id: string) => void;
}

export interface TransactionsProviderProps {
  children: ReactNode;
  initialTransactions: Transaction[];
  repositoryFactory: () => TransactionRepository;
  idGenerator: TransactionIdGenerator;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined,
);

export function TransactionsProvider({
  children,
  initialTransactions,
  repositoryFactory,
  idGenerator,
}: TransactionsProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [state, dispatch] = useReducer(transactionsReducer, {
    transactions: initialTransactions,
  });
  const repositoryRef = useRef<TransactionRepository | null>(null);
  const repositoryFactoryRef = useRef(repositoryFactory);
  const idGeneratorRef = useRef(idGenerator);

  useEffect(() => {
    const repository = repositoryFactoryRef.current();
    repositoryRef.current = repository;

    const persistedTransactions = repository.load();
    if (persistedTransactions) {
      dispatch({
        type: "TRANSACTIONS_HYDRATED",
        payload: persistedTransactions,
      });
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !repositoryRef.current) {
      return;
    }

    repositoryRef.current.save(state.transactions);
  }, [isReady, state.transactions]);

  const balance = useMemo(
    () => calculateTransactionBalance(state.transactions),
    [state.transactions],
  );

  const addTransaction = (transaction: NewTransaction) => {
    dispatch({
      type: "TRANSACTION_ADDED",
      payload: createTransaction(transaction, idGeneratorRef.current),
    });
  };

  const updateTransaction = (id: string, transaction: TransactionUpdate) => {
    dispatch({
      type: "TRANSACTION_UPDATED",
      payload: { id, transaction },
    });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: "TRANSACTION_DELETED", payload: id });
  };

  const contextValue: TransactionsContextValue = {
    transactions: state.transactions,
    balance,
    isReady,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions(
  missingProviderMessage = "useTransactions must be used within a TransactionsProvider",
): TransactionsContextValue {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(missingProviderMessage);
  }

  return context;
}
