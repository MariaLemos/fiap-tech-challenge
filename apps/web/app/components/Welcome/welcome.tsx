import { SectionBox, Typography } from "@repo/design-system";
import { Balance } from "../Balance/Balance";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { useI18n } from "@repo/i18n/react";

export const Wellcome = () => {
  const { userName } = useUserInfo();
  const { locale, t } = useI18n();
  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <SectionBox
      title={t("common.greeting", { name: userName })}
      className="bg-primary pb-0 welcome"
      variant="bg"
    >
      <Typography variant="p">{formattedDate}</Typography>
      <Balance />
    </SectionBox>
  );
};
