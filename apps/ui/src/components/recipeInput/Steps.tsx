'use client'

import { TextButton } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import Image from 'next/image'
import { useEffect, useState, type RefObject } from 'react'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'
import { PhotoInput } from './PhotoInput'

interface IStepsProps {
  className?: string
}
export const Steps = (props: IStepsProps) => {
  const { steps, addStep, setStepImage } = useRecipeStore((state) => state)
  const [isNewStep, setIsNewStep] = useState<boolean>(false)

  const handleOnResize = (
    stepRef: RefObject<HTMLDivElement | null>,
    height: number,
  ) => {
    if (stepRef.current) {
      stepRef.current.style.height = `${height}px`
    }
  }

  const handleOnCameraClick = (
    stepRef: RefObject<HTMLDivElement | null>,
    image: string,
  ) => {
    setStepImage(stepRef, image)
  }

  const handleOnUploadClick = (
    stepRef: RefObject<HTMLDivElement | null>,
    image: string,
  ) => {
    setStepImage(stepRef, image)
  }

  const handleOnRemoveImageClick = (
    stepRef: RefObject<HTMLDivElement | null>,
  ) => {
    setStepImage(stepRef, null)
  }

  const handleOnAddClick = () => {
    setIsNewStep(true)
    addStep()
  }

  useEffect(() => {
    const newStepRef = steps[steps.length - 1].ref.current
    if (isNewStep && newStepRef) {
      setIsNewStep(false)
      newStepRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isNewStep, steps.length])

  return (
    <div className={props.className}>
      <h1 className="text-3xl font-bold mb-10">Steps</h1>
      {steps.map((s, index) => {
        return (
          <div key={s.keyId} data-testid="step-row" className="mb-5">
            <h1 className="font-bold">step {index + 1}.</h1>
            <div ref={s.ref} className="flex flex-col md:flex-row gap-2">
              <IngredientsTextArea
                ref={s.ingredients.ref}
                onResize={(height: number) => handleOnResize(s.ref, height)}
              />
              <InstructionsTextArea
                ref={s.instructions.ref}
                onResize={(height: number) => handleOnResize(s.ref, height)}
              />
            </div>
            <div className="w-8/10 mx-auto mt-3">
              <PhotoInput
                id={`step-photo-${index}`}
                base64Src={s.image}
                label="step photo"
                isRequired={false}
                onCameraClick={(image) => handleOnCameraClick(s.ref, image)}
                onUploadClick={(image) => handleOnUploadClick(s.ref, image)}
                onRemoveClick={() => handleOnRemoveImageClick(s.ref)}
              />
              {s.image ? (
                <Image
                  src={s.image}
                  className="w-9/10 h-auto mx-auto"
                  width={0}
                  height={0}
                  alt="taken"
                />
              ) : null}
            </div>
            {index < steps.length - 1 && <hr className="mt-5" />}
          </div>
        )
      })}
      <hr />
      <TextButton
        className="float-right mt-3"
        text="add step"
        onClick={handleOnAddClick}
      />
    </div>
  )
}
