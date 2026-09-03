export const TRANSACTION_CATEGORIES = [
  "Alimentação",
  "Educação",
  "Investimentos",
  "Lazer",
  "Moradia",
  "Outros",
  "Salário",
  "Saúde",
  "Transporte",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];
export type TransactionType = "income" | "expense";

export type Receipt = {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
};

export type LocalReceipt = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
};

export type FinanceTransaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  notes?: string;
  receipt?: Receipt | null;
};

export type TransactionDraft = Omit<FinanceTransaction, "id" | "receipt"> & {
  existingReceipt?: Receipt | null;
  receiptAsset?: LocalReceipt | null;
};

export type TransactionFilters = {
  search: string;
  category: TransactionCategory | "all";
  type: TransactionType | "all";
  startDate: string;
  endDate: string;
};

export const EMPTY_FILTERS: TransactionFilters = {
  search: "",
  category: "all",
  type: "all",
  startDate: "",
  endDate: "",
};
