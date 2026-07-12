"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RouteModal } from "../../../components/RouteModal/RouteModal";
import { TransactionForm } from "../../../components/TransactionForm/TransactionForm";
import { useI18n } from "@repo/i18n/react";

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

function NewTransactionModalContent() {
  const router = useRouter();
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const initialValues = {
    type: getInitialType(searchParams.get("type")),
    amount: getInitialAmount(searchParams.get("amount")),
  };

  return (
    <RouteModal title={t("transactions.new")}>
      <TransactionForm
        initialValues={initialValues}
        onSubmitCallback={() => router.back()}
      />
    </RouteModal>
  );
}

export default function NewTransactionModalPage() {
  return (
    <Suspense fallback={<p role="status" aria-live="polite">Carregando formulário de transação...</p>}>
      <NewTransactionModalContent />
    </Suspense>
  );
}

