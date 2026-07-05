import { Button, InputWrapper } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";

const categories = [
  { label: "Depósito", value: "deposit" },
  { label: "Transferência", value: "transfer" },
  { label: "Retirada", value: "withdrawal" },
];

// Schema de validação
const validationRules = {
  amount: {
    required: "O valor é obrigatório",
    min: {
      value: 0.01,
      message: "O valor deve ser maior que zero",
    },
    validate: (value: number) => {
      if (isNaN(value)) return "Digite um valor numérico válido";
      if (value > 1000000) return "Valor máximo de R$ 1.000.000,00";
      return true;
    },
  },
  type: {
    required: "O tipo de transação é obrigatório",
  },
  date: {
    required: "A data é obrigatória",
    validate: (value: string) => {
      if (!value) return "A data é obrigatória";
      const date = dayjs(value);
      if (!date.isValid()) return "Data inválida";
      if (date.isAfter(dayjs())) return "A data não pode ser futura";
      if (date.isBefore(dayjs().subtract(1, "year")))
        return "Data não pode ser anterior a 1 ano";
      return true;
    },
  },
};

interface FormData {
  amount: number;
  type: "deposit" | "transfer" | "withdrawal";
  date: string;
}

export const TransactionForm = ({
  transaction,
  onSubmitCallback,
}: {
  transaction?: Transaction;
  onSubmitCallback?: () => void;
}) => {
  const { addTransaction, updateTransaction } = useUserInfo();

  const formMethods = useForm<FormData>({
    defaultValues: {
      type: transaction?.type || "deposit",
      amount: transaction?.amount || 0,
      date:
        dayjs(transaction?.date).format("YYYY-MM-DD") ||
        dayjs().format("YYYY-MM-DD"),
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = formMethods;

  const onSubmit = async (data: FormData) => {
    try {
      // Converte dados do formulário para o formato da transação
      const transactionData: Omit<Transaction, "id"> = {
        ...data,
        amount: Number(data.amount),
        date: dayjs(data.date),
      };

      if (transaction) {
        updateTransaction(transaction.id, transactionData);
      } else {
        addTransaction(transactionData);
      }

      // Reset form only for new transactions
      if (!transaction) {
        reset({
          type: "deposit",
          amount: 0,
          date: dayjs().format("YYYY-MM-DD"),
        });
      }

      // Callback de sucesso
      if (onSubmitCallback) {
        onSubmitCallback();
      }
    } catch (err) {
      console.error("Erro ao processar transação:", err);
    }
  };
  return (
    <FormProvider {...formMethods}>
      <form
        className="grid grid-cols-2 gap-4 w-full items-start"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <InputWrapper
          label="Data"
          name="date"
          type="date"
          className="w-full"
          required
          rules={validationRules.date}
        />

        <InputWrapper
          label="Tipo"
          name="type"
          type="select"
          className="w-full"
          options={categories}
          required
          rules={validationRules.type}
        />

        <InputWrapper
          label="Valor"
          name="amount"
          type="number"
          mask="money"
          className="w-full"
          required
          rules={validationRules.amount}
          placeholder="R$ 0,00"
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full self-end"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting
            ? "Processando..."
            : transaction
              ? "Atualizar"
              : "Adicionar"}
        </Button>
      </form>
    </FormProvider>
  );
};
