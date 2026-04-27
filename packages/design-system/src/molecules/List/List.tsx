import { Typography } from "../../atoms"
import { useMemo } from "react"
import { groupByMonth } from "./List.helper"
import dayjs from "dayjs"

export type ListItem = { id: string; type: string; value: number; date: string };


export const List = <T extends ListItem>({ data }: { data: T[] }) => {
  const groupedData = useMemo(() => groupByMonth(data), [data]);

  if (groupedData.length === 0) {
    return (
      <div className="text-center text-muted p-8">
        <Typography variant="h3">Nenhum item encontrado</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedData.map(({ monthName, items }, index) => (
        <div key={`${monthName}-${index}`} className="group">
         
            <Typography variant="h4" className="text-primary font-semibold">
              {monthName}
            </Typography>
           
         
          
          <div className="divide-primary divide-solid divide-y-2">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-2 gap-2 py-4 justify-between align-middle items-center">
              
                    <Typography variant="p" className="mb-1 truncate col-span-2">{item.type}</Typography>
                  
                      <Typography variant="span" className=" text-primary rounded-md font-medium">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(item.value)}
                      </Typography>

                  <Typography variant="span" className="text-right text-sm text-muted">
                    {dayjs(item.date).format('DD/MM HH:mm')}
                  </Typography>
                </div>
             
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}