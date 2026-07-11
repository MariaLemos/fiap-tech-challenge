import dayjs from "dayjs";
import type { UseFormReturn } from "react-hook-form";
import { useUserInfo } from "../../../hooks/UserInfo.provider";
import type { Transaction } from "../../../hooks/UserInfo.provider";
import type { TransactionFormData } from "../TransactionForm.types";

export const useTransactionFormSubmit = ({
  formMethods,
  onSubmitCallback,
  transaction,
}: {
  formMethods: UseFormReturn<TransactionFormData>;
  onSubmitCallback?: () => void;
  transaction?: Transaction;
}) => {
  const { addTransaction, updateTransaction } = useUserInfo();

  return async (data: TransactionFormData) => {
    try {
      const transactionData: Omit<Transaction, "id"> = {
        ...data,
        amount: Number(data.amount),
        date: dayjs(data.date),
        attachment: data.attachment ?? null,
      };

      if (transaction) {
        updateTransaction(transaction.id, transactionData);
      } else {
        addTransaction(transactionData);
      }

      if (!transaction) {
        formMethods.reset({
          type: "deposit",
          amount: 0,
          description: "",
          category: "",
          date: dayjs().format("YYYY-MM-DD"),
          attachment: null,
        });
      }

      if (onSubmitCallback) {
        onSubmitCallback();
      }
    } catch (err) {
      console.error("Erro ao processar transacao:", err);
    }
  };
};


