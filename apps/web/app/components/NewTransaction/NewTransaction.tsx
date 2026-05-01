import { Button, InputWrapper, SectionBox, Select } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { FormProvider, useForm } from "react-hook-form";
import { TransactionForm } from "../TransactionForm/TransactionForm";
const categories = [
  { label: "Deposito", value: "deposit" },
  { label: "Transferencia", value: "transfer" },
  { label: "Retirada", value: "withdrawal" },
];

export const NewTransaction = () => {
  return (
    <SectionBox
      title="Nova transação"
      variant="bg"
      className="flex flex-col flex-wrap gap-4 bg-accent new-transaction"
    >
      <TransactionForm />
    </SectionBox>
  );
};
