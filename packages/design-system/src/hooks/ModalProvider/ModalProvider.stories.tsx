import type { Meta, StoryObj } from "@storybook/react";
import { useModal, ModalProvider } from "./ModalProvider";
import { useDialogModal } from "../useDialogModal/useDialogModal";
import { Button, Input, Typography } from "../../atoms";
import { ChangeEvent, useState } from "react";

// Componentes de exemplo para demonstração
const ExampleConfirmModal = ({
  message,
  onClose,
  onConfirm,
}: {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="space-y-4">
    <Typography variant="p">{message}</Typography>
    <div className="flex gap-2 justify-end">
      <Button variant="secondary" onClick={onClose}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Confirmar
      </Button>
    </div>
  </div>
);

const ExampleInputModal = ({
  onClose,
  onSubmit,
}: {
  title: string;
  placeholder: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}) => {
  const [value, setValue] = useState("");

  const mockField = {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    onBlur: () => {},
    name: "modal-input",
    ref: () => {},
  };

  return (
    <div className="space-y-4">
      <Input type="text" field={mockField} className="w-full" />
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onSubmit(value);
            onClose();
          }}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
};

const CustomModal = ({
  onClose,
  name,
}: {
  onClose: () => void;
  name: string;
}) => (
  <div className="space-y-4">
    <Typography variant="h3">Olá, {name}!</Typography>
    <Typography variant="p">Este é um modal customizado.</Typography>
    <Button variant="primary" onClick={onClose}>
      Fechar
    </Button>
  </div>
);

