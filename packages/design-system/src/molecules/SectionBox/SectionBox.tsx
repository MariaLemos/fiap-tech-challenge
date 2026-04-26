import { Typography } from "../../atoms/typography/typography";

export const SectionBox = ({
  children,
  className = "",title, variant = "bg",
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  variant?: "bg" | "colored";
}) => {
  return (
    <section
      className={`p-8 ${variant === "bg" ? "bg-foreground" : "bg-blue-500"} text-font rounded-md w-full ${className}  `}
    >
      <Typography variant="h2" className="mb-2">
        {title}
      </Typography>
      {children}
    </section>
  );
};
