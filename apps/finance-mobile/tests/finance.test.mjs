import assert from "node:assert/strict";
import test from "node:test";

import {
  matchesFilters,
  parseCurrencyInput,
  transactionTotals,
  validateIsoDate,
} from "../src/utils/finance.ts";

const baseTransaction = {
  id: "1",
  description: "Supermercado",
  amount: 250.5,
  type: "expense",
  category: "Alimentação",
  date: "2026-08-31",
};

test("converte valores monetários no formato brasileiro", () => {
  assert.equal(parseCurrencyInput("1.234,56"), 1234.56);
  assert.equal(parseCurrencyInput("80,90"), 80.9);
});

test("calcula entradas, saídas e saldo", () => {
  assert.deepEqual(
    transactionTotals([
      baseTransaction,
      { ...baseTransaction, id: "2", type: "income", amount: 1000 },
    ]),
    { income: 1000, expense: 250.5, balance: 749.5 },
  );
});

test("combina busca, categoria, tipo e intervalo de datas", () => {
  assert.equal(
    matchesFilters(baseTransaction, {
      search: "mercado",
      category: "Alimentação",
      type: "expense",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
    }),
    true,
  );
  assert.equal(
    matchesFilters(baseTransaction, {
      search: "",
      category: "Moradia",
      type: "all",
      startDate: "",
      endDate: "",
    }),
    false,
  );
});

test("valida datas reais em ISO", () => {
  assert.equal(validateIsoDate("2024-02-29"), true);
  assert.equal(validateIsoDate("2025-02-29"), false);
  assert.equal(validateIsoDate("31/08/2026"), false);
});
