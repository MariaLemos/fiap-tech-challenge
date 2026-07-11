import type { Transaction } from "../../hooks/UserInfo.provider";
import type { FilterValues } from "../Filters/Filters.types";

export type TransactionTypeFilter = "all" | Transaction["type"];

export type StatementFilterField = "description" | "type" | "category";

export type StatementFilterValues = FilterValues<StatementFilterField>;


