import { SensitiveDataBox, Typography } from "@repo/design-system";
export const Balance = () => {
  return (
    <SensitiveDataBox title="Saldo" className="w-64">
      <Typography>Conta Corrente</Typography>
      <Typography variant="h2">R$ 100.234,56</Typography>
    </SensitiveDataBox>
  );
};
