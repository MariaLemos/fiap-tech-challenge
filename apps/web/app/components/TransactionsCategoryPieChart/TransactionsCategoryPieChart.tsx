"use client";

import { PieChartComponent, SectionBox } from "@repo/design-system";
import { groupTransactionsByCategory } from "@repo/utils";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { useI18n } from "@repo/i18n/react";
export const TransactionsPieChart = () => {
  const { transactions } = useUserInfo();
  const { t } = useI18n();
  const expenses = transactions.filter(
    (transaction) => transaction.type === "withdrawal",
  );
  const groupedExpenses = groupTransactionsByCategory(expenses);
  const data = Object.entries(groupedExpenses).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <SectionBox
      title={t("charts.expenseCategories")}
      className="piechart h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      <PieChartComponent data={data} />
    </SectionBox>
  );
};
