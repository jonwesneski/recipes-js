'use client'

import { TextButton } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { withRetry } from '@src/utils/withRetry'
import { Fragment, useEffect, useRef, useState } from 'react'
import { StepInput, type StepInputHandle } from './StepInput'

export const StepList = () => {
  const stepIds = useRecipeStore((state) => state.stepIds)
  const addStep = useRecipeStore((state) => state.addStep)

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
            {index < stepIds.length - 1 && <hr className="mt-5" />}
          </Fragment>
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
