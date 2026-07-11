import { SectionBox, Typography } from "@repo/design-system";
import dayjs from "dayjs";
import { Balance } from "../Balance/Balance";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { useI18n } from "@repo/i18n/react";
import "dayjs/locale/pt-br";

export const Wellcome = () => {
  const { userName } = useUserInfo();
  const { locale, t } = useI18n();
  return (
    <SectionBox
      title={t("common.greeting", { name: userName })}
      className="bg-primary pb-0 welcome"
      variant="bg"
    >
      <Typography variant="p">
        {new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(dayjs().toDate())}
      </Typography>
      <Balance />
    </SectionBox>
  );
};
