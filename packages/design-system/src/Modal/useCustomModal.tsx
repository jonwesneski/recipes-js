import { createPortal } from 'react-dom'
import { useModalStore } from './modal-store-provider'

export function useCustomModal() {
  const { addModal, removeModal } = useModalStore((state) => state)

  const showModal = <T extends object>(
    id: string,
    blocking: boolean,
    Component: React.ComponentType<T>,
    props: T,
  ) => {
    const modalRoot = document.getElementById('modal-root')
    if (!modalRoot) throw new Error('Root node not found. Cannot render modal.')
    const portal = createPortal(
      blocking ? (
        <Component {...props} />
      ) : (
        <div className="pointer-events-auto">
          <Component {...props} />
        </div>
      ),
      modalRoot,
    )
    if (blocking) {
      // Prevent scrolling while modal is up
      document.body.style.overflow = 'hidden'
    }
    addModal({ id, portal, blocking })
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
