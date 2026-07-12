"use client";

import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import type { InputHTMLAttributes } from "react";

import { InputMask } from "@react-input/mask";

export const Input = <TFieldValues extends FieldValues>({
  type,
  className = "",
  field,
  mask,
  ...props
}: {
  type: "text" | "password" | "email" | "number" | "date";
  className?: string;
  mask?: string;

  field?: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) => {
  if (mask === "money") {
    return (
      <input
        {...field}
        className={`text-font h-10 border leading-none p-2 rounded-lg bg-foreground ${className}`}
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        {...props}
      />
    );
  }
  if (mask) {
    return (
      <InputMask
        {...field}
        mask="R$ _"
        replacement={{ _: /[\d.,]/ }}
        className={`text-font leading-none h-10 border p-2 rounded-lg bg-foreground ${className}`}
        {...props}
      />
    );
  }
  return (
    <input
      {...field}
      type={type}
      className={`text-font h-10 border p-2 leading-none rounded-lg bg-foreground ${className}`}
      {...props}
    />
  );
};
