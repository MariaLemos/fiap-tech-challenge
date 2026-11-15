"use client";

import type { ReactNode } from "react";
import type { Transaction } from "../modules/transactions/domain/Transaction";
import { LocalStorageTransactionRepository } from "../modules/transactions/infrastructure/LocalStorageTransactionRepository";
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
  initialTransactions?: Transaction[];
}

const createBrowserRepository = () =>
  new LocalStorageTransactionRepository(window.localStorage);

export function UserInfoProvider({
  children,
  initialTransactions,
}: UserInfoProviderProps) {
  return (
    <TransactionsProvider
      initialTransactions={initialTransactions ?? mockTransactions}
      repositoryFactory={createBrowserRepository}
      idGenerator={generateTransactionId}
    >
      {children}
    </TransactionsProvider>
  );
}

export function useUserInfo(): UserInfoContextType {
  const transactions = useTransactions(
    "useUserInfo must be used within a UserInfoProvider",
  );

  return {
    userName: "Maria Lemos",
    ...transactions,
  };
}
