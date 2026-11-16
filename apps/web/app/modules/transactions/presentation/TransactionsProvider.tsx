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
    let cancelled = false;
    let repository: TransactionRepository | null = null;

    void (async () => {
      try {
        repository = repositoryFactoryRef.current();
        repositoryRef.current = repository;
        const persistedTransactions = await repository.load();
        if (cancelled) return;

        if (persistedTransactions) {
          dispatch({
            type: "TRANSACTIONS_HYDRATED",
            payload: persistedTransactions,
          });
        }
      } catch {
        // Keep the in-memory seed state when browser persistence is unavailable.
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (repository && repositoryRef.current === repository) {
        repositoryRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady || !repositoryRef.current) {
      return;
    }

    void repositoryRef.current.save(state.transactions);
  }, [isReady, state.transactions]);

  const balance = useMemo(
    () => calculateTransactionBalance(state.transactions),
    [state.transactions],
  );

  const addTransaction = (transaction: NewTransaction) => {
    if (!isReady) return;

    dispatch({
      type: "TRANSACTION_ADDED",
      payload: createTransaction(transaction, idGeneratorRef.current),
    });
  };

  const updateTransaction = (id: string, transaction: TransactionUpdate) => {
    if (!isReady) return;

    dispatch({
      type: "TRANSACTION_UPDATED",
      payload: { id, transaction },
    });
  };

  const deleteTransaction = (id: string) => {
    if (!isReady) return;

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
