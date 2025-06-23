'use client'

import { SharedButton } from '@repo/ui'
import { useRecipe } from '@src/providers/recipe-provider'
import { IngredientsValidator } from '@src/utils/ingredientsValidator'
import React from 'react'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'

interface StepsProps {
  editable: boolean
}
export const Steps = (props: StepsProps) => {
  const { steps, addStep, insertSteps, setIngredients } = useRecipe()

  const handleIngredientValid = (
    index: string,
    ingredients: IngredientsValidator,
  ) => {
    setIngredients(index, ingredients)
  }

  const handleOnPaste = (stepId: string, data: IngredientsValidator[]) => {
    insertSteps(stepId, data)
  }

  return (
    <div>
      {steps.map((s) => {
        return (
          <React.Fragment key={s.id}>
            <IngredientsTextArea
              ingredients={s.ingredients.stringValue}
              onTextChange={(ingredients: IngredientsValidator) =>
                handleIngredientValid(s.id, ingredients)
              }
              onPaste={(data: IngredientsValidator[]) =>
                handleOnPaste(s.id, data)
              }
            />
            <InstructionsTextArea />
          </React.Fragment>
        )
      })}
      <SharedButton onClick={addStep} text="Add Step" />
    </div>
  )
}
