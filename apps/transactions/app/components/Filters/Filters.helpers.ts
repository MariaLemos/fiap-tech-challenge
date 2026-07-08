import type { FilterDefinition, FilterValues } from "./Filters.types";

export const getDefaultFilterValues = <TField extends string>(
  definitions: FilterDefinition<TField>[],
) => {
  return definitions.reduce(
    (acc, definition) => ({
      ...acc,
      [definition.field]: definition.defaultValue || "",
    }),
    {} as FilterValues<TField>,
  );
};

export const hasActiveFilters = <TField extends string>({
  definitions,
  values,
}: {
  definitions: FilterDefinition<TField>[];
  values: FilterValues<TField>;
}) => {
  return definitions.some((definition) => {
    const defaultValue = definition.defaultValue || "";

    return values[definition.field] !== defaultValue;
  });
};
