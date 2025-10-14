import { createPortal } from 'react-dom'
import { useModalStore } from './modal-store-provider'

export function useCustomModal() {
  const { addModal, removeModal } = useModalStore((state) => state)

  const showModal = <T extends object>(
    id: string,
    Component: React.ComponentType<T>,
    props: T,
  ) => {
    const modalRoot = document.getElementById('modal-root')
    if (!modalRoot) throw new Error('Root node not found. Cannot render modal.')
    const portal = createPortal(<Component {...props} />, modalRoot)
    document.body.style.overflow = 'hidden'
    addModal({ id, portal })
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
