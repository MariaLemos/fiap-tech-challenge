export interface TransactionFormData {
  amount: number;
  type: "deposit" | "transfer" | "withdrawal";
  description: string;
  category: string;
  date: string;
}
