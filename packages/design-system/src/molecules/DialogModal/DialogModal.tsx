import { Button, Typography } from "../../atoms";

export const DialogModal = ({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
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
  return (
    <div className="flex flex-col gap-4">
      {text && <Typography variant="p">{text}</Typography>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
};
