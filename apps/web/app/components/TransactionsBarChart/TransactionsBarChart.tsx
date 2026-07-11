"use client";

import { SectionBox, SimpleBarChart } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { useI18n } from "@repo/i18n/react";

export const TransactionsBarChart = () => {
  const { transactions } = useUserInfo();
  const { t } = useI18n();
  const expenses = transactions
    .filter((transaction: Transaction) => transaction.type === "withdrawal")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const receipts = transactions
    .filter((transaction: Transaction) => transaction.type === "deposit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return (
    <SectionBox
      title={t("charts.expensesVsIncome")}
      className="barchart h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      <SimpleBarChart
        data={{ expenses, receipts }}
        labels={{
          expenses: t("charts.expenses"),
          receipts: t("charts.income"),
        }}
      />
    </SectionBox>
  );
};
