'use client'

import { TextButton } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useEffect, useRef, useState } from 'react'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'
import { PhotoInput } from './PhotoInput'

export const StepList = () => {
  const { steps, addStep, setStepImage } = useRecipeStore((state) => state)
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [isNewStep, setIsNewStep] = useState<boolean>(false)

  const handleOnResize = (keyId: string, height: number) => {
    const stepElement = itemRefs.current.get(keyId)
    if (stepElement) {
      stepElement.style.height = `${height}px`
    }
  }

  const handleOnCameraClick = (keyId: string, image: string) => {
    setStepImage(keyId, image)
  }

  const handleOnUploadClick = (keyId: string, image: string) => {
    setStepImage(keyId, image)
  }

  const handleOnRemoveImageClick = (keyId: string) => {
    setStepImage(keyId, null)
  }

  const handleOnAddClick = () => {
    setIsNewStep(true)
    addStep()
  }

  useEffect(() => {
    const newStepRef = [...itemRefs.current.values()].at(-1)
    if (isNewStep && newStepRef) {
      setIsNewStep(false)
      newStepRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isNewStep, itemRefs])

  return (
    <>
      {steps.map((s, index) => {
        const stepNumber = index + 1
        return (
          <div key={s.keyId} data-testid="step-row" className="mb-5">
            <h3 className="font-bold">step {stepNumber}.</h3>
            <div
              ref={(element) => {
                if (element) {
                  itemRefs.current.set(s.keyId, element)
                } else {
                  itemRefs.current.delete(s.keyId)
                }
              }}
              className="step-container"
            >
              <IngredientsTextArea
                className="flex-1"
                keyId={s.ingredients.keyId}
                stepNumber={stepNumber}
                onResize={(height: number) => handleOnResize(s.keyId, height)}
              />
              <InstructionsTextArea
                className="flex-1"
                keyId={s.instructions.keyId}
                stepNumber={stepNumber}
                onResize={(height: number) => handleOnResize(s.keyId, height)}
              />
            </div>
            <div className="mx-auto">
              <PhotoInput
                id={`step-photo-${index}`}
                base64Src={s.image}
                label="step photo"
                isRequired={false}
                onCameraClick={(image) => handleOnCameraClick(s.keyId, image)}
                onUploadClick={(image) => handleOnUploadClick(s.keyId, image)}
                onRemoveClick={() => handleOnRemoveImageClick(s.keyId)}
              />
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
    </>
  )
}
