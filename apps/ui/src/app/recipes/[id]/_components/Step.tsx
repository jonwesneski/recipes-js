'use client'

import { type StepItemType } from '@src/stores/recipe-store'
import IngredientList from './IngredientList'

interface IStepProps {
  stepNumber: number
  step: StepItemType
  scaleFactor: number
}
export const Step = (props: IStepProps) => {
  return (
    <>
      <h1 className="font-bold">step {props.stepNumber}:</h1>
      <div className="md:flex gap-8 ml-2 mt-2">
        <IngredientList
          className="ml-4"
          ingredients={props.step.ingredients.items.map((i) => ({
            id: i.keyId,
            ...i.ingredient.dto,
          }))}
          scaleFactor={props.scaleFactor}
        />

        <p className="mt-4 md:mt-0">{props.step.instructions.value}</p>
      </div>
    </>
  )
}
