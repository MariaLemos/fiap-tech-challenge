import { Button } from "@repo/design-system";
import { useI18n } from "@repo/i18n/react";

type PaginationNavigationProps = {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  previousLabel?: string;
  nextLabel?: string;
};

export const PaginationNavigation = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  previousLabel,
  nextLabel,
}: PaginationNavigationProps) => {
  const { t } = useI18n();
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm text-muted">
        {t("transactions.pagination.page", { current: currentPage, total: totalPages })}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={currentPage === 1}
          onClick={onPreviousPage}
        >
          {previousLabel ?? t("transactions.pagination.previous")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={onNextPage}
        >
          {nextLabel ?? t("transactions.pagination.next")}
        </Button>
      </div>
    </div>
  );
};

