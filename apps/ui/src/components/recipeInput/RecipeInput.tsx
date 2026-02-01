'use client'

import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useEffect, useRef } from 'react'
import { BasicInfoInput } from './BasicInfoInput'
import { Categories } from './Categories'
import { PhotoInput } from './PhotoInput'
import { SectionListLayout } from './SectionLayout'
import { ServingsAndNutritionalFacts } from './ServingsAndNutritionalFacts'
import { StepList } from './StepList'

export const RecipeInput = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const setImage = useRecipeStore((state) => state.setImage)
  const base64Image = useRecipeStore((state) => state.imageSrc)
  const errors = useRecipeStore((state) => state.metadata.errors)
  console.log('gggg')

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
      <SectionListLayout
        items={[
          {
            title: 'basic info',
            children: <BasicInfoInput />,
          },
          {
            title: 'steps',
            children: <StepList />,
          },
          {
            title: 'finished photo',
            children: (
              <PhotoInput
                id="recipe-photo"
                label="recipe photo"
                imageSrc={base64Image}
                isRequired={false}
                onCameraClick={handleOnCameraClick}
                onUploadClick={handleOnUploadClick}
                onRemoveClick={handleOnRemoveClick}
              />
            ),
          },
          {
            title: 'servings & nutritional facts',
            children: <ServingsAndNutritionalFacts />,
          },
          {
            title: 'categories',
            children: <Categories />,
          },
        ]}
      />
    </div>
  )
}
