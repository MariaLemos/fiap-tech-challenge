import { Typography } from "../../atoms";
import { useMemo } from "react";
import { groupByMonth } from "./List.helper";
import dayjs, { Dayjs } from "dayjs";
import { ListItem } from "./ListItem";

export type ListItemType = {
  id: string;
  type: string;
  amount: number;
  date: Dayjs;
};

export const List = <T extends ListItemType>({
  data,
  onEditItem,
  onDeleteItem,
}: {
  data: T[];
  onEditItem?: (item: T) => void;
  onDeleteItem?: (item: T) => void;
}) => {
  const groupedData = useMemo(() => groupByMonth(data), [data]);

  if (groupedData.length === 0) {
    return (
      <div className="text-center text-muted p-8">
        <Typography variant="span">Nenhum item encontrado</Typography>
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
              <ListItem
                key={item.id}
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
