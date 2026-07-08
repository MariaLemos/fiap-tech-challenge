"use client";

import { Button, SectionBox } from "@repo/design-system";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const RouteModal = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => router.back()}
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
              onClick={() => router.back()}
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
