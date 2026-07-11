export function ProgressBar({
  value,
  label,
  className = "",
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const normalizedValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const visibleValue = Math.min(normalizedValue, 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
        <span>{label}</span>
        <span className="font-semibold">{Math.round(normalizedValue)}%</span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-primary/15"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(visibleValue)}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${visibleValue}%` }}
        />
      </div>
    </div>
  );
}
