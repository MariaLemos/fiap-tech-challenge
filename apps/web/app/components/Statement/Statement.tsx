import { SectionBox,List } from "@repo/design-system"
import "./statement.css"
export const Statement = () => {


    return (
      <SectionBox title="Extrato" className="statement size-dvh" variant="colored">
        <List data={[{id:"1",type:"deposito",value:100.234,category:"Deposito",date:"01/01/2023"},{id:"2",type:"saque",value:100.234,category:"Saque",date:"01/01/2023"}]} />
      </SectionBox>
    );
}