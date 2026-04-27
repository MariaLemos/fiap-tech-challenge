import { Button, Input, SectionBox, Select } from "@repo/design-system";

export const NewTransaction = () => {
  return (
    <SectionBox
      title="Nova transação"
      variant="bg"
      className="bg-accent new-transaction"
    >
      <Select
        options={[
          { label: "Deposito", value: "Deposit" },
          { label: "Transferencia", value: "2" },
        ]}
        label="Categoria"
      />
      <Input label={"Valor"} type="number" />
      <Button className="self-end">Concluir transacao</Button>
    </SectionBox>
  );
};
