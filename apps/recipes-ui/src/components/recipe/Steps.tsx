'use client'

import { SharedButton } from '@repo/ui'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { type IngredientsValidator } from '@src/utils/ingredientsValidator'
import { useEffect, type RefObject } from 'react'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'

export const Steps = () => {
  const {
    steps,
    addStep,
    setIngredients,
    setInstructions,
    insertIngredientsSteps,
    insertInstructionsSteps,
  } = useRecipeStore((state) => state)

  const handleOnIngredients = (
    stepId: string,
    ingredients: IngredientsValidator,
  ) => {
    setIngredients(stepId, ingredients)
  }

  const handleOnPasteIngredients = (
    stepId: string,
    ingredients: IngredientsValidator[],
  ) => {
    insertIngredientsSteps(stepId, ingredients)
  }

  const handleOnResize = (
    stepRef: RefObject<HTMLDivElement | null>,
    height: number,
  ) => {
    if (stepRef.current) {
      stepRef.current.style.height = `${height}px`
    }
  }

  const handleOnInstructions = (stepId: string, instructions: string) => {
    setInstructions(stepId, instructions)
  }

  const handleOnPasteInstructions = (
    stepId: string,
    instructions: string[],
  ) => {
    insertInstructionsSteps(stepId, instructions)
  }

  useEffect(() => {
    console.log(steps)
  }, [steps])

  return (
    <div>
      {steps.map((s) => {
        return (
          <div
            ref={s.ref}
            key={s.id}
            className="md:grid md:grid-cols-2 md:gap-4"
          >
            <IngredientsTextArea
              ref={s.ingredientsRef}
              ingredients={s.ingredients.stringValue}
              onTextChange={(ingredients: IngredientsValidator) =>
                handleOnIngredients(s.id, ingredients)
              }
              onPaste={(data: IngredientsValidator[]) =>
                handleOnPasteIngredients(s.id, data)
              }
              onResize={(height: number) => handleOnResize(s.ref, height)}
            />
            <InstructionsTextArea
              ref={s.instructionsRef}
              instructions={s.instructions}
              onTextChange={(instructions: string) =>
                handleOnInstructions(s.id, instructions)
              }
              onPaste={(data: string[]) =>
                handleOnPasteInstructions(s.id, data)
              }
              onResize={(height: number) => handleOnResize(s.ref, height)}
            />
          </div>
        )
      })}
      <SharedButton onClick={addStep} text="Add Step" />
    </div>
  )
}
