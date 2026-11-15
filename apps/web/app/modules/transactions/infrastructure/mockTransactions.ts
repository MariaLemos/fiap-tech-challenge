import dayjs from "dayjs";
import type { Transaction } from "../domain/Transaction";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1500.0,
    type: "deposit",
    description: "Salario",
    category: "Trabalho",
    date: dayjs("2026-07-09T12:00:00.000Z"),
    attachment: {
      name: "holerite-julho.pdf",
      size: 238112,
      type: "application/pdf",
    },
  },
  {
    id: "2",
    amount: 250.5,
    type: "withdrawal",
    description: "Mercado",
    category: "Alimentacao",
    date: dayjs("2026-07-10T12:00:00.000Z"),
  },
  {
    id: "3",
    amount: 800.0,
    type: "transfer",
    description: "Reserva mensal",
    category: "Investimentos",
    date: dayjs("2026-07-11T08:57:00.000Z"),
  },
];
