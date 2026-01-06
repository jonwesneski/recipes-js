'use client'

import { useEffect, useRef } from 'react'
import { useCustomModal } from './useCustomModal'

interface ModalCenteredProps {
  children: React.ReactNode
}
export const ModalCentered = (props: ModalCenteredProps) => {
  const divRef = useRef<HTMLDivElement>(null)

  const { closeModal } = useCustomModal()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    divRef.current?.focus()
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeModal])

  return (
    <div
      ref={divRef}
      className="shadow-2xl border-2 p-5 pointer-events-auto top-1/2 left-1/2 outline-hidden"
      style={{
        position: 'inherit',
        transform: 'translate(-50%, -50%)',
      }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- I think I need it
      tabIndex={0}
    >
      {props.children}
    </div>
  )
}
