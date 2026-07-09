export interface TransactionAttachment {
  name: string;
  size: number;
  type: string;
}

export interface TransactionFormData {
  amount: number;
  type: "deposit" | "transfer" | "withdrawal";
  description: string;
  category: string;
  date: string;
  attachment?: TransactionAttachment | null;
}
