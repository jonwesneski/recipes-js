import { useEffect, useRef } from 'react';
import { useCustomModal } from './hooks/useCustomModal';

interface ModalCenteredProps {
    children: React.ReactNode
}
export const ModalCentered = (props: ModalCenteredProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const {closeModal} = useCustomModal();

  useEffect(() => {
    divRef?.current?.focus();
  }, [])

  const handleClick = () => {
    console.log('buer')
    closeModal()
  }
  
  return (
    <div ref={divRef} style={{ backgroundColor: 'white', pointerEvents: 'all', left: '50%', position: 'inherit', transform: 'translate(-50%, 50%)'}} onBlur={() => handleClick()} tabIndex={0}>
      {props.children}
    </div>
  )
}
