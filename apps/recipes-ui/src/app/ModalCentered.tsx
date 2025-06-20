import { useEffect, useRef } from 'react'
import { useCustomModal } from './hooks/useCustomModal'

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
  }, [])

  return (
    <div
      ref={divRef}
      className="shadow-lg rounded-3xl border-2 border-solid p-5"
      style={{
        backgroundColor: 'white',
        pointerEvents: 'all',
        left: '50%',
        position: 'inherit',
        transform: 'translate(-50%, 50%)',
      }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- I think I need it
      tabIndex={0}
    >
      {props.children}
    </div>
  )
}
