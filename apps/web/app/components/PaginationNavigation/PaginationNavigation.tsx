import { Button } from "@repo/design-system";

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
  previousLabel = "Anterior",
  nextLabel = "Proxima",
}: PaginationNavigationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm text-muted">
        Pagina {currentPage} de {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={currentPage === 1}
          onClick={onPreviousPage}
        >
          {previousLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={onNextPage}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
};


