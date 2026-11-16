"use client";

import dynamic from "next/dynamic";
import "./page.css";
import { HomeWidgetLoading } from "./components/HomeWidgetLoading/HomeWidgetLoading";
import { QuickTransactionStart } from "./components/QuickTransactionStart/QuickTransactionStart";
import { Statement } from "./components/Statement/Statement";
import { Wellcome } from "./components/Welcome/welcome";

const TransactionsBarChart = dynamic(
  () =>
    import("./components/TransactionsBarChart/TransactionsBarChart").then(
      (module) => module.TransactionsBarChart,
    ),
  {
    ssr: false,
    loading: () => <HomeWidgetLoading area="barchart" />,
  },
);

const TransactionsPieChart = dynamic(
  () =>
    import("./components/TransactionsCategoryPieChart/TransactionsCategoryPieChart").then(
      (module) => module.TransactionsPieChart,
    ),
  {
    ssr: false,
    loading: () => <HomeWidgetLoading area="piechart" />,
  },
);

const FinancialAlertsMicrofrontend = dynamic(
  () =>
    import("./components/FinancialAlertsMicrofrontend/FinancialAlertsMicrofrontend").then(
      (module) => module.FinancialAlertsMicrofrontend,
    ),
  {
    ssr: false,
    loading: () => <HomeWidgetLoading area="financial-alerts-microfrontend" />,
  },
);

export default function Home() {
  return (
    <main className="home-page grid gap-4 py-4 h-[calc(100vh-4rem)]">
      <Wellcome />
      <QuickTransactionStart />
      <Statement />
      <TransactionsBarChart />
      <TransactionsPieChart />
      <FinancialAlertsMicrofrontend />
    </main>
  );
}
