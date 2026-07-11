import { Button, Typography } from "../../atoms";
import dayjs from "dayjs";
import { ListItemType } from "./List";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
export const ListItem = <T extends ListItemType>({
  item,
  onEdit,
  onDelete,
}: {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}) => {
  const { locale, t } = useI18n();
  const typeLabels: Record<string, string> = {
    deposit: t("transactions.type.deposit"),
    transfer: t("transactions.type.transfer"),
    withdrawal: t("transactions.type.withdrawal"),
    contribution: t("investments.type.contribution"),
    income: t("transactions.type.income"),
    redemption: t("investments.type.redemption"),
  };
  const typeLabel = item.typeLabelKey
    ? t(item.typeLabelKey)
    : (typeLabels[item.type] ?? item.type);
  const title = item.description || typeLabel;
  const subtitle = item.category
    ? `${item.category} - ${typeLabel}`
    : typeLabel;

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
          <Typography
            variant="span"
            className="block truncate text-sm text-muted"
          >
            {subtitle}
          </Typography>
        )}
      </div>
      <div className=" justify-self-end">
        {onEdit && (
          <Button
            aria-label={t("common.edit")}
            type="button"
            variant="icon"
            className="border-none"
            onClick={() => onEdit(item)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        )}
        {onDelete && (
          <Button
            aria-label={t("common.delete")}
            type="button"
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
        {formatCurrency(item.amount, locale)}
      </Typography>

      <Typography variant="span" className="text-right text-sm text-muted">
        {new Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(dayjs(item.date).toDate())}
      </Typography>
    </div>
  );
};
