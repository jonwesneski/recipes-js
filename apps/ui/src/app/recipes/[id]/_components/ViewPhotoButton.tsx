'use client'

import ImageIcon from '@public/imageIcon.svg'
import {
  type ClassValue,
  IconButton,
  useCustomModal,
} from '@repo/design-system'
import type { Svg } from '@src/types/svg'
import { ModalPhoto } from './ModalPhoto'

interface IViewPhotoButtonProps {
  className?: ClassValue
  photoUrl: string
}
export const ViewPhotoButton = (props: IViewPhotoButtonProps) => {
  const { showModal, closeModal } = useCustomModal()

  const handleOnClick = () => {
    showModal(
      ModalPhoto.name,
      () => <ModalPhoto photoUrl={props.photoUrl} onClose={closeModal} />,
      {},
      { backgroundGrayedOut: true, disableScrolling: true },
    )
  }

  return (
    <IconButton
      className={props.className}
      svgIcon={ImageIcon as Svg}
      onClick={handleOnClick}
      aria-label="View Photo"
    />
  )
}
