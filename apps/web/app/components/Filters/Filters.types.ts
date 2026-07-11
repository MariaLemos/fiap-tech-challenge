export type FilterFieldType = "search" | "select" | "text";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterDefinition<TField extends string = string> = {
  label: string;
  field: TField;
  type: FilterFieldType;
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: string;
};

export type FilterValues<TField extends string = string> = Record<
  TField,
  string
>;


