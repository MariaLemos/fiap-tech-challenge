export type TransactionType = "deposit" | "transfer" | "withdrawal";

export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  status: TransactionStatus;
  attachmentName?: string;
}

export type TransactionInput = Omit<Transaction, "id">;

export interface TransactionFilters {
  search: string;
  type: "all" | TransactionType;
  status: "all" | TransactionStatus;
  category: "all" | string;
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  deposit: "Deposito",
  transfer: "Transferencia",
  withdrawal: "Retirada",
};

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  completed: "Concluida",
  pending: "Pendente",
  failed: "Falhou",
};

export const transactionCategories = [
  "Salario",
  "Alimentacao",
  "Moradia",
  "Transporte",
  "Investimentos",
  "Lazer",
  "Servicos",
];
