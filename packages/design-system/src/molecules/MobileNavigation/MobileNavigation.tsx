"use client";

import { useEffect, useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";
import { useI18n } from "@repo/i18n/react";
import { useIsMobile } from "../..";
import { Navigation } from "../Navigation/Navigation";
import "./MobileNavigation.css";

export const MobileNavigation = ({
  className = "",
}: {
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  if (!isMobile) return null;

  return (
    <>
      <button
        type="button"
        aria-label={t("navigation.openMenu")}
        aria-controls="mobile-navigation-panel"
        aria-expanded={isMenuOpen}
        className={`flex items-center justify-end gap-2 cursor-pointer bg-primary text-white ${className}`}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {isMenuOpen &&
        createPortal(
          <div className="mobile-navigation-overlay">
            <button
              type="button"
              aria-label={t("navigation.closeMenu")}
              className="mobile-navigation-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
            <Navigation
              id="mobile-navigation-panel"
              className="navigation--mobile"
              onNavigate={() => setIsMenuOpen(false)}
              onOpenChange={setIsMenuOpen}
            />
          </div>,
          document.body,
        )}
    </>
  );
};
