import { Button, Typography } from "../../atoms";
import { useModal } from "../../hooks";

export const DialogModal = ({
  text,
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
  text: string;
}) => {
  const { closeModal } = useModal();

  return (
    <>
      {text && (
        <Typography variant="p" className="mb-4 w-full">
          {text}
        </Typography>
      )}
      <Button
        variant="primary"
        className="mr-4"
        onClick={() => {
          onConfirm();
          closeModal();
        }}
      >
        Confirmar
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          onClose();
          closeModal();
        }}
      >
        Cancelar
      </Button>
    </>
  );
};
