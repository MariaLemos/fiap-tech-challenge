import { Typography } from "../../atoms/typography/typography";
import image from "../../assets/background.svg";
import "./SectionBox.css";

export const SectionBox = ({
  children,
  className = "",
  headerAction,
  title,
  variant = "colored",
}: {
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  variant?: "bg" | "colored";
}) => {
  return (
    <section
      className={`sectionBox p-8 ${variant} ${variant === "bg" ? "text-white" : "bg-foreground"} text-font rounded-md w-full ${className}`}
      style={
        variant === "bg"
          ? ({
              "--bg-image": `url(${image.src || image.default || image})`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {(title || headerAction) && (
        <div className="mb-2 flex w-full items-center justify-between gap-2">
          {title && <Typography variant="h2">{title}</Typography>}
          {headerAction}
        </div>
      )}
      {children}
    </section>
  );
};
