import { SectionBox, SensitiveDataBox, Typography } from "@repo/design-system";
import dayjs from "dayjs";

export const Wellcome = () => {
    const user = "John Doe";
  return (
    <SectionBox title={`ola, ${user} :) `} className="bg-primary" variant="bg">
           <Typography variant="p">{dayjs().format("dddd, DD/MM/YYYY")}</Typography>
        <SensitiveDataBox title="Saldo" className="w-64">
          <Typography>Conta Corrente</Typography>
          <Typography variant="h2">R$ 100.234,56</Typography>
         </SensitiveDataBox>
    </SectionBox>
  );
};