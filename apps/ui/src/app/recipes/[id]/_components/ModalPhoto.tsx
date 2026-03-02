'use client'

import { ModalCentered } from '@repo/design-system'
import Image from 'next/image'

interface ModalPhotoProps {
  photoUrl: string
  onClose: () => void
}
export const ModalPhoto = (props: ModalPhotoProps) => {
  return (
    <ModalCentered>
      <Image
        src={props.photoUrl}
        className="mx-auto object-contain"
        width={400}
        height={400}
        alt="photo of recipe"
      />
    </ModalCentered>
  )
}
