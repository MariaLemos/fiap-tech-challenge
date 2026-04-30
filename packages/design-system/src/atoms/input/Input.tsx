"use client";

import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { InputMask } from "@react-input/mask";

export const Input = ({
  type,
  className = "",
  field,
  mask,
}: {
  type: "text" | "password" | "email" | "number";
  className?: string;
  mask?: string;

  field?: ControllerRenderProps<FieldValues, string>;
}) => {
  if (mask === "money") {
    return (
      <input
        {...field}
        type="number"
        step="0.01"
        min="0"
        className={`border p-2 rounded-lg bg-foreground ${className}`}
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
        className={`border p-2 rounded-lg bg-foreground ${className}`}
      />
    );
  }
  return (
    <input
      {...field}
      type={type}
      className={`border p-2 rounded-lg bg-foreground ${className}`}
    />
  );
};
