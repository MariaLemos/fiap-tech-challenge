"use client";

import { Button, SectionBox } from "@repo/design-system";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const RouteModal = ({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose?: () => void;
  title: string;
}) => {
  const router = useRouter();
  const handleClose = onClose || (() => router.back());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionBox
          title={title}
          headerAction={
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Fechar
            </Button>
          }
          variant="colored"
        >
          {children}
        </SectionBox>
      </div>
    </div>
  );
};
