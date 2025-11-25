'use client'

import { TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useEffect, useRef } from 'react'
import { Categories } from './Categories'
import { ServingsAndNutritionalFacts } from './NutritionalFacts'
import { PhotoInput } from './PhotoInput'
import { Steps } from './Steps'
import { TimeTextLabel } from './TimeTextLabel'

export const RecipeInput = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const {
    name,
    setName,
    description,
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

  const handleOnRemoveClick = () => {
    setImage(null)
  }

  return (
    <div ref={divRef} className="flex flex-col gap-10">
      <section>
        <TextLabel
          className="w-5/6 md:max-w-3xl"
          ref={nameRef}
          name="recipe-name"
          value={name}
          error={errors.name}
          label="recipe name"
          isRequired
          onChange={handleOnNameChange}
        />

        <TextLabel
          className="w-5/6 md:max-w-3xl"
          name="description"
          value={description ?? ''}
          label="short description"
          isRequired={false}
          onChange={handleOnDescriptionChange}
        />

        <div className="flex gap-7">
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
          id="recipe-photo"
          label="recipe photo"
          base64Src={base64Image}
          isRequired={false}
          onCameraClick={handleOnCameraClick}
          onUploadClick={handleOnUploadClick}
          onRemoveClick={handleOnRemoveClick}
        />
      </section>

      <hr className="border-t border-dotted mt-10" />
      <Steps />
      <hr className="border-t border-dotted mt-10" />
      <ServingsAndNutritionalFacts />
      <hr className="border-t border-dotted mt-10" />
      <Categories />
      <hr className="border-t border-dotted my-10" />
    </div>
  )
}
