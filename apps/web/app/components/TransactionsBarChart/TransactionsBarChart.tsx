"use client";

import { SectionBox, List } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import SimpleBarChart from "../BarChart/BarChart";

export const TransactionsBarChart = () => {
  const { transactions } = useUserInfo();
  const expenses = transactions
    .filter((transaction: Transaction) => transaction.type === "withdrawal")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const receipts = transactions
    .filter((transaction: Transaction) => transaction.type === "deposit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return (
    <SectionBox
      title="Despesas x receitas"
      className="barchart h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      <SimpleBarChart data={{ expenses, receipts }} />
    </SectionBox>
  );
};
