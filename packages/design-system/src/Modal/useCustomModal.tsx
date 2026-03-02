import { createPortal } from 'react-dom'
import { ModalType } from './modal-store'
import { useModalStore } from './modal-store-provider'

type CustomModalProps = Partial<
  Pick<ModalType, 'blocking' | 'backgroundGrayedOut'>
> & {
  disableScrolling?: boolean
}
export function useCustomModal() {
  const { addModal, removeModal } = useModalStore((state) => state)

  const showModal = <T extends object>(
    id: string,
    modalProps: CustomModalProps = {},
    Component: React.ComponentType<T>,
    componentProps: T,
  ) => {
    const {
      disableScrolling = false,
      blocking = false,
      backgroundGrayedOut = false,
    } = modalProps
    const modalRoot = document.getElementById('modal-root')
    if (!modalRoot) throw new Error('Root node not found. Cannot render modal.')
    const portal = createPortal(
      blocking ? (
        <Component {...componentProps} />
      ) : (
        <div className="pointer-events-auto">
          <Component {...componentProps} />
        </div>
      ),
      modalRoot,
    )
    if (blocking || disableScrolling) {
      // Prevent scrolling while modal is up
      document.body.style.overflow = 'hidden'
    }
    addModal({ id, portal, blocking, backgroundGrayedOut })
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
