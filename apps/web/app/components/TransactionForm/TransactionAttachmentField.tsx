import { Button } from "@repo/design-system";
import type { ChangeEvent, RefObject } from "react";
import type { TransactionAttachment } from "./TransactionForm.types";

export const TransactionAttachmentField = ({
  attachment,
  attachmentInputRef,
  attachmentSizeLabel,
  onAttachmentChange,
  onAttachmentRemove,
}: {
  attachment?: TransactionAttachment | null;
  attachmentInputRef: RefObject<HTMLInputElement | null>;
  attachmentSizeLabel: string;
  onAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAttachmentRemove: () => void;
}) => {
  return (
    <div className="col-span-2 flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Anexo</span>
        <input
          ref={attachmentInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="cursor-pointer rounded-md border border-primary  px-3 py-2 text-sm transition-colors file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
          onChange={onAttachmentChange}
        />
      </label>

      {attachment && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/30  px-3 py-2 text-sm">
          <div className="min-w-0">
            <p className="truncate font-semibold">{attachment.name}</p>
            <p className="text-muted">
              {attachmentSizeLabel} - {attachment.type}
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={onAttachmentRemove}
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  );
};


