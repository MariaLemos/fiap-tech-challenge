import { Button } from "@repo/design-system";
import { transactionTypeOptions } from "../Statement.constants";
import type { TransactionTypeFilter } from "../Statement.types";

type StatementFiltersProps = {
  search: string;
  typeFilter: TransactionTypeFilter;
  categoryFilter: string;
  categories: string[];
  hasActiveFilters: boolean;
  onSearchChange: (search: string) => void;
  onTypeFilterChange: (type: TransactionTypeFilter) => void;
  onCategoryFilterChange: (category: string) => void;
  onClearFilters: () => void;
};

export const StatementFilters = ({
  search,
  typeFilter,
  categoryFilter,
  categories,
  hasActiveFilters,
  onSearchChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onClearFilters,
}: StatementFiltersProps) => {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_12rem_12rem_auto]">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Buscar por descricao
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Ex: mercado"
          className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Tipo
        <select
          value={typeFilter}
          onChange={(event) =>
            onTypeFilterChange(event.target.value as TransactionTypeFilter)
          }
          className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
        >
          {transactionTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {categories.length > 0 && (
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Categoria
          <select
            value={categoryFilter}
            onChange={(event) => onCategoryFilterChange(event.target.value)}
            className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
          >
            <option value="all">Todas</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      )}

      {hasActiveFilters && (
        <Button
          type="button"
          variant="secondary"
          className="self-end"
          onClick={onClearFilters}
        >
          Limpar
        </Button>
      )}
    </div>
  );
};
