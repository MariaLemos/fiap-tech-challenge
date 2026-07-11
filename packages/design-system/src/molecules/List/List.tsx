import { Typography } from "../../atoms";
import { useMemo } from "react";
import { groupByMonth } from "./List.helper";
import { Dayjs } from "dayjs";
import { ListItem } from "./ListItem";
import { useI18n } from "@repo/i18n/react";

export type ListItemType = {
  id: string;
  type: string;
  description?: string;
  category?: string;
  amount: number;
  date: Dayjs;
};

export const List = <T extends ListItemType>({
  data,
  onEditItem,
  onDeleteItem,
  className = "",
}: {
  data: T[];
  className?: string;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (item: T) => void;
}) => {
  const { locale, t } = useI18n();
  const groupedData = useMemo(() => groupByMonth(data, locale), [data, locale]);

  if (groupedData.length === 0) {
    return (
      <div className="text-center text-muted p-8">
        <Typography variant="span">{t("common.noItems")}</Typography>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
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
