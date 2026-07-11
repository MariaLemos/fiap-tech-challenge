import type { TransactionAttachment } from "@repo/contracts";

export type { TransactionAttachment } from "@repo/contracts";

export interface TransactionFormData {
  amount: number;
  type: "deposit" | "transfer" | "withdrawal";
  description: string;
  category: string;
  date: string;
  attachment?: TransactionAttachment | null;
}


