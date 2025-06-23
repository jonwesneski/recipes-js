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
    addModal({ id, portal })
    return showModal
  }

  const closeModal = () => {
    removeModal()
  }

  return {
    showModal,
    closeModal,
  }
}
