"use client";

import { useState, useEffect } from "react";

export const useIsMobile = (breakpoint: number = 400) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificação inicial
    checkIsMobile();

    // Listener para mudanças no tamanho da tela
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  // Retorna false no servidor para evitar hydration mismatch
  return isClient ? isMobile : false;
};
