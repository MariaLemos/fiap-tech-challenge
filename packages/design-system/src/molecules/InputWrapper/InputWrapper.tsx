"use client";
import { Select, Input } from "../../atoms";
import { Typography } from "../../atoms/typography/typography";
import { Controller, useFormContext, RegisterOptions } from "react-hook-form";

interface InputWrapperProps {
  className?: string;
  label: string;
  name: string;
  type?: "select" | "text" | "number" | "email" | "date";
  options?: { label: string; value: string }[];
  mask?: string;
  required?: boolean;
  rules?: RegisterOptions;
  placeholder?: string;
}

export const InputWrapper = ({
  className,
  label,
  name,
  type,
  required = false,
  rules,

  ...additionalInputProps
}: InputWrapperProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name]?.message as string;
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-1">
        <Typography
          variant="strong"
          className={`text-sm ${fieldError ? "text-red-600" : ""}`}
        >
          {label}
        </Typography>
        {required && <span>*</span>}
      </div>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const inputClassName = `${fieldError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-primary focus:border-primary/80"} transition-colors`;

          switch (type) {
            case "select":
              return (
                <Select
                  field={field}
                  className={inputClassName}
                  {...additionalInputProps}
                />
              );
            default:
              return (
                <Input
                  type={type || "text"}
                  field={field}
                  className={inputClassName}
                  {...additionalInputProps}
                />
              );
          }
        }}
      />

      {fieldError && (
        <div className="flex items-center gap-1 mt-1">
          <Typography variant="span" className="text-red-600 text-xs">
            {fieldError}
          </Typography>
        </div>
      )}
    </label>
  );
};
