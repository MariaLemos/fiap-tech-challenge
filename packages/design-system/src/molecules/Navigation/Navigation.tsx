"use client";

import { useId, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "../../atoms";
import "./Navigation.css";
import { useI18n } from "@repo/i18n/react";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faChartLine,
  faChevronLeft,
  faChevronRight,
  faHouse,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

const pagesList = [
  { label: "navigation.home", path: "/", icon: faHouse },
  {
    label: "navigation.transactions",
    path: "/transactions",
    zone: "transactions",
    icon: faArrowRightArrowLeft,
  },
  {
    label: "navigation.investments",
    path: "/investments",
    zone: "investments",
    icon: faChartLine,
  },
  {
    label: "navigation.services",
    path: "/services",
    icon: faLayerGroup,
  },
] as const;

const getZoneFromPath = (path: string) => {
  if (path.startsWith("/transactions")) return "transactions";
  if (path.startsWith("/investments")) return "investments";
  return "shell";
};

type NavigationProps = {
  className?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  onNavigate?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
};

export const Navigation = ({
  className,
  children,
  defaultOpen = true,
  id,
  onNavigate,
  onOpenChange,
}: NavigationProps) => {
  const pathname = usePathname();
  const { t } = useI18n();
  const generatedId = useId();
  const navigationId = id ?? `navigation-${generatedId.replaceAll(":", "")}`;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleNavigation = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    onOpenChange?.(nextIsOpen);
  };

  return (
    <aside
      id={navigationId}
      className={`navigation ${className ?? ""}`}
      data-open={isOpen}
    >
      <div className="navigation-header">
        {children && <div className="navigation-brand">{children}</div>}
        <button
          type="button"
          className="navigation-toggle"
          aria-controls={`${navigationId}-links`}
          aria-expanded={isOpen}
          aria-label={t(
            isOpen ? "navigation.closeMenu" : "navigation.openMenu",
          )}
          onClick={toggleNavigation}
        >
          <FontAwesomeIcon
            icon={isOpen ? faChevronLeft : faChevronRight}
            aria-hidden="true"
          />
        </button>
      </div>

      <nav id={`${navigationId}-links`}>
        {pagesList.map((page) => {
          const isActive =
            pathname === page.path ||
            (page.path !== "/" && pathname.startsWith(`${page.path}/`));
          const isCrossZone =
            getZoneFromPath(pathname) !== getZoneFromPath(page.path);
          const content = (
            <>
              <span className="navigation-link-icon" aria-hidden="true">
                <FontAwesomeIcon icon={page.icon} />
              </span>
              <span className="navigation-link-label">{t(page.label)}</span>
            </>
          );

          if (isCrossZone) {
            return (
              <a
                className="navigation-link"
                href={page.path}
                key={page.label}
                data-active={isActive}
                onClick={onNavigate}
                title={!isOpen ? t(page.label) : undefined}
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              className="navigation-link"
              href={page.path}
              key={page.label}
              data-active={isActive}
              onClick={onNavigate}
              title={!isOpen ? t(page.label) : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="navigation-footer" aria-hidden={!isOpen}>
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </aside>
  );
};
