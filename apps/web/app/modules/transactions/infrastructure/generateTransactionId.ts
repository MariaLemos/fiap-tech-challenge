import type { TransactionIdGenerator } from "../application/transactionUseCases";

export const generateTransactionId: TransactionIdGenerator = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