// Componente de demonstração principal
const ModalDemoComponent = () => {
  const { openModal, closeModal, closeAllModals, modals } = useModal();
  const { openDialogModal } = useDialogModal({
    type: "confirmDelete",
    itemName: "item",
  });

  // Exemplo 1: Modal de confirmação
  const handleDelete = () => {
    openModal(ExampleConfirmModal, {
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir este item?",
      onConfirm: () => {
        console.log("Item excluído!");
        alert("Item excluído com sucesso!");
      },
    });
  };

  // Exemplo 2: Modal de input
  const handleAddItem = () => {
    openModal(ExampleInputModal, {
      title: "Adicionar novo item",
      placeholder: "Nome do item...",
      onSubmit: (value: string) => {
        console.log("Novo item:", value);
        alert(`Novo item adicionado: ${value}`);
      },
    });
  };

  // Exemplo 3: Modal customizado
  const handleCustomModal = () => {
    const modalId = openModal(CustomModal, {
      name: "Usuário",
    });

    // Você pode usar o modalId para fechar um modal específico depois
    setTimeout(() => {
      closeModal(modalId);
    }, 5000);
  };

  // Exemplo 4: Modal usando useDialogModal
  const handleDialogModal = () => {
    openDialogModal({
      onConfirm: () => {
        alert("Ação confirmada!");
      },
    });
  };

  // Exemplo 5: Modal dentro de modal (pilha)
  const handleNestedModal = () => {
    openModal(CustomModal, {
      name: "Primeiro Modal",
    });

    setTimeout(() => {
      openModal(CustomModal, {
        name: "Segundo Modal",
      });
    }, 1000);
  };

  return (
    <div className="space-y-4 max-w-md">
      <div className="mb-6">
        <Typography variant="h3" className="mb-2">
          Sistema de Modal - Demo
        </Typography>
        <Typography variant="p" className="text-muted">
          Modals ativos: {modals.length}
        </Typography>
      </div>

      <div className="grid gap-3">
        <Button variant="primary" onClick={handleDelete}>
          Modal de Confirmação
        </Button>

        <Button variant="primary" onClick={handleAddItem}>
          Modal de Input
        </Button>

        <Button variant="primary" onClick={handleCustomModal}>
          Modal Customizado (fecha em 5s)
        </Button>

        <Button variant="primary" onClick={handleDialogModal}>
          Dialog Modal (useDialogModal)
        </Button>

        <Button variant="primary" onClick={handleNestedModal}>
          Modals Aninhados
        </Button>

        {modals.length > 0 && (
          <Button variant="secondary" onClick={closeAllModals}>
            Fechar Todos ({modals.length})
          </Button>
        )}
      </div>

      <div className="mt-6 p-4 bg-surface border rounded-lg">
        <Typography variant="h4" className="mb-2">
          Status:
        </Typography>
        <Typography variant="p" className="text-sm">
          {modals.length === 0
            ? "Nenhum modal ativo"
            : `${modals.length} modal(s) ativo(s)`}
        </Typography>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Hooks/ModalProvider",
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-primary">
            Sistema de Modal
          </h1>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Visão Geral</h2>
              <p className="mb-4">
                O sistema de modal é uma solução completa para gerenciar modals
                na aplicação. Ele suporta múltiplos modals simultâneos, pilha de
                modals, e fornece hooks convenientes para diferentes tipos de
                modals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Setup</h2>
              <p className="mb-4">
                Primeiro, envolva sua aplicação com o <code>ModalProvider</code>
                :
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import { ModalProvider } from "@repo/design-system";

function App() {
  return <ModalProvider>{/* Sua aplicação */}</ModalProvider>;
}`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Uso Básico</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import { useModal } from "@repo/design-system";

function MyComponent() {
  const { openModal, closeModal, closeAllModals } = useModal();

  const handleOpenModal = () => {
    openModal(MyModalComponent, {
      title: "Meu Modal",
      data: "alguns dados",
    });
  };

  return <button onClick={handleOpenModal}>Abrir Modal</button>;
}`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Funcionalidades</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Pilha de Modals:</strong> Suporta múltiplos modals
                  simultâneos com z-index automático
                </li>
                <li>
                  <strong>Props Automáticas:</strong> Todos os componentes
                  recebem <code>onClose</code> e <code>modalId</code>
                  automaticamente
                </li>
                <li>
                  <strong>Backdrop Click:</strong> Clicar no fundo escuro fecha
                  o modal atual
                </li>
                <li>
                  <strong>Portal Rendering:</strong> Modals são renderizados no
                  final do document.body
                </li>
                <li>
                  <strong>Hooks Especializados:</strong> useDialogModal para
                  confirmações pré-definidas
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API</h2>

              <h3 className="text-xl font-semibold mb-2">useModal()</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <code>{`interface ModalContextType {
  modals: ModalItem[]; // Lista atual de modals
  openModal: (component, props?) => id; // Abre um novo modal
  closeModal: (id?) => void; // Fecha modal específico ou o último
  closeAllModals: () => void; // Fecha todos os modals
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold mb-2">ModalItem</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`interface ModalItem {
  id: string; // ID único
  component: ComponentType<any>; // Componente React
  props?: Record<string, any>; // Props para o componente
}`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">useDialogModal</h2>
              <p className="mb-4">
                Hook especializado para modals de confirmação com tipos
                pré-definidos:
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import { useDialogModal } from "@repo/design-system";

const { openDialogModal } = useDialogModal({
  type: "confirmDelete", // ou "confirmAction"
  itemName: "transação",
});

openDialogModal({
  onConfirm: () => {
    // Lógica de confirmação
  },
});`}</code>
              </pre>
            </section>
          </div>
        </div>
      ),
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveDemo: Story = {
  render: () => (
    <ModalProvider>
      <ModalDemoComponent />
    </ModalProvider>
  ),
};

export const BasicUsage: Story = {
  render: () => {
    const BasicDemo = () => {
      const { openModal } = useModal();

      const SimpleModal = ({ onClose }: { onClose: () => void }) => (
        <div className="space-y-4">
          <Typography variant="h3">Modal Simples</Typography>
          <Typography variant="p">
            Este é um exemplo básico de modal.
          </Typography>
          <Button variant="primary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      );

      return (
        <Button
          variant="primary"
          onClick={() =>
            openModal(SimpleModal, {
              title: "Exemplo Básico",
            })
          }
        >
          Abrir Modal Básico
        </Button>
      );
    };

    return (
      <ModalProvider>
        <BasicDemo />
      </ModalProvider>
    );
  },
};

export const DialogModalExample: Story = {
  render: () => {
    const DialogDemo = () => {
      const { openDialogModal: openDeleteModal } = useDialogModal({
        type: "confirmDelete",
        itemName: "item",
      });

      const { openDialogModal: openActionModal } = useDialogModal({
        type: "confirmAction",
      });

      return (
        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={() =>
              openDeleteModal({
                onConfirm: () => alert("Item excluído!"),
              })
            }
          >
            Confirmar Exclusão
          </Button>

          <Button
            variant="primary"
            onClick={() =>
              openActionModal({
                onConfirm: () => alert("Ação confirmada!"),
              })
            }
          >
            Confirmar Ação
          </Button>
        </div>
      );
    };

    return (
      <ModalProvider>
        <DialogDemo />
      </ModalProvider>
    );
  },
};

export const MultipleModals: Story = {
  render: () => {
    const MultipleDemo = () => {
      const { openModal, closeAllModals, modals } = useModal();

      const openMultiple = () => {
        // Abre 3 modals com delay
        [1, 2, 3].forEach((num, index) => {
          setTimeout(() => {
            openModal(CustomModal, {
              name: `Modal ${num}`,
            });
          }, index * 500);
        });
      };

      return (
        <div className="space-y-3">
          <Typography variant="p" className="text-muted">
            Modals ativos: {modals.length}
          </Typography>

          <Button variant="primary" onClick={openMultiple}>
            Abrir 3 Modals
          </Button>

          {modals.length > 0 && (
            <Button variant="secondary" onClick={closeAllModals}>
              Fechar Todos
            </Button>
          )}
        </div>
      );
    };

    return (
      <ModalProvider>
        <MultipleDemo />
      </ModalProvider>
    );
  },
};
