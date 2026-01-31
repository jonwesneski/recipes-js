'use client'

import IngredientList from './IngredientList'

interface IStepProps {
  stepNumber: number
  stepId: string
  instruction: string | null
  scaleFactor: number
}
export const Step = (props: IStepProps) => {
  return (
    <>
      <h2 className="font-bold">step {props.stepNumber}:</h2>
      <article className="md:flex gap-8 ml-2 mt-2">
        <IngredientList
          className="ml-4"
          stepId={props.stepId}
          scaleFactor={props.scaleFactor}
        />

        <p className="mt-4 md:mt-0">{props.instruction}</p>
      </article>
    </>
  )
}
