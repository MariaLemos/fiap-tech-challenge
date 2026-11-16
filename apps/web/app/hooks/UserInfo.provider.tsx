"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import type { TransactionRepository } from "../modules/transactions/application/ports/TransactionRepository";
import { createLocalStorageTransactionRepository } from "../modules/transactions/infrastructure/LocalStorageTransactionRepository";
import { generateTransactionId } from "../modules/transactions/infrastructure/generateTransactionId";
import { mockTransactions } from "../modules/transactions/infrastructure/mockTransactions";
import {
  TransactionsProvider,
  useTransactions,
  type TransactionsContextValue,
} from "../modules/transactions/presentation/TransactionsProvider";

export type { Transaction } from "../modules/transactions/domain/Transaction";

interface UserInfoContextType extends TransactionsContextValue {
  userName: string;
}

interface UserInfoProviderProps {
  children: ReactNode;
  userId: string | null;
  userName: string;
}

const UserNameContext = createContext("Usuário");

const volatileRepository: TransactionRepository = {
  async load() {
    return null;
  },
  async save() {},
};

function createBrowserRepository(userId: string): TransactionRepository {
  try {
    return createLocalStorageTransactionRepository(window.localStorage, userId);
  } catch {
    return volatileRepository;
  }
}

export function UserInfoProvider({
  children,
  userId,
  userName,
}: UserInfoProviderProps) {
  const repositoryFactory = useCallback(
    () => (userId ? createBrowserRepository(userId) : volatileRepository),
    [userId],
  );

  return (
    <UserNameContext.Provider value={userName}>
      <TransactionsProvider
        initialTransactions={mockTransactions}
        repositoryFactory={repositoryFactory}
        idGenerator={generateTransactionId}
      >
        {children}
      </TransactionsProvider>
    </UserNameContext.Provider>
  );
}

export function useUserInfo(): UserInfoContextType {
  const transactions = useTransactions(
    "useUserInfo must be used within a UserInfoProvider",
  );
  const userName = useContext(UserNameContext);

  return {
    userName,
    ...transactions,
  };
}
