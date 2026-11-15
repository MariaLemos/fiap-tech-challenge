import type { Transaction as SharedTransaction } from "@repo/contracts";
import type { Dayjs } from "dayjs";

export type Transaction = SharedTransaction<Dayjs>;
export type NewTransaction = Omit<Transaction, "id">;
export type TransactionUpdate = Partial<NewTransaction>;
