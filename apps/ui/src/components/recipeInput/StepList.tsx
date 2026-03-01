'use client'

import { TextButton } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { withRetry } from '@src/utils/withRetry'
import { Fragment, useEffect, useRef, useState } from 'react'
import { StepInput, type StepInputHandle } from './StepInput'

export const StepList = () => {
  const stepIds = useRecipeStore((state) => state.stepIds)
  const isLastStepEmpty = useRecipeStore((state) => {
    const lastStep = state.steps[state.stepIds[state.stepIds.length - 1]]
    const lastIngredient =
      state.ingredients[
        lastStep.ingredientIds[lastStep.ingredientIds.length - 1]
      ]
    const isLastIngredientEmpty =
      !lastIngredient.amount.value &&
      !lastIngredient.unit.value &&
      !lastIngredient.name.value
    return (
      isLastIngredientEmpty && !lastStep.instruction?.length && !state.imageSrc
    )
  })
  const addStep = useRecipeStore((state) => state.addStep)
  const removeStep = useRecipeStore((state) => state.removeStep)

  const itemRefs = useRef<Map<string, StepInputHandle>>(new Map())

  const [isNewStep, setIsNewStep] = useState<boolean>(false)

  const handleOnAddClick = () => {
    setIsNewStep(true)
    addStep()
  }

  useEffect(() => {
    const newStepRef = [...itemRefs.current.values()].at(-1)
    if (isNewStep && newStepRef) {
      setIsNewStep(false)
      newStepRef.scrollIntoView()
    }
  }, [isNewStep, itemRefs])

  const handleOnFocusStepIngredients = (stepId: string) => {
    withRetry(() => {
      const stepElement = itemRefs.current.get(stepId)
      if (stepElement) {
        stepElement.focusIngredients()
      }
      return !stepElement
    }, 8)
  }

  const handleOnFocusStepInstructions = (stepId: string) => {
    withRetry(() => {
      const stepElement = itemRefs.current.get(stepId)
      if (stepElement) {
        stepElement.focusInstructions()
      }
      return !stepElement
    }, 8)
  }

  return (
    <>
      {stepIds.map((stepId, index) => {
        const stepNumber = index + 1
        return (
          <Fragment key={stepId}>
            <div data-testid="step-row" className="mb-5">
              <div className="flex justify-between items-center my-3">
                <h3 className="font-bold">step {stepNumber}.</h3>
                <TextButton
                  className="float-right"
                  disabled={stepIds.length === 1}
                  text={`remove step ${stepNumber}`}
                  onClick={() => removeStep(stepId)}
                />
              </div>
              <StepInput
                ref={(element) => {
                  if (element) {
                    itemRefs.current.set(stepId, element)
                  } else {
                    itemRefs.current.delete(stepId)
                  }
                }}
                stepId={stepId}
                stepNumber={stepNumber}
                onFocusStepIngredients={handleOnFocusStepIngredients}
                onFocusStepInstructions={handleOnFocusStepInstructions}
              />
            </div>
            {index < stepIds.length - 1 && <hr className="mt-5" />}
          </Fragment>
        )
      })}
      <hr />
      <TextButton
        className="float-right mt-3"
        text="add step"
        disabled={isLastStepEmpty}
        onClick={handleOnAddClick}
      />
    </>
  )
}
