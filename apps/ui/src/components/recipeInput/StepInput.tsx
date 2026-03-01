'use client'

import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  IngredientsTextArea,
  type IngredientsTextAreaHandle,
} from './IngredientsTextArea'
import {
  InstructionsTextArea,
  type InstructionsTextAreaHandle,
} from './InstructionsTextArea'
import { PhotoInput } from './PhotoInput'

export interface StepInputHandle {
  scrollIntoView: () => void
  focusIngredients: () => void
  focusInstructions: () => void
}
interface StepInputProps {
  stepId: string
  stepNumber: number
  onFocusStepInstructions: (_stepId: string) => void
  onFocusStepIngredients: (_stepId: string) => void
}
export const StepInput = forwardRef<StepInputHandle, StepInputProps>(
  (props: StepInputProps, ref) => {
    const step = useRecipeStore((state) => state.steps[props.stepId])
    const setStepImage = useRecipeStore((state) => state.setStepImage)
    const insertIngredientsSteps = useRecipeStore(
      (state) => state.insertIngredientsSteps,
    )
    const insertInstructionsSteps = useRecipeStore(
      (state) => state.insertInstructionsSteps,
    )

    const ingredientsRef = useRef<IngredientsTextAreaHandle | null>(null)
    const instructionsRef = useRef<InstructionsTextAreaHandle | null>(null)
    const stepRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => ({
      scrollIntoView: () => {
        stepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
      focusIngredients: () => {
        ingredientsRef.current?.focusLast()
      },
      focusInstructions: () => {
        instructionsRef.current?.focus()
      },
    }))

    const handleOnCameraClick = (image: string) => {
      setStepImage(props.stepId, image)
    }

    const handleOnUploadClick = (image: string) => {
      setStepImage(props.stepId, image)
    }

    const handleOnRemoveImageClick = () => {
      setStepImage(props.stepId, null)
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
      props.onFocusStepIngredients(lastStepId)
    }

    /* When some pastes in recipes that are already separated by linebreaks
     * we will add new steps for them
     */
    const handleOnInstructionsPaste = (stepId: string, value: string[]) => {
      const lastStepId = insertInstructionsSteps(stepId, value)
      props.onFocusStepInstructions(lastStepId)
    }

    const handleOnResize = (height: number) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
      stepRef.current!.style.height = `${height}px`
    }

    return (
      <div data-testid="step-row" className="mb-5">
        <h3 className="font-bold">step {props.stepNumber}.</h3>
        <div ref={stepRef} className="step-container">
          <IngredientsTextArea
            ref={ingredientsRef}
            className="flex-1"
            stepId={props.stepId}
            stepNumber={props.stepNumber}
            onResize={handleOnResize}
            onPaste={handleOnIngredientsPaste}
          />
          <InstructionsTextArea
            ref={instructionsRef}
            className="flex-1"
            stepId={props.stepId}
            stepNumber={props.stepNumber}
            onResize={handleOnResize}
            onPaste={handleOnInstructionsPaste}
          />
        </div>
        <div className="mx-auto">
          <PhotoInput
            id={`step-photo-${props.stepNumber}`}
            imageSrc={step.imageUrl}
            label="step photo"
            isRequired={false}
            onCameraClick={handleOnCameraClick}
            onUploadClick={handleOnUploadClick}
            onRemoveClick={handleOnRemoveImageClick}
          />
        </div>
      </div>
    )
  },
)
StepInput.displayName = 'Step'
