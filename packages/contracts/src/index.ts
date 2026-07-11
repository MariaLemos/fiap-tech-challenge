export type TransactionType = "deposit" | "transfer" | "withdrawal" | "expense";

export type TransactionStatus = "completed" | "pending" | "failed";

export interface TransactionAttachment {
  name: string;
  size: number;
  type: string;
}

export interface Transaction<TDate = string> {
  id: string;
  amount: number;
  type: TransactionType;
  category?: string;
  description?: string;
  date: TDate;
  status?: TransactionStatus;
  attachment?: TransactionAttachment | null;
}

export type TransactionInput<TDate = string> = Omit<Transaction<TDate>, "id">;

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
  expense: "Despesa",
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

export interface InvestmentGoal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  targetDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  goalId: string | null;
  name: string;
  assetClass: string;
  initialAmount: number;
  returnRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  investmentId: string;
  amount: number;
  date: string;
}

export const investmentCategories = [
  "Renda fixa",
  "Acoes",
  "Fundos imobiliarios",
  "ETFs",
  "Previdencia",
  "Criptoativos",
];
