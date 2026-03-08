'use client'

import { useRecipeStore } from '@src/providers/recipe-store-provider'
import IngredientList from './IngredientList'
import { ViewPhotoButton } from './ViewPhotoButton'

interface IStepProps {
  stepNumber: number
  stepId: string
  instruction: string | null
  scaleFactor: number
}
export const Step = (props: IStepProps) => {
  const imageSrc = useRecipeStore((state) => state.steps[props.stepId].imageSrc)
  return (
    <>
      <h2 className="font-bold">step {props.stepNumber}:</h2>
      <article className="mt-2 ml-2">
        <div className="md:flex gap-8">
          <IngredientList
            className="ml-4"
            stepId={props.stepId}
            scaleFactor={props.scaleFactor}
          />

          <p className="mt-4 md:mt-0">{props.instruction}</p>
        </div>
        {imageSrc ? (
          <div className="flex justify-end">
            <ViewPhotoButton photoUrl={imageSrc} />
          </div>
        ) : null}
      </article>
    </>
  )
}
