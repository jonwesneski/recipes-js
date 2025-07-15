'use client'

import { TextLabel } from '@repo/design-system'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PhotoInput } from './PhotoInput'
import { Steps } from './Steps'
import { TimeTextLabel } from './TimeTextLabel'

export const Recipe = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const [_image, setImage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [])

  const handleOnCameraClick = (image: string) => {
    setImage(image)
  }

  const handleOnUploadClick = (image: string) => {
    setImage(image)
  }

  return (
    <div className="flex flex-col gap-10">
      <TextLabel
        ref={nameRef}
        name="recipe"
        placeholder="Recipe name"
        label="recipe name"
        isRequired
      />

      <TextLabel
        name="description"
        placeholder="Short description"
        label="description"
        isRequired={false}
      />

      <div className="flex">
        <TimeTextLabel name="prep-time" label="prep time" />
        <TimeTextLabel name="cook-time" label="cook time" />
      </div>

      <PhotoInput
        label="recipe photo"
        isRequired
        onCameraClick={handleOnCameraClick}
        onUploadClick={handleOnUploadClick}
      />

      {_image !== undefined && (
        <Image
          src={_image}
          className="w-9/10 h-auto mx-auto"
          width={0}
          height={0}
          alt="taken"
        />
      )}
      <hr className="h-1 bg-text border-none" />
      <Steps />
      <hr className="h-1 bg-text border-none" />
    </div>
  )
}
