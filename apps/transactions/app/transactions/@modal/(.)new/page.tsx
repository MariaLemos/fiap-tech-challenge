"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RouteModal } from "../../../components/RouteModal/RouteModal";
import { TransactionForm } from "../../../components/TransactionForm/TransactionForm";

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

export default function NewTransactionModalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValues = {
    type: getInitialType(searchParams.get("type")),
    amount: getInitialAmount(searchParams.get("amount")),
  };

  return (
    <RouteModal title="Nova Transacao">
      <TransactionForm
        initialValues={initialValues}
        onSubmitCallback={() => router.back()}
      />
    </RouteModal>
  );
}
