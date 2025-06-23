'use client'

import { type IngredientDto } from '@repo/recipes-codegen/models'
import { useRecipe } from '@src/providers/recipe-provider'
import React from 'react'
import { type ZodError } from 'zod/v4'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'

interface StepsProps {
  editable: boolean
}
export const Steps = (props: StepsProps) => {
  const { steps, addStep } = useRecipe()

  const handleIngredientsError = (
    id: string,
    error: ZodError<IngredientDto[]>,
  ) => {
    console.log(id, error, props)
  }

  return (
    <div>
      {steps.map((s) => {
        return (
          <React.Fragment key={s.id}>
            <IngredientsTextArea
              id={s.id}
              onTextChangeError={handleIngredientsError}
            />
            <InstructionsTextArea />
          </React.Fragment>
        )
      })}
      <button type="button" onClick={addStep}>
        Add step
      </button>
    </div>
  )
}
