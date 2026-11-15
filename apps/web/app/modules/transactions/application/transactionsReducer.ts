import type { Transaction, TransactionUpdate } from "../domain/Transaction";
import {
  addTransactionToList,
  deleteTransactionFromList,
  hydrateTransactions,
  updateTransactionInList,
} from "./transactionUseCases";

export type TransactionsState = {
  transactions: Transaction[];
};

export type TransactionsAction =
  | { type: "TRANSACTIONS_HYDRATED"; payload: Transaction[] }
  | { type: "TRANSACTION_ADDED"; payload: Transaction }
  | {
      type: "TRANSACTION_UPDATED";
      payload: { id: string; transaction: TransactionUpdate };
    }
  | { type: "TRANSACTION_DELETED"; payload: string };

export function transactionsReducer(
  state: TransactionsState,
  action: TransactionsAction,
): TransactionsState {
  switch (action.type) {
    case "TRANSACTIONS_HYDRATED":
      return {
        ...state,
        transactions: hydrateTransactions(action.payload),
      };

    case "TRANSACTION_ADDED":
      return {
        ...state,
        transactions: addTransactionToList(state.transactions, action.payload),
      };

    case "TRANSACTION_UPDATED":
      return {
        ...state,
        transactions: updateTransactionInList(
          state.transactions,
          action.payload.id,
          action.payload.transaction,
        ),
      };

    case "TRANSACTION_DELETED":
      return {
        ...state,
        transactions: deleteTransactionFromList(
          state.transactions,
          action.payload,
        ),
      };

    default:
      return state;
  }
}
