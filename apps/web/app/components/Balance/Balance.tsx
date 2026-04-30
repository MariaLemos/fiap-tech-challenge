import { SensitiveDataBox, Typography } from "@repo/design-system";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { formatToBRL } from "../../utils/numberFormat";
export const Balance = () => {
  const { balance } = useUserInfo();

  return (
    <SensitiveDataBox title="Saldo" className="w-64">
      <Typography>Conta Corrente</Typography>
      <Typography variant="h2">{formatToBRL(balance)}</Typography>
    </SensitiveDataBox>
  );
};
