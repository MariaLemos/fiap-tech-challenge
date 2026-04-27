import { SectionBox, SensitiveDataBox, Typography } from "@repo/design-system";
import dayjs from "dayjs";
import { Balance } from "../Balance/Balance";

export const Wellcome = () => {
  const user = "John Doe";
  return (
    <SectionBox
      title={`ola, ${user} :) `}
      className="bg-primary pb-0 welcome"
      variant="bg"
    >
      <Typography variant="p">{dayjs().format("dddd, DD/MM/YYYY")}</Typography>
      <Balance />
    </SectionBox>
  );
};
