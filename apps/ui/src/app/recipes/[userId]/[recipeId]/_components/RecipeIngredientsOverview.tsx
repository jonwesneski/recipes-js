'use client'
import type { StepEntity } from '@repo/codegen/model'
import { useUserStore } from '@src/providers/use-store-provider'
import { numberToFraction } from '@src/utils/measurements'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

type UniqueIngredientsType = Record<
  string,
  {
    amount: number
    unit: string
  }
>

const createUniqueIngredient = (steps: StepEntity[]): UniqueIngredientsType => {
  const uniqueIngredients: UniqueIngredientsType = {}
  steps.forEach((step) => {
    step.ingredients.forEach((ingredient) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- not true
      if (!uniqueIngredients[ingredient.name]) {
        uniqueIngredients[ingredient.name] = {
          amount: ingredient.amount,
          unit: ingredient.unit,
        }
      } else {
        uniqueIngredients[ingredient.name].amount += ingredient.amount
      }
    })
  })
  return uniqueIngredients
}

export type RecipeIngredientsOverviewProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'style'
> & { steps: StepEntity[] }
export const RecipeIngredientsOverview = ({
  steps,
  ...props
}: RecipeIngredientsOverviewProps) => {
  const uniqueIngredients = createUniqueIngredient(steps)
  const useFractions = useUserStore((state) => state.useFractions)

  return (
    <div {...props}>
      <h1 className="font-semibold">total ingredients:</h1>
      <ul className="ml-2">
        {Object.keys(uniqueIngredients).map((name, idx) => (
          <li key={idx} style={{ listStyleType: 'none' }}>
            {`${useFractions ? numberToFraction(uniqueIngredients[name].amount) : uniqueIngredients[name].amount} ${uniqueIngredients[name].unit} ${name}`}
          </li>
        ))}
      </ul>
    </div>
  )
}
