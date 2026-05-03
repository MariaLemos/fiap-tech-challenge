"use client";

import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { InputMask } from "@react-input/mask";

export const Input = ({
  type,
  className = "",
  field,
  mask,
}: {
  type: "text" | "password" | "email" | "number" | "date";
  className?: string;
  mask?: string;

  field?: ControllerRenderProps<FieldValues, string>;
}) => {
  if (mask === "money") {
    return (
      <input
        {...field}
        className={`text-font h-10 border leading-none p-2 rounded-lg bg-foreground ${className}`}
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
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
      />
    );
  }
  return (
    <input
      {...field}
      type={type}
      className={`text-font h-10 border p-2 leading-none rounded-lg bg-foreground ${className}`}
    />
  );
};
