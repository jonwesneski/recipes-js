'use client'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import { type StepItemType } from '@src/stores/recipe-store'
import { numberToFraction } from '@src/utils/measurements'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type UniqueIngredientsType = Record<
  string,
  {
    amount: number
    unit: string
  }
>

const createUniqueIngredient = (
  steps: StepItemType[],
): UniqueIngredientsType => {
  const uniqueIngredients: UniqueIngredientsType = {}
  steps.forEach((step) => {
    step.ingredients.items.forEach((i) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- not true
      if (!uniqueIngredients[i.ingredient.dto.name]) {
        uniqueIngredients[i.ingredient.dto.name] = {
          amount: i.ingredient.dto.amount,
          unit: i.ingredient.dto.unit,
        }
      } else {
        uniqueIngredients[i.ingredient.dto.name].amount +=
          i.ingredient.dto.amount
      }
    })
  })
  return uniqueIngredients
}

export type RecipeIngredientsOverviewProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'style'
>
export const RecipeIngredientsOverview = (
  props: RecipeIngredientsOverviewProps,
) => {
  const steps = useRecipeStore((state) => state.steps)
  const uniqueIngredients = createUniqueIngredient(steps)
  const useFractions = useUserStore((state) => state.useFractions)

  return (
    <div {...props}>
      <h1 className="font-semibold">total ingredients:</h1>
      <ul className="ml-2">
        {Object.keys(uniqueIngredients).map((name) => (
          <li key={name} style={{ listStyleType: 'none' }}>
            {`${useFractions ? numberToFraction(uniqueIngredients[name].amount) : uniqueIngredients[name].amount} ${uniqueIngredients[name].unit} ${name}`}
          </li>
        ))}
      </ul>
    </div>
  )
}
