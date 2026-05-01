# Modal System Usage Examples

## Setup

Primeiro, envolva sua aplicação com o `ModalProvider`:

```tsx
import { ModalProvider } from '@repo/design-system';

function App() {
  return (
    <ModalProvider>
      {/* Sua aplicação */}
    </ModalProvider>
  );
}
```

## Uso Básico

```tsx
import { useModal } from '@repo/design-system';
import { ExampleConfirmModal, ExampleInputModal } from '@repo/design-system';

function MyComponent() {
  const { openModal, closeModal, closeAllModals } = useModal();

  // Exemplo 1: Modal de confirmação
  const handleDelete = () => {
    openModal(ExampleConfirmModal, {
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este item?',
      onConfirm: () => {
        console.log('Item excluído!');
      }
    });
  };

  // Exemplo 2: Modal de input
  const handleAddItem = () => {
    openModal(ExampleInputModal, {
      title: 'Adicionar novo item',
      placeholder: 'Nome do item...',
      onSubmit: (value: string) => {
        console.log('Novo item:', value);
      }
    });
  };

  // Exemplo 3: Modal customizado
  const CustomModal = ({ onClose, name }: { onClose: () => void, name: string }) => (
    <div className="p-6">
      <h2>Olá, {name}!</h2>
      <button onClick={onClose}>Fechar</button>
    </div>
  );

  const handleCustomModal = () => {
    const modalId = openModal(CustomModal, {
      name: 'Usuário'
    });

    // Você pode usar o modalId para fechar um modal específico depois
    setTimeout(() => {
      closeModal(modalId);
    }, 5000);
  };

  return (
    <div>
      <button onClick={handleDelete}>Excluir</button>
      <button onClick={handleAddItem}>Adicionar Item</button>
      <button onClick={handleCustomModal}>Modal Customizado</button>
      <button onClick={closeAllModals}>Fechar Todos</button>
    </div>
  );
}
```

## Funcionalidades

### Pilha de Modals
- O sistema suporta múltiplos modals abertos simultaneamente
- Cada novo modal é sobreposto ao anterior
- O z-index aumenta automaticamente

### Props Automáticas
Todos os componentes de modal recebem automaticamente:
- `onClose: () => void` - função para fechar o modal
- `modalId: string` - ID único do modal

### Comportamento
- Clicar no backdrop (fundo escuro) fecha o modal atual
- A tecla ESC pode ser implementada nos componentes individuais
- Modais são renderizados via portal no final do document.body

## API

### useModal()

```tsx
interface ModalContextType {
  modals: ModalItem[];                    // Lista atual de modals
  openModal: (component, props?) => id;   // Abre um novo modal
  closeModal: (id?) => void;              // Fecha modal específico ou o último
  closeAllModals: () => void;             // Fecha todos os modals
}
```

### ModalItem

```tsx
interface ModalItem {
  id: string;                    // ID único
  component: ComponentType<any>; // Componente React
  props?: Record<string, any>;   // Props para o componente
}
```