import { Typography } from "../../atoms"

export const List = <T extends {id:string; type:string; value:number;category:string;date:string}>({data}: {data: T[]})=>{
 
    return (<ul> {data.map((item) => (
         <li key={item.id}>
            <Typography variant="h3">{item.type}</Typography>
           {item.value} ({item.category}) {`- ${item.date}`}</li>
       ))}</ul>)
}