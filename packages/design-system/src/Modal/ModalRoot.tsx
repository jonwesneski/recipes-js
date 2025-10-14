'use client'

import { mergeCss } from '../utils'
import { useModalStore } from './modal-store-provider'

export const ModalRoot = () => {
  const modal = useModalStore((state) => state.modal)

  return (
    <div
      id="modal-root"
      className={mergeCss('fixed z-10 bg-background-see-through inset-0', {
        hidden: !modal,
      })}
    >
      {modal?.portal}
    </div>
  )
}
