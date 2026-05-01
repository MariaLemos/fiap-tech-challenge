"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  ComponentType,
} from "react";
import { createPortal } from "react-dom";
import { SectionBox } from "../molecules";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography } from "../atoms";

export interface ModalItem {
  id: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
}

interface ModalContextType {
  modals: ModalItem[];
  openModal: (
    component: ComponentType<any>,
    props?: Record<string, any>,
  ) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalBackdropProps {
  onClose: () => void;
  children: React.JSX.Element;
  zIndex: number;
}

const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  onClose,
  children,
  zIndex,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-background border border-border rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const openModal = useCallback(
    (component: ComponentType<any>, props?: Record<string, any>): string => {
      const id = Math.random().toString(36).substr(2, 9);
      const newModal: ModalItem = {
        id,
        component,
        props,
      };

      setModals((prev) => [...prev, newModal]);
      return id;
    },
    [],
  );

  const closeModal = useCallback((id?: string) => {
    if (id) {
      setModals((prev) => prev.filter((modal) => modal.id !== id));
    } else {
      // Se não especificar ID, fecha o modal mais recente (topo da pilha)
      setModals((prev) => prev.slice(0, -1));
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {typeof window !== "undefined" &&
        modals.map((modal, index) => {
          const Component = modal.component;
          const zIndex = 1000 + index; // Cada modal tem um z-index maior que o anterior

          return createPortal(
            <ModalBackdrop
              key={modal.id}
              onClose={() => closeModal(modal.id)}
              zIndex={zIndex}
            >
              <SectionBox
                title={
                  <div className="modal-title flex items-center justify-between w-full">
                    <Typography variant="h2" className="mb-2 w-full">
                      {modal.props?.title || ""}
                    </Typography>
                    <Button
                      className="close-button justify-self-end border-none"
                      variant="icon"
                      onClick={() => closeModal(modal.id)}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </Button>
                  </div>
                }
                variant="colored"
              >
                <Component
                  {...(modal.props || {})}
                  onClose={() => closeModal(modal.id)}
                  modalId={modal.id}
                />
              </SectionBox>
            </ModalBackdrop>,
            document.body,
          );
        })}
    </ModalContext.Provider>
  );
};
