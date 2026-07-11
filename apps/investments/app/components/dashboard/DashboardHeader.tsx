"use client";

import { Typography } from "@repo/design-system";
import Link from "next/link";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  newGoalLabel: string;
  linkClassName: string;
};

export function DashboardHeader({
  title,
  subtitle,
  newGoalLabel,
  linkClassName,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <Typography variant="h1">{title}</Typography>
        <p className="text-muted">{subtitle}</p>
      </div>
      <Link className={linkClassName} href="/investments/goals/new">
        {newGoalLabel}
      </Link>
    </header>
  );
}
