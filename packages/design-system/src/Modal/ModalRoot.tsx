'use client'

import { mergeCss } from '../utils'
import { useModalStore } from './modal-store-provider'

export const ModalRoot = () => {
  const modal = useModalStore((state) => state.modal)

  return (
    <div
      id="modal-root"
      className={mergeCss('fixed z-10 inset-0', {
        hidden: !modal,
        'bg-background-see-through': modal?.blocking === true,
        'bg-transparent pointer-events-none': modal?.blocking === false,
      })}
    >
      {modal?.portal}
    </div>
  )
}
