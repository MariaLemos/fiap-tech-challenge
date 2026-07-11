import { Button } from "@repo/design-system";
import {
  getDefaultFilterValues,
  hasActiveFilters,
} from "./Filters.helpers";
import type { FilterDefinition, FilterValues } from "./Filters.types";

type FiltersProps<TField extends string> = {
  definitions: FilterDefinition<TField>[];
  values: FilterValues<TField>;
  onChangeFilters: (filters: FilterValues<TField>) => void;
  clearLabel?: string;
};

export const Filters = <TField extends string>({
  definitions,
  values,
  onChangeFilters,
  clearLabel = "Limpar",
}: FiltersProps<TField>) => {
  const shouldShowClearButton = hasActiveFilters({ definitions, values });

  const changeFilter = (field: TField, value: string) => {
    onChangeFilters({
      ...values,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onChangeFilters(getDefaultFilterValues(definitions));
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-flow-col md:auto-cols-fr md:grid-cols-none">
      {definitions.map((definition) => (
        <label
          key={definition.field}
          className="flex flex-col gap-1 text-sm font-semibold"
        >
          {definition.label}

          {definition.type === "select" ? (
            <select
              value={values[definition.field]}
              onChange={(event) =>
                changeFilter(definition.field, event.target.value)
              }
              className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
            >
              {definition.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={definition.type}
              value={values[definition.field]}
              onChange={(event) =>
                changeFilter(definition.field, event.target.value)
              }
              placeholder={definition.placeholder}
              className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
            />
          )}
        </label>
      ))}

      <div className="self-end">
        <Button
          type="button"
          variant="secondary"
          className={shouldShowClearButton ? "" : "invisible pointer-events-none"}
          tabIndex={shouldShowClearButton ? 0 : -1}
          aria-hidden={!shouldShowClearButton}
          onClick={clearFilters}
        >
          {clearLabel}
        </Button>
      </div>
    </div>
  );
};


