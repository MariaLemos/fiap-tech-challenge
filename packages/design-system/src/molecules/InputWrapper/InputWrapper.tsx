"use client";
import { Select, Input } from "../../atoms";
import { Typography } from "../../atoms/typography/typography";
import { Controller, useFormContext, RegisterOptions } from "react-hook-form";
import { useId } from "react";

interface InputWrapperProps {
  className?: string;
  label: string;
  name: string;
  type?: "select" | "text" | "password" | "number" | "email" | "date";
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
  const generatedId = useId();
  const inputId = `${name}-${generatedId.replace(/:/g, "")}`;
  const errorId = `${inputId}-error`;
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-1">
        <label htmlFor={inputId} className={`text-sm font-semibold ${fieldError ? "text-red-700" : ""}`}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
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
                  id={inputId}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? errorId : undefined}
                  required={required}
                  className={inputClassName}
                  {...additionalInputProps}
                />
              );
            default:
              return (
                <Input
                  type={type || "text"}
                  field={field}
                  id={inputId}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? errorId : undefined}
                  required={required}
                  className={inputClassName}
                  {...additionalInputProps}
                />
              );
          }
        }}
      />

      {fieldError && (
        <div id={errorId} role="alert" className="flex items-center gap-1 mt-1">
          <Typography variant="span" className="text-red-700 text-sm">
            {fieldError}
          </Typography>
        </div>
      )}
    </div>
  );
};
