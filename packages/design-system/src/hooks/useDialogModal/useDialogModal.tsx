import { DialogModal } from "../../molecules";
import { useModal } from "../ModalProvider";
import { predefinedModals } from "./predefinedModals.config";

type PreDefinedModalProps = {
  type: "confirmDelete" | "confirmAction";
  itemName?: string;
};
type CustomModalProps = {
  type: "custom";
  title: string;
  text: string;
};
type DialogModalProps = PreDefinedModalProps | CustomModalProps;

export const useDialogModal = ({ ...props }: DialogModalProps) => {
  const { openModal } = useModal();
  const { title, text } =
    props.type !== "custom" ? predefinedModals[props.type] : props;
  return {
    openDialogModal: ({
      onClose,
      onConfirm,
    }: {
      onClose?: () => void;
      onConfirm: () => void;
    }) =>
      openModal(DialogModal, {
        title: `${title} ${props.type !== "custom" && props?.itemName}`,
        text,
        onClose,
        onConfirm,
      }),
  };
};
