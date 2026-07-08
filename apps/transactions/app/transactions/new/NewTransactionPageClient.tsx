"use client";

import { Navigation, useIsMobile } from "@repo/design-system";
import { useSearchParams } from "next/navigation";
import { NewTransaction } from "../../components/NewTransaction/NewTransaction";

type TransactionType = "deposit" | "transfer" | "withdrawal";

const transactionTypes: TransactionType[] = [
  "deposit",
  "transfer",
  "withdrawal",
];

const getInitialType = (type: string | null): TransactionType | undefined => {
  if (transactionTypes.includes(type as TransactionType)) {
    return type as TransactionType;
  }

  return undefined;
};

const getInitialAmount = (amount: string | null): number | undefined => {
  if (!amount) {
    return undefined;
  }

  const parsedAmount = Number(amount);
  return Number.isFinite(parsedAmount) ? parsedAmount : undefined;
};

export const NewTransactionPageClient = () => {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  const initialValues = {
    type: getInitialType(searchParams.get("type")),
    amount: getInitialAmount(searchParams.get("amount")),
  };

  return (
    <main className="transactions-page gap-4 py-4 h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}
      <NewTransaction initialValues={initialValues} />
    </main>
  );
};
