import { Typography } from "../typography/typography";

export const Input = ({
  type,
  className,
  label,
}: {
  type: "text" | "password" | "email" | "number";
  className?: string;
  label: string;
}) => {
  return (
    <label>
      <Typography>{label}</Typography>
      <input type={type} className={`border p-2 rounded ${className}`} />
    </label>
  );
};
