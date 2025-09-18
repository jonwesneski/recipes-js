'use client'

import { mergeCss } from '../utils'
import { useModalStore } from './modal-store-provider'

export const ModalRoot = () => {
  const modal = useModalStore((state) => state.modal)

  return (
    <div
      id="modal-root"
      className={mergeCss(
        'fixed z-10 bg-background-see-through top-0 left-0 right-0 bottom-0 pointer-events-none',
        { hidden: !modal },
      )}
    >
      {modal?.portal}
    </div>
  )
}
