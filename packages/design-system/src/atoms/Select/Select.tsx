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
  console.log("options", options);
  return (
    <select
      {...field}
      className={`border p-2 rounded-lg bg-foreground ${className}`}
    >
      {options?.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
