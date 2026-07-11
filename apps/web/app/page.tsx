"use client";

import { Navigation, useIsMobile } from "@repo/design-system";
import "./page.css";
import { Wellcome } from "./components/Welcome/welcome";
import { Statement } from "./components/Statement/Statement";
import { QuickTransactionStart } from "./components/QuickTransactionStart/QuickTransactionStart";
import { FinancialAlertsMicrofrontend } from "./components/FinancialAlertsMicrofrontend/FinancialAlertsMicrofrontend";

import { TransactionsBarChart } from "./components/TransactionsBarChart/TransactionsBarChart";
import { TransactionsPieChart } from "./components/TransactionsCategoryPieChart/TransactionsCategoryPieChart";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <main className="home-page grid gap-4 py-4 h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}
      <Wellcome />
      <QuickTransactionStart />
      <Statement />
      <TransactionsBarChart />
      <TransactionsPieChart />
      <FinancialAlertsMicrofrontend />
    </main>
  );
}
