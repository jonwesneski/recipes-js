'use client'

import { TextButton } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useEffect, useRef, useState } from 'react'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'
import { PhotoInput } from './PhotoInput'

export const StepList = () => {
  const { steps, stepIds, addStep, setStepImage } = useRecipeStore(
    (state) => state,
  )
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
      {stepIds.map((stepId, index) => {
        const stepNumber = index + 1
        return (
          <div key={stepId} data-testid="step-row" className="mb-5">
            <h3 className="font-bold">step {stepNumber}.</h3>
            <div
              ref={(element) => {
                if (element) {
                  itemRefs.current.set(stepId, element)
                } else {
                  itemRefs.current.delete(stepId)
                }
              }}
              className="step-container"
            >
              <IngredientsTextArea
                className="flex-1"
                stepId={stepId}
                stepNumber={stepNumber}
                onResize={(height: number) => handleOnResize(stepId, height)}
              />
              <InstructionsTextArea
                className="flex-1"
                keyId={stepId}
                stepNumber={stepNumber}
                onResize={(height: number) => handleOnResize(stepId, height)}
              />
            </div>
            <div className="mx-auto">
              <PhotoInput
                id={`step-photo-${index}`}
                imageSrc={steps[stepId].imageUrl}
                label="step photo"
                isRequired={false}
                onCameraClick={(image) => handleOnCameraClick(stepId, image)}
                onUploadClick={(image) => handleOnUploadClick(stepId, image)}
                onRemoveClick={() => handleOnRemoveImageClick(stepId)}
              />
            </div>
            {index < stepIds.length - 1 && <hr className="mt-5" />}
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
