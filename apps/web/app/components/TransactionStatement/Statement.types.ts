import type { Transaction } from "../../modules/transactions/domain/Transaction";
import type { FilterValues } from "../Filters/Filters.types";

export type TransactionTypeFilter = "all" | Transaction["type"];

export type StatementFilterField = "description" | "type" | "category";

export type StatementFilterValues = FilterValues<StatementFilterField>;


