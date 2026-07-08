import { Button, Typography } from "../../atoms";
import dayjs from "dayjs";
import { ListItemType } from "./List";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export const ListItem = <T extends ListItemType>({
  item,
  onEdit,
  onDelete,
}: {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}) => {
  const title = item.description || item.type;
  const subtitle = item.category ? `${item.category} - ${item.type}` : item.type;

  return (
    <div
      key={item.id}
      className="grid grid-cols-2 gap-2 py-4 justify-between align-middle items-center"
    >
      <div className="min-w-0">
        <Typography variant="p" className="mb-1 truncate">
          {title}
        </Typography>
        {subtitle !== title && (
          <Typography variant="span" className="block truncate text-sm text-muted">
            {subtitle}
          </Typography>
        )}
      </div>
      <div className=" justify-self-end">
        {onEdit && (
          <Button
            variant="icon"
            className="border-none"
            onClick={() => onEdit(item)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="icon"
            className="border-none"
            onClick={() => onDelete(item)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        )}
      </div>
      <Typography
        variant="span"
        className=" text-primary rounded-md font-medium"
      >
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(item.amount)}
      </Typography>

      <Typography variant="span" className="text-right text-sm text-muted">
        {dayjs(item.date).format("DD/MM HH:mm")}
      </Typography>
    </div>
  );
};
