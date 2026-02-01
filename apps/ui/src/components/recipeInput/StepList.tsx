'use client'

import { TextButton } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { withRetry } from '@src/utils/withRetry'
import { useEffect, useRef, useState } from 'react'
import {
  IngredientsTextArea,
  type IngredientsTextAreaHandle,
} from './IngredientsTextArea'
import {
  InstructionsTextArea,
  type InstructionsTextAreaHandle,
} from './InstructionsTextArea'
import { PhotoInput } from './PhotoInput'

export const StepList = () => {
  const steps = useRecipeStore((state) => state.steps)
  const stepIds = useRecipeStore((state) => state.stepIds)
  const addStep = useRecipeStore((state) => state.addStep)
  const setStepImage = useRecipeStore((state) => state.setStepImage)
  const insertIngredientsSteps = useRecipeStore(
    (state) => state.insertIngredientsSteps,
  )
  const insertInstructionsSteps = useRecipeStore(
    (state) => state.insertInstructionsSteps,
  )

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const focusAfterPasteIngredientsRef =
    useRef<IngredientsTextAreaHandle | null>(null)
  const [
    focusAfterPasteIngredientsStepId,
    setFocusAfterPasteIngredientsStepId,
  ] = useState<string | null>(null)
  const focusAfterPasteInstructionsRef =
    useRef<InstructionsTextAreaHandle | null>(null)
  const [
    focusAfterPasteInstructionsStepId,
    setFocusAfterPasteInstructionsStepId,
  ] = useState<string | null>(null)

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

  /* When some pastes in recipes that are already separated by linebreaks
   * we will add new steps for them
   */
  const handleOnIngredientsPaste = (
    stepId: string,
    ingredientId: string,
    value: string[][],
  ) => {
    const lastStepId = insertIngredientsSteps(stepId, ingredientId, value)
    setFocusAfterPasteIngredientsStepId(lastStepId)
  }

  /* When some pastes in recipes that are already separated by linebreaks
   * we will add new steps for them
   */
  const handleOnInstructionsPaste = (stepId: string, value: string[]) => {
    const lastStepId = insertInstructionsSteps(stepId, value)
    setFocusAfterPasteInstructionsStepId(lastStepId)
  }

  useEffect(() => {
    const newStepRef = [...itemRefs.current.values()].at(-1)
    if (isNewStep && newStepRef) {
      setIsNewStep(false)
      newStepRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isNewStep, itemRefs])

  useEffect(() => {
    if (!focusAfterPasteIngredientsStepId) return

    withRetry(() => {
      if (focusAfterPasteIngredientsRef.current) {
        focusAfterPasteIngredientsRef.current.focusLast()
        setFocusAfterPasteIngredientsStepId(null)
      }
      return !focusAfterPasteIngredientsRef.current
    }, 8)
  }, [focusAfterPasteIngredientsStepId])

  useEffect(() => {
    if (!focusAfterPasteInstructionsStepId) return

    withRetry(() => {
      if (focusAfterPasteInstructionsRef.current) {
        focusAfterPasteInstructionsRef.current.focus()
        setFocusAfterPasteInstructionsStepId(null)
      }
      return !focusAfterPasteInstructionsRef.current
    }, 8)
  }, [focusAfterPasteInstructionsStepId])

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
                ref={
                  focusAfterPasteIngredientsStepId === stepId
                    ? focusAfterPasteIngredientsRef
                    : undefined
                }
                className="flex-1"
                stepId={stepId}
                stepNumber={stepNumber}
                onResize={(height: number) => handleOnResize(stepId, height)}
                onPaste={handleOnIngredientsPaste}
              />
              <InstructionsTextArea
                ref={
                  focusAfterPasteInstructionsStepId === stepId
                    ? focusAfterPasteInstructionsRef
                    : undefined
                }
                className="flex-1"
                stepId={stepId}
                stepNumber={stepNumber}
                onResize={(height: number) => handleOnResize(stepId, height)}
                onPaste={handleOnInstructionsPaste}
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
