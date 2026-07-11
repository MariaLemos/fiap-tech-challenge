"use client";

import { SectionBox } from "@repo/design-system";
import { groupTransactionsByCategory } from "@repo/utils";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import PieChartComponent from "../PieChart/PieChart";
export const TransactionsPieChart = () => {
  const { transactions } = useUserInfo();
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
      title="Categorias de despesas"
      className="piechart h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      <PieChartComponent data={data} />
    </SectionBox>
  );
};
