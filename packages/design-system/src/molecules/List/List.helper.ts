
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import { ListItem } from "./List";
dayjs.locale('pt-br')
export const groupByMonth = <T extends ListItem>(items: T[]) => {
  const groups = new Map<string, { monthName: string; items: T[]; date: dayjs.Dayjs }>();
  
  items.forEach(item => {
    const date = dayjs(item.date);
    const monthKey = date.format('YYYY-MM');
    
    if (!groups.has(monthKey)) {
      groups.set(monthKey, {
        monthName: date.format('MMMM').replace(/^\w/, c => c.toUpperCase()),
        items: [],
        date
      });
    }
    
    groups.get(monthKey)!.items.push(item);
  });
  
  return Array.from(groups.values())
    .sort((a, b) => b.date.valueOf() - a.date.valueOf()) // Mais recente primeiro
    .map(group => ({
      ...group,
      items: group.items.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    }));
};
