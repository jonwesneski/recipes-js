'use client'

import { SharedButton } from '@repo/ui'
import { useRecipe } from '@src/providers/recipe-provider'
import { type IngredientsValidator } from '@src/utils/ingredientsValidator'
import { type RefObject } from 'react'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'

export const Steps = () => {
  const { steps, addStep, insertIngredientsSteps, setIngredients } = useRecipe()

  const handleIngredients = (
    index: string,
    ingredients: IngredientsValidator,
  ) => {
    setIngredients(index, ingredients)
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
    console.log(stepId, instructions)
  }

  const handleOnPasteInstructions = (
    stepId: string,
    instructions: string[],
  ) => {
    console.log(stepId, instructions)
  }

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
              ref={s.ingredientRef}
              ingredients={s.ingredients.stringValue}
              onTextChange={(ingredients: IngredientsValidator) =>
                handleIngredients(s.id, ingredients)
              }
              onPaste={(data: IngredientsValidator[]) =>
                handleOnPasteIngredients(s.id, data)
              }
              onResize={(height: number) => handleOnResize(s.ref, height)}
            />
            <InstructionsTextArea
              instructions=""
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
