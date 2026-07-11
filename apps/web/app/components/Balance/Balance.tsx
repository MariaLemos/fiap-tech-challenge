import { SensitiveDataBox, Typography } from "@repo/design-system";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { formatCurrency } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
export const Balance = () => {
  const { balance } = useUserInfo();
  const { locale, t } = useI18n();

  return (
    <SensitiveDataBox title={t("common.balance")} className="w-64">
      <Typography>{t("common.checkingAccount")}</Typography>
      <Typography variant="h2">{formatCurrency(balance, locale)}</Typography>
    </SensitiveDataBox>
  );
};
