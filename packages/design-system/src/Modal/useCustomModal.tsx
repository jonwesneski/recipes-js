import { createPortal } from 'react-dom'
import { ModalType } from './modal-store'
import { useModalStore } from './modal-store-provider'

export function useCustomModal() {
  const { addModal, removeModal } = useModalStore((state) => state)

  const showModal = <T extends object>(
    id: string,
    modalProps: Pick<ModalType, 'blocking' | 'backgroundGrayedOut'>,
    Component: React.ComponentType<T>,
    props: T,
  ) => {
    const modalRoot = document.getElementById('modal-root')
    if (!modalRoot) throw new Error('Root node not found. Cannot render modal.')
    const portal = createPortal(
      modalProps.blocking ? (
        <Component {...props} />
      ) : (
        <div className="pointer-events-auto">
          <Component {...props} />
        </div>
      ),
      modalRoot,
    )
    if (modalProps.blocking) {
      // Prevent scrolling while modal is up
      document.body.style.overflow = 'hidden'
    }
    addModal({ id, portal, ...modalProps })
  }

  const closeModal = () => {
    document.body.style.overflow = 'auto'
    removeModal()
  }

  return {
    showModal,
    closeModal,
  }
}
