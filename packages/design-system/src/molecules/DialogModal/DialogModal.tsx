import { Button, Typography } from "../../atoms";
import { useI18n } from "@repo/i18n/react";

export const DialogModal = ({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  text,
}: {
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  text: string;
}) => {
  const { t } = useI18n();
  const resolvedCancelLabel = cancelLabel ?? t("actions.cancel");
  const resolvedConfirmLabel = confirmLabel ?? t("actions.confirm");

  return (
    <div className="flex flex-col gap-4">
      {text && <Typography variant="p">{text}</Typography>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {resolvedCancelLabel}
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm}>
          {resolvedConfirmLabel}
        </Button>
      </div>
    </div>
  );
};
