"use client";

import { Button, SectionBox } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type TransactionType = "deposit" | "transfer" | "withdrawal";

const transactionTypes = [
  { label: "Deposito", value: "deposit" },
  { label: "Transferencia", value: "transfer" },
  { label: "Retirada", value: "withdrawal" },
] satisfies { label: string; value: TransactionType }[];

export const QuickTransactionStart = () => {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>("deposit");
  const [amount, setAmount] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams({ type });
    if (amount.trim()) {
      params.set("amount", amount);
    }

    router.push(`/transactions/new?${params.toString()}`);
  };

  return (
    <SectionBox
      title="Nova transação"
      variant="bg"
      className="flex flex-col flex-wrap gap-4 bg-accent new-transaction"
    >
      <form
        className="grid grid-cols-1 gap-4 w-full items-end sm:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Tipo</span>
          <select
            className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
            value={type}
            onChange={(event) => setType(event.target.value as TransactionType)}
          >
            {transactionTypes.map((transactionType) => (
              <option key={transactionType.value} value={transactionType.value}>
                {transactionType.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Valor</span>
          <input
            className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
            type="number"
            min="0"
            step="0.01"
            placeholder="R$ 0,00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <Button
          type="submit"
          variant="primary"
          className="w-full sm:col-span-2"
        >
          Continuar
        </Button>
      </form>
    </SectionBox>
  );
};
