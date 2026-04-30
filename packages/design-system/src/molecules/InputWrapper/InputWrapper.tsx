"use client";
import { Select } from "../../atoms";
import { Input } from "../../atoms/Input/Input";
import { Typography } from "../../atoms/typography/typography";
import {
  Control,
  Controller,
  FieldValues,
  useFormContext,
} from "react-hook-form";

export const InputWrapper = ({
  className,
  label,
  name,

  type,
  ...additionalInputProps
}: {
  className?: string;
  label: string;
  name: string;
  type?: "select" | "text" | "number" | "email" | "password";
  options?: { label: string; value: string }[];
  mask?: string;
}) => {
  const {
    control,
    formState: { errors: { [name]: error } = {} },
  } = useFormContext();
  return (
    <label className={`flex flex-col ${className}`}>
      <Typography variant="strong">{label}</Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case "select":
              return (
                <Select
                  field={field}
                  className={className}
                  {...additionalInputProps}
                />
              );
            default:
              return (
                <Input
                  type={type || "text"}
                  field={field}
                  className={"text-white"}
                  {...additionalInputProps}
                />
              );
          }
        }}
      />
      {error && (
        <Typography variant="span">
          {typeof error.message === "string" && error.message}
        </Typography>
      )}
    </label>
  );
};
