"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../../atoms";
import { SectionBox } from "../SectionBox/SectionBox";
import Link from "next/link";
import "./Navigation.css";
import { useI18n } from "@repo/i18n/react";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";

const pagesList = [
  { label: "navigation.home", path: "/" },
  {
    label: "navigation.transactions",
    path: "/transactions",
    zone: "transactions",
  },
  {
    label: "navigation.investments",
    path: "/investments",
    zone: "investments",
  },
  { label: "navigation.services", path: "/services" },
] as const;

const getZoneFromPath = (path: string) => {
  if (path.startsWith("/transactions")) {
    return "transactions";
  }

  if (path.startsWith("/investments")) {
    return "investments";
  }

  return "shell";
};

export const Navigation = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <SectionBox
      variant="colored"
      className={`flex flex-wrap justify-between items-center w-full navigation ${className}`}
    >
      {children}
      <nav className="flex divide-primary divide-solid divide-y-2 w-full">
        {pagesList.map((page) => {
          const isActive = pathname === page.path;
          const isCrossZone =
            getZoneFromPath(pathname) !== getZoneFromPath(page.path);
          const className = `px-4 pt-4 pb-4 transition-all duration-300 ease-in-out rounded-md
                ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-md"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
                }
                hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50
              `;

          if (isCrossZone) {
            return (
              <a
                className={className}
                href={page.path}
                key={page.label}
                data-active={isActive}
              >
                {t(page.label)}
              </a>
            );
          }

          return (
            <Link
              className={className}
              href={page.path}
              key={page.label}
              data-active={isActive}
            >
              {t(page.label)}
            </Link>
          );
        })}
      </nav>
      <LanguageSelector />
      <ThemeToggle />
    </SectionBox>
  );
};
