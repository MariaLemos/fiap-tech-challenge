import type { FinanceTransaction, TransactionFilters, TransactionType } from "@/types/finance";

export function formatCurrency(value: number, hideValue = false) {
  if (hideValue) return "R$ ••••••";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(parsed)
    .replace(".", "");
}

export function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function toIsoDate(date = new Date()) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 10);
}

export function parseCurrencyInput(value: string) {
  const normalized = value.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  return Number(normalized);
}

export function matchesFilters(transaction: FinanceTransaction, filters: TransactionFilters) {
  const search = filters.search.trim().toLocaleLowerCase("pt-BR");
  const matchesSearch =
    !search ||
    transaction.description.toLocaleLowerCase("pt-BR").includes(search) ||
    transaction.category.toLocaleLowerCase("pt-BR").includes(search);
  const matchesCategory = filters.category === "all" || transaction.category === filters.category;
  const matchesType = filters.type === "all" || transaction.type === filters.type;
  const matchesStart = !filters.startDate || transaction.date >= filters.startDate;
  const matchesEnd = !filters.endDate || transaction.date <= filters.endDate;

  return matchesSearch && matchesCategory && matchesType && matchesStart && matchesEnd;
}

export function transactionTotals(transactions: FinanceTransaction[]) {
  const income = sumByType(transactions, "income");
  const expense = sumByType(transactions, "expense");
  return { income, expense, balance: income - expense };
}

function sumByType(transactions: FinanceTransaction[], type: TransactionType) {
  return transactions.reduce(
    (total, transaction) => (transaction.type === type ? total + transaction.amount : total),
    0,
  );
}

export function validateIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && toIsoDate(date) === value;
}
