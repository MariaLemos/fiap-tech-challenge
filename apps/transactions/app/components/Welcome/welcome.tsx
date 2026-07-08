import { SectionBox, Typography } from "@repo/design-system";
import dayjs from "dayjs";
import { Balance } from "../Balance/Balance";
import { useUserInfo } from "../../hooks/UserInfo.provider";

export const Wellcome = () => {
  const { userName } = useUserInfo();
  return (
    <SectionBox
      title={`ola, ${userName} :) `}
      className="bg-primary pb-0 welcome"
      variant="bg"
    >
      <Typography variant="p">{dayjs().format("dddd, DD/MM/YYYY")}</Typography>
      <Balance />
    </SectionBox>
  );
};
