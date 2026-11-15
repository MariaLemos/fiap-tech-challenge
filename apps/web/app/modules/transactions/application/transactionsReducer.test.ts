import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type { NewTransaction, Transaction } from "../domain/Transaction";
import { createTransaction } from "./transactionUseCases";
import { transactionsReducer } from "./transactionsReducer";

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

describe("transaction use cases", () => {
  it("creates a transaction with an injected identifier", () => {
    const input: NewTransaction = {
      amount: -100,
      type: "deposit",
      description: "  Salario  ",
      category: "  Trabalho  ",
      date: dayjs("2026-07-10T12:00:00.000Z"),
    };

    const result = createTransaction(input, () => "controlled-id");

    expect(result.id).toBe("controlled-id");
    expect(result.amount).toBe(100);
    expect(result.description).toBe("Salario");
    expect(result.category).toBe("Trabalho");
  });
});

describe("transactions reducer", () => {
  it("adds a transaction and keeps the newest date first", () => {
    const current = buildTransaction({
      id: "current",
      date: dayjs("2026-07-10T12:00:00.000Z"),
    });
    const newest = buildTransaction({
      id: "newest",
      date: dayjs("2026-07-15T12:00:00.000Z"),
    });

    const result = transactionsReducer(
      { transactions: [current] },
      { type: "TRANSACTION_ADDED", payload: newest },
    );

    expect(result.transactions.map((transaction) => transaction.id)).toEqual([
      "newest",
      "current",
    ]);
  });

  it("updates only the selected transaction and preserves the current order", () => {
    const first = buildTransaction({
      id: "first",
      date: dayjs("2026-07-15T12:00:00.000Z"),
    });
    const second = buildTransaction({
      id: "second",
      date: dayjs("2026-07-10T12:00:00.000Z"),
    });

    const result = transactionsReducer(
      { transactions: [first, second] },
      {
        type: "TRANSACTION_UPDATED",
        payload: {
          id: "first",
          transaction: {
            amount: -50,
            description: "  descricao preservada  ",
            date: dayjs("2026-07-01T12:00:00.000Z"),
          },
        },
      },
    );

    expect(result.transactions.map((transaction) => transaction.id)).toEqual([
      "first",
      "second",
    ]);
    expect(result.transactions[0]).toMatchObject({
      amount: 50,
      description: "  descricao preservada  ",
    });
    expect(result.transactions[1]).toBe(second);
  });

  it("deletes one transaction and sorts persisted data during hydration", () => {
    const oldest = buildTransaction({
      id: "oldest",
      date: dayjs("2026-07-01T12:00:00.000Z"),
    });
    const newest = buildTransaction({
      id: "newest",
      date: dayjs("2026-07-15T12:00:00.000Z"),
    });

    const hydrated = transactionsReducer(
      { transactions: [] },
      { type: "TRANSACTIONS_HYDRATED", payload: [oldest, newest] },
    );
    const result = transactionsReducer(hydrated, {
      type: "TRANSACTION_DELETED",
      payload: "newest",
    });

    expect(hydrated.transactions.map((transaction) => transaction.id)).toEqual([
      "newest",
      "oldest",
    ]);
    expect(result.transactions).toEqual([oldest]);
  });
});
