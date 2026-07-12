import { ControllerRenderProps, FieldValues } from "react-hook-form";
import type { SelectHTMLAttributes } from "react";
export const Select = ({
  options,
  className,
  field,
  ...props
}: {
  options?: { label: string; value: string }[];
  className?: string;
  field: ControllerRenderProps<FieldValues, string>;
} & SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      {...field}
      className={` max-h-10 border p-2 rounded-lg bg-foreground text-font ${className}`}
      {...props}
    >
      {options?.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
