import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type { Transaction } from "./Transaction";
import {
  calculateTransactionBalance,
  sanitizeNewTransaction,
  sortTransactionsByDate,
} from "./transactionRules";

const buildTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => ({
  id: "transaction-1",
  amount: 100,
  type: "deposit",
  description: "Descricao",
  category: "Categoria",
  date: dayjs("2026-07-10T12:00:00.000Z"),
  ...overrides,
});

describe("transaction rules", () => {
  it("sanitizes a new transaction without changing its date or attachment", () => {
    const date = dayjs("2026-07-10T12:00:00.000Z");
    const attachment = {
      name: "receipt.pdf",
      size: 128,
      type: "application/pdf",
    };

    const result = sanitizeNewTransaction({
      amount: -42.5,
      type: "withdrawal",
      description: "  Mercado  ",
      category: "  Alimentacao  ",
      date,
      attachment,
    });

    expect(result).toEqual({
      amount: 42.5,
      type: "withdrawal",
      description: "Mercado",
      category: "Alimentacao",
      date,
      attachment,
    });
  });

  it("normalizes invalid amounts and absent optional fields", () => {
    const result = sanitizeNewTransaction({
      amount: Number.NaN,
      type: "deposit",
      date: dayjs("2026-07-10T12:00:00.000Z"),
    });

    expect(result.amount).toBe(0);
    expect(result.description).toBe("");
    expect(result.category).toBe("");
    expect(result.attachment).toBeNull();
  });

  it("sorts transactions by date without mutating the input", () => {
    const oldest = buildTransaction({
      id: "oldest",
      date: dayjs("2026-07-01T12:00:00.000Z"),
    });
    const newest = buildTransaction({
      id: "newest",
      date: dayjs("2026-07-15T12:00:00.000Z"),
    });
    const input = [oldest, newest];

    const result = sortTransactionsByDate(input);

    expect(result.map((transaction) => transaction.id)).toEqual([
      "newest",
      "oldest",
    ]);
    expect(input.map((transaction) => transaction.id)).toEqual([
      "oldest",
      "newest",
    ]);
  });

  it("adds deposits and subtracts every other transaction type", () => {
    const transactions = [
      buildTransaction({ id: "deposit", amount: 100, type: "deposit" }),
      buildTransaction({
        id: "failed-withdrawal",
        amount: 25,
        type: "withdrawal",
        status: "failed",
      }),
      buildTransaction({ id: "transfer", amount: 10, type: "transfer" }),
    ];

    expect(calculateTransactionBalance(transactions)).toBe(65);
  });
});
