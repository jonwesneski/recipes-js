'use client'

import { TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { PhotoInput } from './PhotoInput'
import { Steps } from './Steps'
import { TimeTextLabel } from './TimeTextLabel'

export const RecipeInput = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const {
    setName,
    setDescription,
    setCookingTimeInMinutes,
    setPreparationTimeInMinutes,
    setImage,
    imageSrc: base64Image,
    errors,
  } = useRecipeStore((state) => state)

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const firstError = Object.keys(errors)[0]
    if (firstError && divRef.current) {
      const element = divRef.current.querySelector(
        `[data-error-for="${firstError}"]`,
      )

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        ;(element as HTMLElement).focus({ preventScroll: true })
      }
    }
  }, [errors])

  const handleOnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleOnDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDescription(event.target.value)
  }

  const handleOnPrepChange = (time: string) => {
    setPreparationTimeInMinutes(_convertToMinutes(time))
  }

  const handleOnCookChange = (time: string) => {
    setCookingTimeInMinutes(_convertToMinutes(time))
  }

  const _convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 60 + parseInt(minutes)
  }

  const handleOnCameraClick = (image: string) => {
    setImage(image)
  }

  const handleOnUploadClick = (image: string) => {
    setImage(image)
  }

  return (
    <div ref={divRef} className="flex flex-col gap-10">
      <TextLabel
        ref={nameRef}
        name="name"
        error={errors.name}
        placeholder="Recipe name"
        label="recipe name"
        isRequired
        onChange={handleOnNameChange}
      />

      <TextLabel
        name="description"
        placeholder="Short description"
        label="description"
        isRequired={false}
        onChange={handleOnDescriptionChange}
      />

      <div className="flex">
        <TimeTextLabel
          name="prep-time"
          label="prep time"
          onChange={handleOnPrepChange}
        />
        <TimeTextLabel
          name="cook-time"
          label="cook time"
          onChange={handleOnCookChange}
        />
      </div>

      <PhotoInput
        label="recipe photo"
        isRequired={false}
        onCameraClick={handleOnCameraClick}
        onUploadClick={handleOnUploadClick}
      />

      {base64Image ? (
        <Image
          src={base64Image}
          className="w-9/10 h-auto mx-auto"
          width={0}
          height={0}
          alt="taken"
        />
      ) : null}
      <hr className="h-1 bg-text border-none" />
      <Steps />
      <hr className="h-1 bg-text border-none" />
    </div>
  )
}
