import { ControllerRenderProps, FieldValues } from "react-hook-form";
export const Select = ({
  options,
  className,
  field,
}: {
  options?: { label: string; value: string }[];
  className?: string;
  field: ControllerRenderProps<FieldValues, string>;
}) => {
  return (
    <select
      {...field}
      className={`border p-2 rounded-lg bg-foreground text-font ${className}`}
    >
      {options?.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
